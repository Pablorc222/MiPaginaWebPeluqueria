import Modal from '../common/Modal'
import AppointmentDetails from './AppointmentDetails'
import { getStatusLabel, getStatusClass } from '../calendar/AppointmentCard'
import { confirmAction } from '../common/ConfirmDialog'

// Modal de detalle de una cita en el panel admin, con acciones
// de confirmar / completar / cancelar / eliminar.
export default function AppointmentModal({
  appointment,
  saving,
  onClose,
  onUpdateStatus,
  onDelete,
}) {
  if (!appointment) return null

  const handleUpdateStatus = (newStatus) => {
    const ok = confirmAction(
      `¿Quieres cambiar esta cita a "${getStatusLabel(newStatus)}"?`
    )
    if (ok) onUpdateStatus(appointment, newStatus)
  }

  const handleDelete = () => {
    const ok = confirmAction(
      `¿Seguro que quieres eliminar la cita de ${
        appointment.client_name || 'este cliente'
      }?`
    )
    if (ok) onDelete(appointment)
  }

  return (
    <Modal
      overlayClassName="admin-modal-overlay"
      boxClassName="admin-modal"
      onClose={onClose}
      disableClose={saving}
      closeButtonClassName="modal-close"
    >
      <div className="modal-header">
        <p className="eyebrow">DETALLE DE CITA</p>
        <h2>{appointment.client_name || 'CLIENTE'}</h2>
        <span className={`status ${getStatusClass(appointment.status)}`}>
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      <AppointmentDetails appointment={appointment} />

      <div className="modal-actions">
        {appointment.status === 'pending' && (
          <button
            type="button"
            className="action-confirm"
            disabled={saving}
            onClick={() => handleUpdateStatus('confirmed')}
          >
            ✓ CONFIRMAR
          </button>
        )}

        {appointment.status === 'confirmed' && (
          <button
            type="button"
            className="action-complete"
            disabled={saving}
            onClick={() => handleUpdateStatus('completed')}
          >
            ✓ COMPLETAR
          </button>
        )}

        {appointment.status !== 'cancelled' && (
          <button
            type="button"
            className="action-cancel"
            disabled={saving}
            onClick={() => handleUpdateStatus('cancelled')}
          >
            CANCELAR
          </button>
        )}

        <button
          type="button"
          className="action-delete"
          disabled={saving}
          onClick={handleDelete}
        >
          ELIMINAR CITA
        </button>
      </div>
    </Modal>
  )
}
