import { useRouter } from '../../lib/router'

export const ADMIN_NAV_ITEMS = [
  { number: '01', label: 'DASHBOARD', path: '/admin' },
  { number: '02', label: 'CALENDARIO', path: '/admin/calendario' },
  { number: '03', label: 'CLIENTES', path: '/admin/clientes' },
  { number: '04', label: 'SERVICIOS', path: '/admin/servicios' },
  { number: '05', label: 'HORARIOS', path: '/admin/horarios' },
  { number: '06', label: 'CONFIGURACIÓN', path: '/admin/config' },
]

// Menú lateral del panel admin (antes era <nav className="admin-nav">
// dentro de AdminApp.jsx, con "secciones" en vez de rutas reales)
export default function Sidebar() {
  const { path, navigate } = useRouter()

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        URBAN
        <span>BARBER</span>
      </div>

      <div className="admin-label">ADMIN PANEL</div>

      <nav className="admin-nav">
        {ADMIN_NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            type="button"
            className={path === item.path ? 'active' : ''}
            onClick={() => navigate(item.path)}
          >
            <span>{item.number}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span>URBAN BARBER</span>
        <span>HUELVA · ESPAÑA</span>
      </div>
    </aside>
  )
}
