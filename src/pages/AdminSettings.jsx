import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { getSettings, updateSettings } from '../services/settings'

const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
]

// Página /admin/config — datos generales del negocio.
// Funcionalidad NUEVA: la tabla "business_settings" todavía
// no existe en Supabase, así que de momento se usan valores
// por defecto (ver services/settings.js) hasta que se cree.
export default function AdminSettings() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSettings()
      .then(setForm)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      await updateSettings(form)
      alert('Configuración guardada correctamente.')
    } catch (error) {
      console.error('ERROR GUARDANDO CONFIGURACIÓN:', error)
      alert(
        `No se ha podido guardar. Si la tabla "business_settings" aún no existe en Supabase, créala primero.\n\n${error.message}`
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <section className="admin-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">NEGOCIO</p>
            <h1>
              CONFIGU
              <br />
              <em>RACIÓN.</em>
            </h1>
          </div>
        </div>

        {loading || !form ? (
          <div className="empty-state">Cargando...</div>
        ) : (
          <div className="panel" style={{ maxWidth: '520px' }}>
            <form className="service-form" onSubmit={handleSubmit}>
              <label>
                NOMBRE DEL NEGOCIO
                <input
                  type="text"
                  value={form.business_name || ''}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, business_name: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                HORA DE APERTURA
                <input
                  type="time"
                  value={form.opening_time || ''}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, opening_time: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                HORA DE CIERRE
                <input
                  type="time"
                  value={form.closing_time || ''}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, closing_time: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                DÍA DE CIERRE SEMANAL
                <select
                  value={form.closed_weekday ?? 0}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      closed_weekday: Number(e.target.value),
                    }))
                  }
                >
                  {WEEKDAY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                className="primary-button modal-submit"
                disabled={saving}
              >
                {saving ? 'GUARDANDO...' : 'GUARDAR CONFIGURACIÓN →'}
              </button>
            </form>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
