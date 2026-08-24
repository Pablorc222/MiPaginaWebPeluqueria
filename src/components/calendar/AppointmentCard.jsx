import { formatTime } from '../../utils/dates'

const STATUS_LABELS = {
  pending: 'PENDIENTE',
  confirmed: 'CONFIRMADA',
  completed: 'COMPLETADA',
  cancelled: 'CANCELADA',
}

const STATUS_CLASSES = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || 'SIN ESTADO'
}

export function getStatusClass(status) {
  return STATUS_CLASSES[status] || 'status-default'
}

// Fila compacta de una cita: hora, cliente/servicio y estado.
// Usada en el dashboard ("Citas de hoy") y en el calendario admin.
export default function AppointmentCard({ appointment, onClick }) {
  return (
    <button type="button" className="today-item" onClick={onClick}>
      <span className="today-time">
        {formatTime(appointment.appointment_time)}
      </span>

      <span className="today-client">
        <strong>{appointment.client_name || 'Cliente'}</strong>
        <small>{appointment.service_name || 'Servicio'}</small>
      </span>

      <span className={`status ${getStatusClass(appointment.status)}`}>
        {getStatusLabel(appointment.status)}
      </span>
    </button>
  )
}
