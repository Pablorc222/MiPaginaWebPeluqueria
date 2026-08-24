import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getBlockedDays } from '../services/blockedDays'
import { formatDateForDatabase } from '../utils/dates'

export function useBlockedSchedule() {
  const [blockedDays, setBlockedDays] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const refetch = useCallback(async () => {
    try {
      const data =
        await getBlockedDays()

      setBlockedDays(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.error(
        'ERROR CARGANDO DÍAS BLOQUEADOS:',
        error
      )

      setBlockedDays([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const blockedDaysMap =
    useMemo(() => {
      const map = new Map()

      blockedDays.forEach((day) => {
        if (!day?.date) return

        map.set(
          day.date,
          day.reason ||
            'Bloqueado desde el dashboard'
        )
      })

      return map
    }, [blockedDays])

  const isDateBlocked =
    useCallback(
      (date) => {
        if (!date) return false

        return blockedDaysMap.has(
          formatDateForDatabase(date)
        )
      },
      [blockedDaysMap]
    )

  const getBlockReason =
    useCallback(
      (date) => {
        if (!date) return ''

        return (
          blockedDaysMap.get(
            formatDateForDatabase(date)
          ) || ''
        )
      },
      [blockedDaysMap]
    )

  return {
    blockedDays,
    blockedDaysMap,
    loading,
    refetch,
    isDateBlocked,
    getBlockReason,
  }
}