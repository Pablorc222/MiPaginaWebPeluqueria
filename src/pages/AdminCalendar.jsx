import { useMemo, useState } from 'react'

import AdminLayout from '../components/layout/AdminLayout'
import Calendar from '../components/calendar/Calendar'
import AppointmentModal from '../components/appointments/AppointmentModal'

import {
  getStatusLabel,
  getStatusClass,
} from '../components/calendar/AppointmentCard'

import {
  useAppointments,
} from '../hooks/useAppointments'

import {
  useBlockedSchedule,
} from '../hooks/useBlockedSchedule'

import {
  getToday,
  formatDateFromDb,
  formatDateForDatabase,
  formatTime,
} from '../utils/dates'

export default function AdminCalendar() {
  const {
    appointments,
    loading,
    saving,
    refetch,
    updateStatus,
    removeAppointment,
  } = useAppointments()

  const {
    blockedDaysMap,
  } = useBlockedSchedule()

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      getToday().getFullYear(),
      getToday().getMonth(),
      1
    )
  )

  const [selectedDate, setSelectedDate] = useState(null)

  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedAppointment, setSelectedAppointment] =
    useState(null)

  const changeMonth = (direction) => {
    setCurrentMonth((current) => {
      return new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1
      )
    })
  }

  const filteredAppointments = useMemo(() => {
    let result = [...appointments]

    if (selectedDate) {
      const dateDb = formatDateForDatabase(selectedDate)

      result = result.filter(
        (appointment) =>
          appointment.appointment_date === dateDb
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(
        (appointment) =>
          appointment.status === statusFilter
      )
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase()

      result = result.filter((appointment) => {
        return [
          appointment.client_name,
          appointment.client_phone,
          appointment.client_email,
          appointment.service_name,
        ]
          .filter(Boolean)
          .some((field) =>
            String(field)
              .toLowerCase()
              .includes(query)
          )
      })
    }

    return result
  }, [
    appointments,
    selectedDate,
    statusFilter,
    search,
  ])

  const clearFilters = () => {
    setSelectedDate(null)
    setSearch('')
    setStatusFilter('all')
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
              ADMINISTRACIÓN
            </p>

            <h1>
              GESTIONAR
              <br />
              <em>CITAS.</em>
            </h1>
          </div>

          <button
            className="refresh-button"
            onClick={refetch}
            type="button"
          >
            ↻ ACTUALIZAR
          </button>

        </div>

        {/* =====================================================
            GRID PRINCIPAL
        ===================================================== */}

        <div className="dashboard-grid">

          {/* ===================================================
              CALENDARIO
          =================================================== */}

          <div className="panel calendar-panel">

            <div className="panel-heading">

              <div className="panel-heading-content">
                <p className="eyebrow">
                  VISTA
                </p>

                <h2>
                  CALENDARIO
                </h2>
              </div>

              {selectedDate && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setSelectedDate(null)}
                >
                  VER TODAS →
                </button>
              )}

            </div>

            <Calendar
              currentMonth={currentMonth}
              onChangeMonth={changeMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              helpText="Elige un día para filtrar las citas"
              blockedDaysMap={blockedDaysMap}
              disableBlockedDays={false}
            />

          </div>

          {/* ===================================================
              CITAS
          =================================================== */}

          <div className="panel appointments-panel-container">

            <div className="filters">

              <div className="filter-field search-field">
                <label htmlFor="appointment-search">
                  BUSCAR
                </label>

                <input
                  id="appointment-search"
                  type="text"
                  placeholder="Nombre, teléfono, email..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <div className="filter-field">
                <label htmlFor="appointment-status">
                  ESTADO
                </label>

                <select
                  id="appointment-status"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="all">
                    Todas
                  </option>

                  <option value="confirmed">
                    Confirmadas
                  </option>

                  <option value="completed">
                    Completadas
                  </option>

                  <option value="cancelled">
                    Canceladas
                  </option>
                </select>
              </div>

              <button
                type="button"
                className="clear-filter"
                onClick={clearFilters}
              >
                LIMPIAR
              </button>

            </div>

            <div className="appointments-list-container">

              {loading ? (

                <div className="empty-state">
                  Cargando citas...
                </div>

              ) : filteredAppointments.length === 0 ? (

                <div className="empty-state">
                  No hay citas que coincidan con los filtros.
                </div>

              ) : (

                <>
                  {/* ==========================================
                      ORDENADOR
                  ========================================== */}

                  <div className="appointments-table-wrapper desktop-appointments">

                    <table className="appointments-table">

                      <thead>
                        <tr>
                          <th>FECHA</th>
                          <th>HORA</th>
                          <th>CLIENTE</th>
                          <th>SERVICIO</th>
                          <th>PRECIO</th>
                          <th>ESTADO</th>
                          <th>ACCIÓN</th>
                        </tr>
                      </thead>

                      <tbody>

                        {filteredAppointments.map(
                          (appointment) => (

                            <tr key={appointment.id}>

                              <td>
                                <strong>
                                  {formatDateFromDb(
                                    appointment.appointment_date
                                  )}
                                </strong>
                              </td>

                              <td>
                                <strong className="appointment-time">
                                  {formatTime(
                                    appointment.appointment_time
                                  )}
                                </strong>
                              </td>

                              <td>
                                <div className="client-cell">

                                  <strong>
                                    {appointment.client_name ||
                                      'Cliente'}
                                  </strong>

                                  {appointment.client_phone && (
                                    <small>
                                      {appointment.client_phone}
                                    </small>
                                  )}

                                </div>
                              </td>

                              <td>
                                {appointment.service_name ||
                                  'Servicio'}
                              </td>

                              <td>
                                {appointment.service_price !== ''
                                  ? `${appointment.service_price} €`
                                  : '—'}
                              </td>

                              <td>
                                <span
                                  className={`status ${getStatusClass(
                                    appointment.status
                                  )}`}
                                >
                                  {getStatusLabel(
                                    appointment.status
                                  )}
                                </span>
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="view-button"
                                  onClick={() =>
                                    setSelectedAppointment(
                                      appointment
                                    )
                                  }
                                >
                                  VER
                                </button>
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* ==========================================
                      MÓVIL
                  ========================================== */}

                  <div className="mobile-appointments">

                    {filteredAppointments.map(
                      (appointment) => (

                        <article
                          className="appointment-mobile-card"
                          key={appointment.id}
                        >

                          <div className="appointment-mobile-top">

                            <div className="appointment-mobile-date-time">

                              <span className="appointment-mobile-date">
                                {formatDateFromDb(
                                  appointment.appointment_date
                                )}
                              </span>

                              <strong className="appointment-mobile-time">
                                {formatTime(
                                  appointment.appointment_time
                                )}
                              </strong>

                            </div>

                            <span
                              className={`status ${getStatusClass(
                                appointment.status
                              )}`}
                            >
                              {getStatusLabel(
                                appointment.status
                              )}
                            </span>

                          </div>

                          <div className="appointment-mobile-body">

                            <strong className="appointment-mobile-client">
                              {appointment.client_name ||
                                'Cliente'}
                            </strong>

                            {appointment.client_phone && (
                              <a
                                href={`tel:${appointment.client_phone}`}
                                className="appointment-mobile-phone"
                              >
                                📞 {appointment.client_phone}
                              </a>
                            )}

                            <span>
                              ✂️{' '}
                              {appointment.service_name ||
                                'Servicio'}
                            </span>

                            <span>
                              💶{' '}
                              {appointment.service_price !== ''
                                ? `${appointment.service_price} €`
                                : '—'}
                            </span>

                          </div>

                          <button
                            type="button"
                            className="view-button appointment-mobile-button"
                            onClick={() =>
                              setSelectedAppointment(
                                appointment
                              )
                            }
                          >
                            VER DETALLES
                          </button>

                        </article>

                      )
                    )}

                  </div>
                </>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* =======================================================
          MODAL DE CITA
      ======================================================= */}

      <AppointmentModal
        appointment={selectedAppointment}
        saving={saving}

        onClose={() =>
          setSelectedAppointment(null)
        }

        onUpdateStatus={async (
          appointment,
          status
        ) => {

          const ok = await updateStatus(
            appointment,
            status
          )

          if (ok) {
            setSelectedAppointment((current) =>
              current
                ? {
                    ...current,
                    status,
                  }
                : current
            )
          }
        }}

        onDelete={async (appointment) => {

          const ok = await removeAppointment(
            appointment
          )

          if (ok) {
            setSelectedAppointment(null)
          }
        }}
      />

    </AdminLayout>
  )
}
