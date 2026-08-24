import { useState } from 'react'

// Formulario de edición de un cliente. Reutiliza las mismas
// clases que el formulario de servicios (service-form) para
// no tener que añadir CSS nuevo.
export default function ClientForm({ client, saving, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  return (
    <form className="service-form" onSubmit={handleSubmit}>
      <label>
        NOMBRE
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
          required
        />
      </label>

      <label>
        TELÉFONO
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
          required
        />
      </label>

      <label>
        EMAIL
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
          required
        />
      </label>

      <div className="modal-actions">
        <button
          type="button"
          className="action-cancel"
          onClick={onCancel}
          disabled={saving}
        >
          CANCELAR
        </button>

        <button
          type="submit"
          className="primary-button modal-submit"
          disabled={saving}
        >
          {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS →'}
        </button>
      </div>
    </form>
  )
}
