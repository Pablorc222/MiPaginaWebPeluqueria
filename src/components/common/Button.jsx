// Botón genérico. No impone estilos propios: reutiliza las
// clases ya definidas en App.css / admin.css (primary-button,
// secondary-button, text-button, danger-text...) para no
// romper el diseño ya construido.
export default function Button({
  as: As = 'button',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  children,
  ...rest
}) {
  return (
    <As
      type={As === 'button' ? type : undefined}
      className={className}
      disabled={As === 'button' ? disabled : undefined}
      onClick={onClick}
      {...rest}
    >
      {children}
    </As>
  )
}
