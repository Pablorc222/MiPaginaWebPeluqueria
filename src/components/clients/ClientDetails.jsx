import { useState } from 'react'
import Modal from '../common/Modal'
import ClientForm from './ClientForm'
import { formatDateFromDb, formatTime } from '../../utils/dates'
import { getStatusLabel, getStatusClass } from '../calendar/AppointmentCard'

// Modal de ficha de cliente: datos, historial de citas y
// botón para editar (nueva funcionalidad, antes no existía).
export default function ClientDetails({
  client,
  appointments,
  saving,
  onClose,
  onSave,
}) {
  const [editing, setEditing] = useState(false)

  if (!client) return null

  const clientAppointments = appointments.filter(
    (appointment) => String(appointment.client_id) === String(client.id)
  )

  const handleSave = async (form) => {
    const ok = await onSave(client.id, form)
    if (ok) setEditing(false)
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
        <p className="eyebrow">FICHA DE CLIENTE</p>
        <h2>{client.name || 'Sin nombre'}</h2>
      </div>

      {editing ? (
        <ClientForm
          client={client}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="appointment-detail-grid">
            <div>
              <span>TELÉFONO</span>
              <strong>{client.phone || '—'}</strong>
            </div>

            <div>
              <span>EMAIL</span>
              <strong>{client.email || '—'}</strong>
            </div>

            <div>
              <span>CITAS TOTALES</span>
              <strong>{clientAppointments.length}</strong>
            </div>
          </div>

          {clientAppointments.length > 0 && (
            <div className="today-list">
              {clientAppointments.map((appointment) => (
                <div className="today-item" key={appointment.id}>
                  <span className="today-time">
                    {formatDateFromDb(appointment.appointment_date)}{' '}
                    {formatTime(appointment.appointment_time)}
                  </span>

                  <span className="today-client">
                    <strong>{appointment.service_name || 'Servicio'}</strong>
                  </span>

                  <span className={`status ${getStatusClass(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="action-confirm"
              onClick={() => setEditing(true)}
            >
              EDITAR DATOS
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
