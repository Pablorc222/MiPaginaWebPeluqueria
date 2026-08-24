import { useState } from 'react'
import Modal from '../common/Modal'
import { validateServicePrice } from '../../utils/validation'

// Modal con el formulario de crear/editar un servicio.
export default function ServiceForm({ service, saving, onClose, onSave }) {
  const [form, setForm] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price != null ? String(service.price) : '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = form.name.trim()
    const description = form.description.trim()

    if (!name) {
      alert('Introduce el nombre del servicio.')
      return
    }

    const priceCheck = validateServicePrice(form.price)
    if (!priceCheck.valid) {
      alert(priceCheck.message)
      return
    }

    onSave({ name, description, price: priceCheck.value })
  }

  return (
    <Modal
      overlayClassName="admin-modal-overlay"
      boxClassName="admin-modal service-modal"
      onClose={onClose}
      disableClose={saving}
      closeButtonClassName="modal-close"
    >
      <div className="modal-header">
        <p className="eyebrow">SERVICIOS</p>
        <h2>{service ? 'EDITAR SERVICIO' : 'NUEVO SERVICIO'}</h2>
      </div>

      <form className="service-form" onSubmit={handleSubmit}>
        <label>
          NOMBRE
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
            placeholder="Ej. Corte + Barba"
            required
          />
        </label>

        <label>
          DESCRIPCIÓN
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((c) => ({ ...c, description: e.target.value }))
            }
            placeholder="Describe el servicio..."
            rows="4"
          />
        </label>

        <label>
          PRECIO
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))}
            placeholder="20"
            required
          />
        </label>

        <button
          type="submit"
          className="primary-button modal-submit"
          disabled={saving}
        >
          {saving
            ? 'GUARDANDO...'
            : service
            ? 'GUARDAR CAMBIOS →'
            : 'CREAR SERVICIO →'}
        </button>
      </form>
    </Modal>
  )
}
