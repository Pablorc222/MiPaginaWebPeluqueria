import { useEffect, useState } from 'react'

import { getOccupiedTimes } from '../services/appointments'
import { getBlockedTimes } from '../services/blockedTimes'
import { getSettings } from '../services/settings'

import { formatDateForDatabase } from '../utils/dates'

import {
  getAvailableTimes,
  getSlotsWithStatus,
} from '../utils/availability'

export function useAvailability() {
  const [occupiedTimes, setOccupiedTimes] = useState([])
  const [blockedTimesMap, setBlockedTimesMap] = useState(new Map())

  const [loading, setLoading] = useState(false)

  const [settings, setSettings] = useState(null)

  /*
   * Cargar configuración del negocio.
   */
  useEffect(() => {
    let mounted = true

    async function loadSettings() {
      try {
        const data = await getSettings()

        if (mounted) {
          setSettings(data)
        }
      } catch (error) {
        console.error(
          'ERROR CARGANDO CONFIGURACIÓN:',
          error
        )
      }
    }

    loadSettings()

    return () => {
      mounted = false
    }
  }, [])

  /*
   * Cargar citas y bloqueos de un día.
   */
  const loadForDate = async (date) => {
    if (!date) {
      setOccupiedTimes([])
      setBlockedTimesMap(new Map())
      return []
    }

    setLoading(true)

    setOccupiedTimes([])
    setBlockedTimesMap(new Map())

    try {
      const dateDb = formatDateForDatabase(date)

      const [occupied, blocked] = await Promise.all([
        getOccupiedTimes(dateDb),
        getBlockedTimes(dateDb),
      ])

      const blockedMap = new Map()

      blocked.forEach((item) => {
        blockedMap.set(
          String(item.time).slice(0, 5),
          item.reason || 'Bloqueado'
        )
      })

      setOccupiedTimes(occupied)
      setBlockedTimesMap(blockedMap)

      return [
        ...occupied,
        ...blockedMap.keys(),
      ]
    } catch (error) {
      console.error(
        'ERROR CARGANDO HORARIOS:',
        error
      )

      alert(
        `No se han podido cargar los horarios disponibles.\n\n${error.message}`
      )

      setOccupiedTimes([])
      setBlockedTimesMap(new Map())

      return []
    } finally {
      setLoading(false)
    }
  }

  const openingTime =
    settings?.opening_time || '10:00'

  const closingTime =
    settings?.closing_time || '20:00'

  /*
   * Horas libres.
   */
  const availableTimes = (selectedDate) => {
    return getAvailableTimes(
      selectedDate,
      [
        ...occupiedTimes,
        ...blockedTimesMap.keys(),
      ],
      openingTime,
      closingTime
    )
  }

  /*
   * Todas las horas con su estado.
   */
  const slotsForDate = (selectedDate) => {
    return getSlotsWithStatus(
      selectedDate,
      occupiedTimes,
      blockedTimesMap,
      openingTime,
      closingTime
    )
  }

  return {
    occupiedTimes,
    blockedTimesMap,
    loading,

    loadForDate,
    availableTimes,
    slotsForDate,

    settings,
  }
}