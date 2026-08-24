import { useRouter } from '../../lib/router'

// Barra inferior con iconos para pantallas muy pequeñas.
// Sidebar.jsx sigue siendo el menú para escritorio/tablet;
// a partir de 600px de ancho se oculta y se muestra esta
// barra en su lugar (ver reglas @media en admin.css).
const MOBILE_NAV_ITEMS = [
  { icon: '📅', label: 'Hoy', path: '/admin' },
  { icon: '🗓️', label: 'Citas', path: '/admin/calendario' },
  { icon: '👤', label: 'Clientes', path: '/admin/clientes' },
  { icon: '✦', label: 'Servicios', path: '/admin/servicios' },
  { icon: '⚙️', label: 'Ajustes', path: '/admin/config' },
]

export default function MobileNav() {
  const { path, navigate } = useRouter()

  return (
    <nav className="mobile-nav">
      {MOBILE_NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          type="button"
          className={path === item.path ? 'active' : ''}
          onClick={() => navigate(item.path)}
          aria-label={item.label}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
