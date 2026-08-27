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

// Página /admin/horarios
// Gestión de días y horas bloqueadas.

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

  // =========================================================
  // CARGAR DÍAS Y HORAS BLOQUEADAS
  // =========================================================

  const load = async () => {
    setLoading(true)

    try {
      const [days, times] = await Promise.all([
        getBlockedDays(),
        getBlockedTimes(),
      ])

      setBlockedDays(Array.isArray(days) ? days : [])
      setBlockedTimes(Array.isArray(times) ? times : [])

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

  // =========================================================
  // BLOQUEAR DÍA
  // =========================================================

  const handleAddDay = async (event) => {
    event.preventDefault()

    if (!dayForm.date) {
      alert('Selecciona una fecha.')
      return
    }

    setSaving(true)

    try {
      await addBlockedDay({
        date: dayForm.date,
        reason: dayForm.reason.trim(),
      })

      setDayForm({
        date: '',
        reason: '',
      })

      await load()
    } catch (error) {
      console.error('ERROR BLOQUEANDO DÍA:', error)

      alert(
        `No se ha podido bloquear el día.\n\n${
          error?.message || 'Error desconocido'
        }`
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // BLOQUEAR HORA
  // =========================================================

  const handleAddTime = async (event) => {
    event.preventDefault()

    if (!timeForm.date || !timeForm.time) {
      alert('Selecciona fecha y hora.')
      return
    }

    setSaving(true)

    try {
      await addBlockedTime({
        date: timeForm.date,
        time: `${timeForm.time}:00`,
        reason: timeForm.reason.trim(),
      })

      setTimeForm({
        date: '',
        time: '',
        reason: '',
      })

      await load()
    } catch (error) {
      console.error('ERROR BLOQUEANDO HORA:', error)

      alert(
        `No se ha podido bloquear la hora.\n\n${
          error?.message || 'Error desconocido'
        }`
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // DESBLOQUEAR DÍA
  // =========================================================

  const handleRemoveDay = async (blockedDay) => {
    const confirmed = confirmAction(
      '¿Desbloquear este día?'
    )

    if (!confirmed) {
      return
    }

    try {
      await removeBlockedDay(blockedDay.id)

      await load()
    } catch (error) {
      console.error(
        'ERROR DESBLOQUEANDO DÍA:',
        error
      )

      alert(
        `No se ha podido desbloquear.\n\n${
          error?.message || 'Error desconocido'
        }`
      )
    }
  }

  // =========================================================
  // DESBLOQUEAR HORA
  // =========================================================

  const handleRemoveTime = async (blockedTime) => {
    const confirmed = confirmAction(
      '¿Desbloquear esta hora?'
    )

    if (!confirmed) {
      return
    }

    try {
      await removeBlockedTime(blockedTime.id)

      await load()
    } catch (error) {
      console.error(
        'ERROR DESBLOQUEANDO HORA:',
        error
      )

      alert(
        `No se ha podido desbloquear.\n\n${
          error?.message || 'Error desconocido'
        }`
      )
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AdminLayout>
      <section className="admin-content">

        {/* =================================================
            CABECERA
        ================================================= */}

        <div className="page-heading">
          <div>
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

        {/* =================================================
            AVISO TABLAS
        ================================================= */}

        {!tablesReady && (
          <div className="empty-state">
            Todavía no existen las tablas{' '}
            <strong>blocked_days</strong> y{' '}
            <strong>blocked_times</strong> en Supabase.

            <br />

            Créarlas para activar esta sección.
          </div>
        )}

        {/* =================================================
            CARGANDO
        ================================================= */}

        {loading ? (
          <div className="empty-state">
            Cargando...
          </div>
        ) : (
          <div className="dashboard-grid">

            {/* =================================================
                DÍAS BLOQUEADOS
            ================================================= */}

            <div className="panel">

              <div className="panel-heading">
                <div>
                  <p className="eyebrow">
                    CIERRES
                  </p>

                  <h2>
                    DÍAS BLOQUEADOS
                  </h2>
                </div>
              </div>

              {/* FORMULARIO */}

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
                  disabled={
                    saving || !tablesReady
                  }
                >
                  + BLOQUEAR DÍA
                </button>

              </form>

              {/* LISTA */}

              {blockedDays.length === 0 ? (

                <div className="empty-state">
                  No hay días bloqueados.
                </div>

              ) : (

                <div className="today-list">

                  {blockedDays.map((day) => (

                    <div
                      className="today-item blocked-day-item"
                      key={day.id}
                    >

                      <span className="today-time">
                        {formatDateFromDb(day.date)}
                      </span>

                      <span className="today-client">
                        <strong>
                          {day.reason ||
                            'Sin motivo'}
                        </strong>
                      </span>

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

                  ))}

                </div>

              )}

            </div>

            {/* =================================================
                HORAS BLOQUEADAS
            ================================================= */}

            <div className="panel">

              <div className="panel-heading">
                <div>
                  <p className="eyebrow">
                    EXCEPCIONES
                  </p>

                  <h2>
                    HORAS BLOQUEADAS
                  </h2>
                </div>
              </div>

              {/* FORMULARIO */}

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
                  disabled={
                    saving || !tablesReady
                  }
                >
                  + BLOQUEAR HORA
                </button>

              </form>

              {/* LISTA */}

              {blockedTimes.length === 0 ? (

                <div className="empty-state">
                  No hay horas bloqueadas.
                </div>

              ) : (

                <div className="today-list">

                  {blockedTimes.map((blockedTime) => (

                    <div
                      className="today-item blocked-time-item"
                      key={blockedTime.id}
                    >

                      <span className="today-time">
                        {formatDateFromDb(
                          blockedTime.date
                        )}{' '}
                        {blockedTime.time
                          ?.slice(0, 5)}
                      </span>

                      <span className="today-client">
                        <strong>
                          {blockedTime.reason ||
                            'Sin motivo'}
                        </strong>
                      </span>

                      <button
                        type="button"
                        className="danger-text"
                        onClick={() =>
                          handleRemoveTime(
                            blockedTime
                          )
                        }
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
