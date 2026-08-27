```jsx
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

// Página /admin/horarios — gestión de días y horas bloqueadas
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

      setBlockedDays(days)
      setBlockedTimes(times)
      setTablesReady(true)
    } catch (error) {
      console.error(
        'ERROR CARGANDO HORARIOS BLOQUEADOS:',
        error
      )

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
        `No se ha podido bloquear el día.\n\n${error.message}`
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
        `No se ha podido bloquear la hora.\n\n${error.message}`
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
        `No se ha podido desbloquear.\n\n${error.message}`
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
        `No se ha podido desbloquear.\n\n${error.message}`
      )
    }
  }

  return (
    <AdminLayout>
      <section className="admin-content">

        {/* =====================================================
            CABECERA
        ===================================================== */}

        <div className="page-heading">

          <div className="page-heading-content">
            <p className="eyebrow">
              DISPONIBILIDAD
            </p>

            <h1>
              TUS
              <br />
              <em>HORARIOS.</em>
            </h1>
          </div>

        </div>


        {/* =====================================================
            AVISO DE TABLAS
        ===================================================== */}

        {!tablesReady && (
          <div className="schedule-warning">
            Todavía no existen las tablas{' '}
            <strong>blocked_days</strong> y{' '}
            <strong>blocked_times</strong> en Supabase.
            Créalas para activar esta sección.
          </div>
        )}


        {/* =====================================================
            CARGANDO
        ===================================================== */}

        {loading ? (

          <div className="empty-state">
            Cargando...
          </div>

        ) : (

          <div className="dashboard-grid schedule-grid">

            {/* =================================================
                DÍAS BLOQUEADOS
            ================================================= */}

            <div className="panel schedule-panel">

              <div className="panel-heading">

                <div className="panel-heading-content">
                  <p className="eyebrow">
                    CIERRES
                  </p>

                  <h2>
                    DÍAS BLOQUEADOS
                  </h2>
                </div>

              </div>


              {/* ===============================================
                  FORMULARIO DÍA
              =============================================== */}

              <form
                className="service-form"
                onSubmit={handleAddDay}
              >

                <label>
                  FECHA

                  <input
                    type="date"
                    value={dayForm.date}
                    onChange={(event) =>
                      setDayForm((current) => ({
                        ...current,
                        date: event.target.value,
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
                    onChange={(event) =>
                      setDayForm((current) => ({
                        ...current,
                        reason: event.target.value,
                      }))
                    }
                  />
                </label>


                <button
                  type="submit"
                  className="primary-button modal-submit"
                  disabled={saving}
                >
                  + BLOQUEAR DÍA
                </button>

              </form>


              {/* ===============================================
                  LISTA DE DÍAS
              =============================================== */}

              {blockedDays.length === 0 ? (

                <div className="empty-state schedule-empty">
                  No hay días bloqueados.
                </div>

              ) : (

                <div className="blocked-list">

                  {blockedDays.map((day) => (

                    <div
                      className="blocked-row blocked-day-row"
                      key={day.id}
                    >

                      <div className="blocked-date">
                        {formatDateFromDb(day.date)}
                      </div>


                      <div className="blocked-reason">
                        <strong>
                          {day.reason || 'Sin motivo'}
                        </strong>
                      </div>


                      <div className="blocked-action">
                        <button
                          type="button"
                          className="danger-text"
                          onClick={() =>
                            handleRemoveDay(day)
                          }
                        >
                          QUITAR
                        </button>
                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* =================================================
                HORAS BLOQUEADAS
            ================================================= */}

            <div className="panel schedule-panel">

              <div className="panel-heading">

                <div className="panel-heading-content">
                  <p className="eyebrow">
                    EXCEPCIONES
                  </p>

                  <h2>
                    HORAS BLOQUEADAS
                  </h2>
                </div>

              </div>


              {/* ===============================================
                  FORMULARIO HORA
              =============================================== */}

              <form
                className="service-form"
                onSubmit={handleAddTime}
              >

                <label>
                  FECHA

                  <input
                    type="date"
                    value={timeForm.date}
                    onChange={(event) =>
                      setTimeForm((current) => ({
                        ...current,
                        date: event.target.value,
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
                    onChange={(event) =>
                      setTimeForm((current) => ({
                        ...current,
                        time: event.target.value,
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
                    onChange={(event) =>
                      setTimeForm((current) => ({
                        ...current,
                        reason: event.target.value,
                      }))
                    }
                  />
                </label>


                <button
                  type="submit"
                  className="primary-button modal-submit"
                  disabled={saving}
                >
                  + BLOQUEAR HORA
                </button>

              </form>


              {/* ===============================================
                  LISTA DE HORAS
              =============================================== */}

              {blockedTimes.length === 0 ? (

                <div className="empty-state schedule-empty">
                  No hay horas bloqueadas.
                </div>

              ) : (

                <div className="blocked-list">

                  {blockedTimes.map((time) => (

                    <div
                      className="blocked-row blocked-time-row"
                      key={time.id}
                    >

                      <div className="blocked-date-time">

                        <span className="blocked-date">
                          {formatDateFromDb(time.date)}
                        </span>

                        <strong className="blocked-time">
                          {time.time?.slice(0, 5)}
                        </strong>

                      </div>


                      <div className="blocked-reason">
                        <strong>
                          {time.reason || 'Sin motivo'}
                        </strong>
                      </div>


                      <div className="blocked-action">
                        <button
                          type="button"
                          className="danger-text"
                          onClick={() =>
                            handleRemoveTime(time)
                          }
                        >
                          QUITAR
                        </button>
                      </div>

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
```
