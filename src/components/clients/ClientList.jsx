// Cuadrícula de tarjetas de clientes (panel admin)
export default function ClientList({ clients, appointments, onSelectClient }) {
  if (clients.length === 0) {
    return <div className="empty-state">No hay clientes.</div>
  }

  return (
    <div className="clients-grid">
      {clients.map((client) => {
        const clientAppointments = appointments.filter(
          (appointment) => String(appointment.client_id) === String(client.id)
        )

        return (
          <article
            className="client-card"
            key={client.id}
            onClick={() => onSelectClient?.(client)}
            role={onSelectClient ? 'button' : undefined}
            tabIndex={onSelectClient ? 0 : undefined}
          >
            <div className="client-avatar">
              {String(client.name || '?').charAt(0).toUpperCase()}
            </div>

            <div className="client-info">
              <h3>{client.name || 'Sin nombre'}</h3>
              <p>{client.phone || 'Sin teléfono'}</p>
              <p>{client.email || 'Sin email'}</p>
            </div>

            <div className="client-stats">
              <span>CITAS</span>
              <strong>{clientAppointments.length}</strong>
            </div>
          </article>
        )
      })}
    </div>
  )
}
