import { useMemo, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import ClientList from '../components/clients/ClientList'
import ClientDetails from '../components/clients/ClientDetails'
import { useClients } from '../hooks/useClients'
import { useAppointments } from '../hooks/useAppointments'
import { updateClient } from '../services/clients'

export default function AdminClients() {
  const { clients, loading, refetch } = useClients()
  const { appointments } = useAppointments()
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [saving, setSaving] = useState(false)

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return clients

    return clients.filter((client) =>
      [client.name, client.phone, client.email]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query))
    )
  }, [clients, search])

  const handleSaveClient = async (clientId, form) => {
    setSaving(true)

    try {
      await updateClient(clientId, form)
      await refetch()
      setSelectedClient((current) =>
        current ? { ...current, ...form } : current
      )
      return true
    } catch (error) {
      console.error('ERROR ACTUALIZANDO CLIENTE:', error)
      alert(`No se han podido guardar los cambios.\n\n${error.message}`)
      return false
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <section className="admin-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">BASE DE DATOS</p>
            <h1>
              TUS
              <br />
              <em>CLIENTES.</em>
            </h1>
          </div>

          <button className="refresh-button" onClick={refetch} type="button">
            ↻ ACTUALIZAR
          </button>
        </div>

        <div className="filters">
          <div className="filter-field search-field">
            <label>BUSCAR CLIENTE</label>
            <input
              type="text"
              placeholder="Nombre, teléfono o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="clear-filter"
            onClick={() => setSearch('')}
          >
            LIMPIAR
          </button>
        </div>

        <div className="clients-panel">
          {loading ? (
            <div className="empty-state">Cargando clientes...</div>
          ) : (
            <ClientList
              clients={filteredClients}
              appointments={appointments}
              onSelectClient={setSelectedClient}
            />
          )}
        </div>
      </section>

      {selectedClient && (
        <ClientDetails
          client={selectedClient}
          appointments={appointments}
          saving={saving}
          onClose={() => setSelectedClient(null)}
          onSave={handleSaveClient}
        />
      )}
    </AdminLayout>
  )
}
