// Cuadrícula de servicios en el panel admin, con edición y borrado.
export default function ServiceList({ services, onEdit, onDelete }) {
  if (services.length === 0) {
    return <div className="empty-state">No hay servicios creados.</div>
  }

  return (
    <div className="services-admin-grid">
      {services.map((service, index) => (
        <article className="admin-service-card" key={service.id}>
          <div className="admin-service-top">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>SERVICIO</span>
          </div>

          <div className="service-symbol">✦</div>

          <h2>{service.name}</h2>
          <p>{service.description || 'Sin descripción.'}</p>
          <strong className="service-price">{service.price} €</strong>

          <div className="service-admin-actions">
            <button type="button" onClick={() => onEdit(service)}>
              EDITAR
            </button>

            <button
              type="button"
              className="danger-text"
              onClick={() => onDelete(service)}
            >
              ELIMINAR
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
