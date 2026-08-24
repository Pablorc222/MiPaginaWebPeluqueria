import { useCallback, useEffect, useState } from 'react'
import { getServices } from '../services/services'

// Carga la lista de servicios de la barbería y expone un
// refetch() para volver a pedirla (usado tras crear/editar/borrar).
export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error('ERROR CARGANDO SERVICIOS:', error)
      setServices([])
      alert(`No se han podido cargar los servicios.\n\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { services, loading, refetch }
}
