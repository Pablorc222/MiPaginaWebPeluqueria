import { useRouter } from '../../lib/router'

// Cabecera de la web pública (antes vivía dentro de App.jsx).
// Los enlaces de anclas (#servicios, etc.) solo tienen sentido
// en Home, así que si estamos en otra página (p. ej. /reservar)
// primero navegamos a "/" y luego hacemos scroll a la sección.
export default function Header() {
  const { path, navigate } = useRouter()

  const goToSection = (event, hash) => {
    event.preventDefault()

    if (path !== '/') {
      navigate('/')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.querySelector(hash)?.scrollIntoView()
        })
      })
      return
    }

    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="header">
      <a href="/" className="logo" onClick={(e) => goToSection(e, '#inicio')}>
        URBAN
        <span>BARBER</span>
      </a>

      <nav className="nav">
        <a href="#inicio" onClick={(e) => goToSection(e, '#inicio')}>
          Inicio
        </a>
        <a href="#servicios" onClick={(e) => goToSection(e, '#servicios')}>
          Servicios
        </a>
        <a href="#galeria" onClick={(e) => goToSection(e, '#galeria')}>
          Galería
        </a>
        <a href="#contacto" onClick={(e) => goToSection(e, '#contacto')}>
          Contacto
        </a>
      </nav>

      <button
        type="button"
        className="header-button"
        onClick={() => navigate('/reservar')}
      >
        RESERVAR CITA
      </button>
    </header>
  )
}
