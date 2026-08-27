import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { confirmAction } from '../components/common/ConfirmDialog'
import { formatDateFromDb } from '../utils/dates'
import {
  getBlockedDays,
  addBlockedDay,
  removeBlockedDay,
} from '../services/blockedDays'
import {
  getBlockedTimes,
  addBlockedTime,
  removeBlockedTime,
} from '../services/blockedTimes'

export default function AdminSchedule() {
  const [blockedDays, setBlockedDays] = useState([])
  const [blockedTimes, setBlockedTimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [tablesReady, setTablesReady] = useState(true)

  const [dayForm, setDayForm] = useState({
    date: '',
    reason: '',
  })

  const [timeForm, setTimeForm] = useState({
    date: '',
    time: '',
    reason: '',
  })

  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)

    try {
      const [days, times] = await Promise.all([
        getBlockedDays(),
        getBlockedTimes(),
      ])

      setBlockedDays(days || [])
      setBlockedTimes(times || [])
      setTablesReady(true)
    } catch (error) {
      console.error('ERROR CARGANDO HORARIOS BLOQUEADOS:', error)
      setTablesReady(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAddDay = async (event) => {
    event.preventDefault()

    if (!dayForm.date) {
      alert('Selecciona una fecha.')
      return
    }

    setSaving(true)

    try {
      await addBlockedDay(dayForm)

      setDayForm({
        date: '',
        reason: '',
      })

      await load()
    } catch (error) {
      alert(
        `No se ha podido bloquear el día.\n\n${
          error?.message || 'Error desconocido'
        }`,
      )
    } finally {
      setSaving(false)
    }
  }

  const handleAddTime = async (event) => {
    event.preventDefault()

    if (!timeForm.date || !timeForm.time) {
      alert('Selecciona fecha y hora.')
      return
    }

    setSaving(true)

    try {
      await addBlockedTime({
        ...timeForm,
        time: `${timeForm.time}:00`,
      })

      setTimeForm({
        date: '',
        time: '',
        reason: '',
      })

      await load()
    } catch (error) {
      alert(
        `No se ha podido bloquear la hora.\n\n${
          error?.message || 'Error desconocido'
        }`,
      )
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveDay = async (blockedDay) => {
    if (!confirmAction('¿Desbloquear este día?')) {
      return
    }

    try {
      await removeBlockedDay(blockedDay.id)
      await load()
    } catch (error) {
      alert(
        `No se ha podido desbloquear.\n\n${
          error?.message || 'Error desconocido'
        }`,
      )
    }
  }

  const handleRemoveTime = async (blockedTime) => {
    if (!confirmAction('¿Desbloquear esta hora?')) {
      return
    }

    try {
      await removeBlockedTime(blockedTime.id)
      await load()
    } catch (error) {
      alert(
        `No se ha podido desbloquear.\n\n${
          error?.message || 'Error desconocido'
        }`,
      )
    }
  }

  return (
    <AdminLayout>
      <section className="admin-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">DISPONIBILIDAD</p>

            <h1>
              TUS
              <br />
              <em>HORARIOS.</em>
            </h1>
          </div>
        </div>

        {!tablesReady && (
          <div className="empty-state">
            Todavía no existen las tablas{' '}
            <strong>blocked_days</strong> y{' '}
            <strong>blocked_times</strong> en Supabase.
            <br />
            Créalas para activar esta sección.
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            Cargando...
          </div>
        ) : (
          <div className="dashboard-grid">

            {/* =====================================================
                DÍAS BLOQUEADOS
            ====================================================== */}

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">CIERRES</p>
                  <h2>DÍAS BLOQUEADOS</h2>
                </div>
              </div>

              <form
                className="service-form"
                onSubmit={handleAddDay}
              >
                <label>
                  FECHA

                  <input
                    type="date"
                    value={dayForm.date}
                    onChange={(e) =>
                      setDayForm((current) => ({
                        ...current,
                        date: e.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  MOTIVO (OPCIONAL)

                  <input
                    type="text"
                    placeholder="Ej. Vacaciones"
                    value={dayForm.reason}
                    onChange={(e) =>
                      setDayForm((current) => ({
                        ...current,
                        reason: e.target.value,
                      }))
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="primary-button modal-submit"
                  disabled={saving || !tablesReady}
                >
                  + BLOQUEAR DÍA
                </button>
              </form>

              {blockedDays.length === 0 ? (
                <div className="empty-state">
                  No hay días bloqueados.
                </div>
              ) : (
                <div className="today-list blocked-schedule-list">
                  {blockedDays.map((day) => (
                    <div
                      className="today-item blocked-schedule-item"
                      key={day.id}
                    >
                      <span className="today-time blocked-schedule-date">
                        {formatDateFromDb(day.date)}
                      </span>

                      <span className="today-client blocked-schedule-reason">
                        <strong>
                          {day.reason || 'Sin motivo'}
                        </strong>
                      </span>

                      <button
                        type="button"
                        className="danger-text blocked-schedule-remove"
                        onClick={() => handleRemoveDay(day)}
                      >
                        QUITAR
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* =====================================================
                HORAS BLOQUEADAS
            ====================================================== */}

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">EXCEPCIONES</p>
                  <h2>HORAS BLOQUEADAS</h2>
                </div>
              </div>

              <form
                className="service-form"
                onSubmit={handleAddTime}
              >
                <label>
                  FECHA

                  <input
                    type="date"
                    value={timeForm.date}
                    onChange={(e) =>
                      setTimeForm((current) => ({
                        ...current,
                        date: e.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  HORA

                  <input
                    type="time"
                    value={timeForm.time}
                    onChange={(e) =>
                      setTimeForm((current) => ({
                        ...current,
                        time: e.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  MOTIVO (OPCIONAL)

                  <input
                    type="text"
                    placeholder="Ej. Formación"
                    value={timeForm.reason}
                    onChange={(e) =>
                      setTimeForm((current) => ({
                        ...current,
                        reason: e.target.value,
                      }))
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="primary-button modal-submit"
                  disabled={saving || !tablesReady}
                >
                  + BLOQUEAR HORA
                </button>
              </form>

              {blockedTimes.length === 0 ? (
                <div className="empty-state">
                  No hay horas bloqueadas.
                </div>
              ) : (
                <div className="today-list blocked-schedule-list">
                  {blockedTimes.map((time) => (
                    <div
                      className="today-item blocked-schedule-item"
                      key={time.id}
                    >
                      <span className="today-time blocked-schedule-date">
                        {formatDateFromDb(time.date)}{' '}
                        {time.time?.slice(0, 5)}
                      </span>

                      <span className="today-client blocked-schedule-reason">
                        <strong>
                          {time.reason || 'Sin motivo'}
                        </strong>
                      </span>

                      <button
                        type="button"
                        className="danger-text blocked-schedule-remove"
                        onClick={() => handleRemoveTime(time)}
                      >
                        QUITAR
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </section>
    </AdminLayout>
  )
}
