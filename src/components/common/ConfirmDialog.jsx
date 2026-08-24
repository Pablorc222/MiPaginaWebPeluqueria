// De momento usamos window.confirm (igual que el código
// original) a través de esta única función, para poder
// sustituirlo en el futuro por un modal propio sin tener que
// cambiar cada sitio donde se usa.
export function confirmAction(message) {
  return window.confirm(message)
}

// Modal de confirmación "de verdad", listo para cuando se
// quiera dejar de depender de window.confirm.
export default function ConfirmDialog({
  open,
  title = '¿Estás seguro?',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div
        className="admin-modal confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          {message && <p>{message}</p>}
        </div>

        <div className="modal-actions">
          <button type="button" className="action-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>

          <button type="button" className="action-delete" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
