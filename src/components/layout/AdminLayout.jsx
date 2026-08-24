import '../../admin.css'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

// Envoltorio común para todas las páginas /admin/*: sidebar,
// barra móvil inferior y la cabecera superior ("ADMINISTRACIÓN").
export default function AdminLayout({ topbarLabel = 'URBAN BARBER', children }) {
  return (
    <div className="admin-app">
      <Sidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>ADMINISTRACIÓN</span>
            <strong>{topbarLabel}</strong>
          </div>

          <div className="admin-status">
            <span className="online-dot" />
            SISTEMA ONLINE
          </div>
        </header>

        {children}
      </div>

      <MobileNav />
    </div>
  )
}
