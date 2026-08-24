// Overlay + caja de modal reutilizable. Cierra al hacer clic
// fuera de la caja o al pulsar la X, salvo que disableClose
// esté activo (por ejemplo, mientras se está guardando).
export default function Modal({
  overlayClassName,
  boxClassName,
  onClose,
  disableClose = false,
  showCloseButton = true,
  closeButtonClassName = 'close-button',
  children,
}) {
  return (
    <div
      className={overlayClassName}
      onClick={(event) => {
        if (event.target === event.currentTarget && !disableClose) {
          onClose?.()
        }
      }}
    >
      <div className={boxClassName}>
        {showCloseButton && (
          <button
            type="button"
            className={closeButtonClassName}
            onClick={onClose}
            aria-label="Cerrar"
            disabled={disableClose}
          >
            ×
          </button>
        )}

        {children}
      </div>
    </div>
  )
}
