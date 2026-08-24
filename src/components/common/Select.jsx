// Select con label + opciones, reutilizable en formularios
// del panel admin y en la reserva pública.
export default function Select({
  label,
  id,
  wrapperClassName,
  options = [],
  placeholder,
  ...selectProps
}) {
  return (
    <div className={wrapperClassName}>
      {label && <label htmlFor={id}>{label}</label>}

      <select id={id} {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
