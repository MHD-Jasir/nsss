import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Coordinator } from '../types'

export const useCoordinators = () => {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCoordinators = async () => {
    const { data, error } = await supabase
      .from('coordinators')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && !error) {
      setCoordinators(data.map(c => ({
        id: c.id,
        name: c.name,
        department: c.department,
        password: c.password,
        isActive: c.is_active,
        createdAt: c.created_at
      })))
    }
    setLoading(false)
  }

  const addCoordinator = async (coordinatorData: Omit<Coordinator, 'id' | 'createdAt'>) => {
    const id = 'COORD' + (Math.floor(Math.random() * 9000) + 1000).toString()
    
    const { error } = await supabase
      .from('coordinators')
      .insert({
        id,
        name: coordinatorData.name,
        department: coordinatorData.department,
        password: coordinatorData.password,
        is_active: coordinatorData.isActive
      })

    if (!error) {
      fetchCoordinators()
    }
  }

  const updateCoordinator = async (id: string, updates: Partial<Coordinator>) => {
    const { error } = await supabase
      .from('coordinators')
      .update({
        name: updates.name,
        department: updates.department,
        password: updates.password,
        is_active: updates.isActive
      })
      .eq('id', id)

    if (!error) {
      fetchCoordinators()
    }
  }

  const deleteCoordinator = async (id: string) => {
    const { error } = await supabase
      .from('coordinators')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchCoordinators()
    }
  }

  const toggleAccess = async (id: string) => {
    const coordinator = coordinators.find(c => c.id === id)
    if (coordinator) {
      await updateCoordinator(id, { isActive: !coordinator.isActive })
    }
  }

  useEffect(() => {
    fetchCoordinators()
  }, [])

  return {
    coordinators,
    loading,
    addCoordinator,
    updateCoordinator,
    deleteCoordinator,
    toggleAccess,
    refetch: fetchCoordinators
  }
}