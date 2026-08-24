// Estado de carga/vacío reutilizable en listas y selects.
export default function Loading({ className = 'empty-state', children = 'Cargando...' }) {
  return <div className={className}>{children}</div>
}
