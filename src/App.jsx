import { RouterProvider, useRouter } from './lib/router'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Admin from './pages/Admin'
import AdminCalendar from './pages/AdminCalendar'
import AdminClients from './pages/AdminClients'
import AdminServices from './pages/AdminServices'
import AdminSchedule from './pages/AdminSchedule'
import AdminSettings from './pages/AdminSettings'

// Antes había dos apps Vite independientes (App.jsx para la web
// pública y admin/AdminApp.jsx para el panel). Ahora es una sola
// app con rutas, tal y como marcaba la hoja de ruta.
const ROUTES = {
  '/': Home,
  '/reservar': Booking,
  '/admin': Admin,
  '/admin/calendario': AdminCalendar,
  '/admin/clientes': AdminClients,
  '/admin/servicios': AdminServices,
  '/admin/horarios': AdminSchedule,
  '/admin/config': AdminSettings,
}

function Routes() {
  const { path } = useRouter()

  // Separamos la ruta de los parámetros de la URL.
  // Así /reservar y /reservar?service=123
  // cargan correctamente la página Booking.
  const pathname = path.split('?')[0]

  const Page = ROUTES[pathname] || Home

  return <Page />
}

export default function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  )
}