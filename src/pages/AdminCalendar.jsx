import { useMemo, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Calendar from '../components/calendar/Calendar'
import AppointmentModal from '../components/appointments/AppointmentModal'
import { getStatusLabel, getStatusClass } from '../components/calendar/AppointmentCard'
import { useAppointments } from '../hooks/useAppointments'
import { useBlockedSchedule } from '../hooks/useBlockedSchedule'
import {
  getToday,
  formatDateFromDb,
  formatDateForDatabase,
  formatTime,
} from '../utils/dates'

// Página /admin/calendario — antes era la sección "citas"
// (solo tabla) dentro de AdminApp.jsx. Ahora añade además un
// calendario visual para elegir el día, tal y como pedía la
// estructura: components/calendar reutilizado también aquí.
export default function AdminCalendar() {
  const { appointments, loading, saving, refetch, updateStatus, removeAppointment } =
    useAppointments()
  const { blockedDaysMap } = useBlockedSchedule()

  const [currentMonth, setCurrentMonth] = useState(
    new Date(getToday().getFullYear(), getToday().getMonth(), 1)
  )
  const [selectedDate, setSelectedDate] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const changeMonth = (direction) => {
    setCurrentMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + direction, 1)
    )
  }

  const filteredAppointments = useMemo(() => {
    let result = [...appointments]

    if (selectedDate) {
      const dateDb = formatDateForDatabase(selectedDate)
      result = result.filter((a) => a.appointment_date === dateDb)
    }

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase()
      result = result.filter((a) =>
        [a.client_name, a.client_phone, a.client_email, a.service_name]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query))
      )
    }

    return result
  }, [appointments, selectedDate, statusFilter, search])

  return (
    <AdminLayout>
      <section className="admin-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">ADMINISTRACIÓN</p>
            <h1>
              GESTIONAR
              <br />
              <em>CITAS.</em>
            </h1>
          </div>

          <button className="refresh-button" onClick={refetch} type="button">
            ↻ ACTUALIZAR
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">VISTA</p>
                <h2>CALENDARIO</h2>
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

          <div className="panel">
            <div className="filters">
              <div className="filter-field search-field">
                <label>BUSCAR</label>
                <input
                  type="text"
                  placeholder="Nombre, teléfono, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-field">
                <label>ESTADO</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmadas</option>
                  <option value="completed">Completadas</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </div>

              <button
                type="button"
                className="clear-filter"
                onClick={() => {
                  setSelectedDate(null)
                  setSearch('')
                  setStatusFilter('all')
                }}
              >
                LIMPIAR
              </button>
            </div>

            <div className="appointments-panel">
              {loading ? (
                <div className="empty-state">Cargando citas...</div>
              ) : filteredAppointments.length === 0 ? (
                <div className="empty-state">
                  No hay citas que coincidan con los filtros.
                </div>
              ) : (
                <div className="appointments-table-wrapper">
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
                      {filteredAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <strong>
                              {formatDateFromDb(appointment.appointment_date)}
                            </strong>
                          </td>

                          <td>
                            <strong className="appointment-time">
                              {formatTime(appointment.appointment_time)}
                            </strong>
                          </td>

                          <td>
                            <div className="client-cell">
                              <strong>
                                {appointment.client_name || 'Cliente'}
                              </strong>
                              <small>{appointment.client_phone || ''}</small>
                            </div>
                          </td>

                          <td>{appointment.service_name || 'Servicio'}</td>

                          <td>
                            {appointment.service_price !== ''
                              ? `${appointment.service_price} €`
                              : '—'}
                          </td>

                          <td>
                            <span
                              className={`status ${getStatusClass(appointment.status)}`}
                            >
                              {getStatusLabel(appointment.status)}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="view-button"
                              onClick={() => setSelectedAppointment(appointment)}
                            >
                              VER
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
