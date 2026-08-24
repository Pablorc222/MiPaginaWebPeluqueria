// Campo de formulario con label. Envuelve un <input> nativo
// para no perder ningún atributo (pattern, autoComplete, etc.)
export default function Input({ label, id, wrapperClassName, ...inputProps }) {
  return (
    <div className={wrapperClassName}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...inputProps} />
    </div>
  )
}
