import { formatDateFromDb, formatTime } from '../../utils/dates'

// Bloque de datos de una cita (servicio, precio, fecha, hora,
// teléfono, email). Usado dentro de AppointmentModal.
export default function AppointmentDetails({ appointment }) {
  return (
    <div className="appointment-detail-grid">
      <div>
        <span>SERVICIO</span>
        <strong>{appointment.service_name || 'Sin servicio'}</strong>
      </div>

      <div>
        <span>PRECIO</span>
        <strong>
          {appointment.service_price !== ''
            ? `${appointment.service_price} €`
            : '—'}
        </strong>
      </div>

      <div>
        <span>FECHA</span>
        <strong>{formatDateFromDb(appointment.appointment_date)}</strong>
      </div>

      <div>
        <span>HORA</span>
        <strong>{formatTime(appointment.appointment_time)}</strong>
      </div>

      <div>
        <span>TELÉFONO</span>
        <strong>{appointment.client_phone || '—'}</strong>
      </div>

      <div>
        <span>EMAIL</span>
        <strong>{appointment.client_email || '—'}</strong>
      </div>
    </div>
  )
}
