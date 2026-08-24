import { useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import ServiceList from '../components/services/ServiceList'
import ServiceForm from '../components/services/ServiceForm'
import { useServices } from '../hooks/useServices'
import {
  createService,
  updateService,
  deleteService as deleteServiceApi,
} from '../services/services'
import { useAppointments } from '../hooks/useAppointments'
import { confirmAction } from '../components/common/ConfirmDialog'

export default function AdminServices() {
  const { services, loading, refetch } = useServices()
  const { appointments } = useAppointments()
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditingService(null)
    setShowForm(true)
  }

  const openEdit = (service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return
    setShowForm(false)
    setEditingService(null)
  }

  const handleSave = async (form) => {
    setSaving(true)

    try {
      if (editingService) {
        await updateService(editingService.id, form)
      } else {
        await createService(form)
      }

      await refetch()
      setShowForm(false)
      setEditingService(null)
    } catch (error) {
      console.error('ERROR GUARDANDO SERVICIO:', error)
      alert(`No se ha podido guardar el servicio.\n\n${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (service) => {
    const hasAppointments = appointments.some(
      (appointment) => String(appointment.service_id) === String(service.id)
    )

    if (hasAppointments) {
      alert(
        'Este servicio tiene citas asociadas. No puedes eliminarlo mientras existan esas citas.'
      )
      return
    }

    const ok = confirmAction(`¿Seguro que quieres eliminar "${service.name}"?`)
    if (!ok) return

    try {
      await deleteServiceApi(service.id)
      await refetch()
    } catch (error) {
      console.error('ERROR ELIMINANDO SERVICIO:', error)
      alert(`No se ha podido eliminar el servicio.\n\n${error.message}`)
    }
  }

  return (
    <AdminLayout>
      <section className="admin-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">CONFIGURACIÓN</p>
            <h1>
              TUS
              <br />
              <em>SERVICIOS.</em>
            </h1>
          </div>

          <div className="heading-actions">
            <button className="refresh-button" onClick={refetch} type="button">
              ↻ ACTUALIZAR
            </button>

            <button className="primary-button" onClick={openNew} type="button">
              + NUEVO SERVICIO
            </button>
          </div>
        </div>

        {loading ? (
          <div className="services-admin-grid">
            <div className="empty-state">Cargando servicios...</div>
          </div>
        ) : (
          <ServiceList
            services={services}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      {showForm && (
        <ServiceForm
          service={editingService}
          saving={saving}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  )
}
