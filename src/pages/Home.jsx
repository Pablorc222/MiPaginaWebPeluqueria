import Header from '../components/layout/Header'
import { useServices } from '../hooks/useServices'
import { useRouter } from '../lib/router'
import '../App.css'

// Página pública principal. Antes era casi todo el contenido
// de App.jsx (hero, intro, servicios, about, galería, cta,
// contacto, footer). El modal de reserva ahora es la página
// Booking.jsx, en /reservar.
export default function Home() {
  const { services, loading: servicesLoading } = useServices()
  const { navigate } = useRouter()

  const openBooking = (service = null) => {
    if (service) {
      navigate(`/reservar?service=${service.id}`)
    } else {
      navigate('/reservar')
    }
  }

  return (
    <div className="site">
      <Header />

      <main>
        {/* HERO */}
        <section id="inicio" className="hero">
          <div className="hero-background" />

          <div className="hero-content">
            <p className="eyebrow">BARBERÍA · HUELVA</p>

            <h1>
              TU ESTILO.
              <br />
              TU <span>BARBERÍA.</span>
            </h1>

            <p className="hero-description">
              Cortes modernos, barba y estilo personalizado.
              <br />
              Calidad, precisión y atención al detalle.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => openBooking()}
              >
                RESER CITA →
              </button>

              <a href="#servicios" className="secondary-button">
                VER SERVICIOS
              </a>
            </div>
          </div>

          <div className="hero-bottom">
            <span>URBAN BARBER</span>
            <span>SCROLL ↓</span>
            <span>HUELVA · ESPAÑA</span>
          </div>
        </section>

        {/* INTRO */}
        <section className="intro">
          <div className="intro-number">01 / SOBRE NOSOTROS</div>

          <div className="intro-content">
            <p className="eyebrow">NUESTRA FILOSOFÍA</p>

            <h2>
              MÁS QUE
              <br />
              UN <em>CORTE.</em>
            </h2>

            <p>
              En Urban Barber creemos que un buen corte no es solo cuestión
              de estética. Es actitud, confianza y personalidad.
            </p>

            <p>
              Trabajamos cada servicio de forma personalizada para que
              salgas de la barbería exactamente como quieres.
            </p>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="services-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SERVICIOS</p>

              <h2>
                LO QUE
                <br />
                <em>HACEMOS.</em>
              </h2>
            </div>

            <p className="section-description">
              Servicios profesionales pensados para cuidar cada detalle de
              tu imagen.
            </p>
          </div>

          <div className="services-grid">
            {servicesLoading ? (
              <div className="services-loading">Cargando servicios...</div>
            ) : services.length === 0 ? (
              <div className="services-loading">
                No hay servicios disponibles.
              </div>
            ) : (
              services.map((service, index) => (
                <article className="service-card" key={service.id}>
                  <span className="service-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="service-icon">✦</div>

                  <h3>{service.name}</h3>
                  <p>{service.description}</p>

                  <div className="service-footer">
                    <strong>{service.price} €</strong>

                    <button
                      type="button"
                      className="service-book-button"
                      onClick={() => openBooking(service)}
                    >
                      RESERVAR
                      <span>→</span>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="services-action">
            <button
              type="button"
              className="primary-button"
              onClick={() => openBooking()}
            >
              RESERVAR CITA →
            </button>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about">
          <div className="about-image">
            <img src="/images/barberia-1.jpg" alt="Urban Barber" />

            <div className="image-label">
              <span>URBAN BARBER</span>
              <span>HUELVA</span>
            </div>
          </div>

          <div className="about-content">
            <p className="eyebrow">NUESTRA FILOSOFÍA</p>

            <h2>
              DETALLE.
              <br />
              <em>PRECISIÓN.</em>
              <br />
              ESTILO.
            </h2>

            <p>
              Cada cliente tiene un estilo diferente. Por eso nos tomamos
              el tiempo necesario para entender lo que buscas y conseguir
              el mejor resultado.
            </p>

            <div className="about-stats">
              <div>
                <strong>100%</strong>
                <span>PERSONALIZADO</span>
              </div>

              <div>
                <strong>∞</strong>
                <span>ESTILO</span>
              </div>

              <div>
                <strong>01</strong>
                <span>OBJETIVO</span>
              </div>
            </div>
          </div>
        </section>

        {/* GALERÍA */}
        <section id="galeria" className="gallery-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NUESTRO TRABAJO</p>
              <h2>GALERÍA.</h2>
            </div>
          </div>

          <div className="gallery-grid">
            <div className="gallery-item large">
              <img src="/images/barberia-1.jpg" alt="Trabajo de Urban Barber" />
              <div className="gallery-overlay">CORTE</div>
            </div>

            <div className="gallery-item">
              <img src="/images/barberia-2.jpg" alt="Trabajo de Urban Barber" />
              <div className="gallery-overlay">ESTILO</div>
            </div>

            <div className="gallery-item">
              <img src="/images/images.jpeg" alt="Trabajo de Urban Barber" />
              <div className="gallery-overlay">BARBA</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <p className="eyebrow">¿LISTO?</p>

          <h2>
            TU PRÓXIMO
            <br />
            <em>CORTE EMPIEZA AQUÍ.</em>
          </h2>

          <button
            type="button"
            className="primary-button"
            onClick={() => openBooking()}
          >
            RESERVAR CITA →
          </button>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="contact">
          <div className="contact-heading">
            <p className="eyebrow">ENCUÉNTRANOS</p>

            <h2>
              NOS VEMOS
              <br />
              <em>EN LA SILLA.</em>
            </h2>
          </div>

          <div className="contact-grid">
            <div className="contact-block">
              <span>DIRECCIÓN</span>
              <p>Huelva, España</p>
            </div>

            <div className="contact-block">
              <span>HORARIO</span>
              <p>
                Lunes — Sábado
                <br />
                10:00 — 20:00
              </p>
            </div>

            <div className="contact-block contact-booking">
              <span>CITA</span>

              <button
                type="button"
                className="contact-booking-button"
                onClick={() => openBooking()}
              >
                RESERVAR AHORA →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="logo footer-logo">
            URBAN
            <span>BARBER</span>
          </div>

          <p>Tu estilo. Tu barbería.</p>
        </div>

        <div className="footer-bottom">
          <span>© 2026 URBAN BARBER</span>
          <span>HUELVA · ESPAÑA</span>
        </div>
      </footer>
    </div>
  )
}
