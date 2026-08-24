import { useCallback, useEffect, useState } from 'react'
import { getClients } from '../services/clients'

export function useClients({ auto = true } = {}) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(auto)

  const refetch = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('ERROR CARGANDO CLIENTES:', error)
      setClients([])
      alert(`No se han podido cargar los clientes.\n\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (auto) refetch()
  }, [auto, refetch])

  return { clients, loading, refetch }
}
