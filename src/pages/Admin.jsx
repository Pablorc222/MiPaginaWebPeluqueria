import AdminLayout from '../components/layout/AdminLayout'
import AppointmentCard from '../components/calendar/AppointmentCard'
import AppointmentModal from '../components/appointments/AppointmentModal'
import { useAppointments } from '../hooks/useAppointments'
import { useClients } from '../hooks/useClients'
import { useRouter } from '../lib/router'
import { getTodayForDatabase } from '../utils/dates'
import { useState } from 'react'

// Página /admin — dashboard con estadísticas, citas de hoy y
// atajos. Antes era renderDashboard() dentro de AdminApp.jsx.
export default function Admin() {
  const { navigate } = useRouter()
  const { appointments, loading, saving, stats, refetch, updateStatus, removeAppointment } =
    useAppointments()
  const { clients } = useClients()
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const today = getTodayForDatabase()

  const todayAppointments = appointments
    .filter((appointment) => appointment.appointment_date === today)
    .sort((a, b) =>
      String(a.appointment_time || '').localeCompare(
        String(b.appointment_time || '')
      )
    )

  return (
    <AdminLayout>
      <section className="admin-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PANEL DE CONTROL</p>
            <h1>
              BUENOS DÍAS.
              <br />
              <em>A TRABAJAR.</em>
            </h1>
          </div>

          <button className="refresh-button" onClick={refetch} type="button">
            ↻ ACTUALIZAR
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>CITAS HOY</span>
            <strong>{stats.today}</strong>
          </div>

          <div className="stat-card">
            <span>PENDIENTES</span>
            <strong>{stats.pending}</strong>
          </div>

          <div className="stat-card">
            <span>CONFIRMADAS</span>
            <strong>{stats.confirmed}</strong>
          </div>

          <div className="stat-card">
            <span>CLIENTES</span>
            <strong>{clients.length}</strong>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">AGENDA</p>
                <h2>CITAS DE HOY</h2>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={() => navigate('/admin/calendario')}
              >
                VER TODAS →
              </button>
            </div>

            {loading ? (
              <div className="empty-state">Cargando citas...</div>
            ) : todayAppointments.length === 0 ? (
              <div className="empty-state">No hay citas para hoy.</div>
            ) : (
              <div className="today-list">
                {todayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={() => setSelectedAppointment(appointment)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="panel quick-actions">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">ACCIONES</p>
                <h2>ATAJOS</h2>
              </div>
            </div>

            <button type="button" onClick={() => navigate('/admin/calendario')}>
              <span>📅</span>
              GESTIONAR CITAS
            </button>

            <button type="button" onClick={() => navigate('/admin/clientes')}>
              <span>👤</span>
              VER CLIENTES
            </button>

            <button type="button" onClick={() => navigate('/admin/servicios')}>
              <span>✦</span>
              GESTIONAR SERVICIOS
            </button>
          </div>
        </div>
      </section>

      <AppointmentModal
        appointment={selectedAppointment}
        saving={saving}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={async (appointment, status) => {
          const ok = await updateStatus(appointment, status)
          if (ok) setSelectedAppointment((c) => (c ? { ...c, status } : c))
        }}
        onDelete={async (appointment) => {
          const ok = await removeAppointment(appointment)
          if (ok) setSelectedAppointment(null)
        }}
      />
    </AdminLayout>
  )
}
