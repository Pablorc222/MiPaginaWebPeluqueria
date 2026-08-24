import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const RouterContext = createContext(null)

function getUrl() {
  return window.location.pathname + window.location.search
}

export function RouterProvider({ children }) {
  const [url, setUrl] = useState(getUrl)

  useEffect(() => {
    const handlePopState = () => {
      setUrl(getUrl())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (to) => {
    window.history.pushState({}, '', to)

    // MUY IMPORTANTE:
    // avisamos a React inmediatamente de que la URL ha cambiado
    setUrl(to)

    window.scrollTo(0, 0)
  }

  return (
    <RouterContext.Provider
      value={{
        path: url,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error(
      'useRouter debe usarse dentro de <RouterProvider>'
    )
  }

  return context
}

export function Link({
  to,
  className,
  children,
  onClick,
}) {
  const { navigate } = useRouter()

  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        event.preventDefault()
        onClick?.()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}