import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Department } from '../types'

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name')

    if (data && !error) {
      setDepartments(data.map(d => ({
        id: d.id,
        name: d.name,
        isActive: d.is_active,
        createdAt: d.created_at
      })))
    }
    setLoading(false)
  }

  const addDepartment = async (name: string) => {
    const { error } = await supabase
      .from('departments')
      .insert({ name, is_active: true })

    if (!error) {
      fetchDepartments()
    }
  }

  const updateDepartment = async (id: string, name: string) => {
    const { error } = await supabase
      .from('departments')
      .update({ name })
      .eq('id', id)

    if (!error) {
      fetchDepartments()
    }
  }

  const toggleDepartment = async (id: string) => {
    const dept = departments.find(d => d.id === id)
    if (dept) {
      const { error } = await supabase
        .from('departments')
        .update({ is_active: !dept.isActive })
        .eq('id', id)

      if (!error) {
        fetchDepartments()
      }
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return {
    departments,
    loading,
    addDepartment,
    updateDepartment,
    toggleDepartment,
    refetch: fetchDepartments
  }
}