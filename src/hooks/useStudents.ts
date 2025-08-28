import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { RegisteredStudent } from '../types'

export const useStudents = () => {
  const [students, setStudents] = useState<RegisteredStudent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id')

    if (data && !error) {
      setStudents(data.map(s => ({
        id: s.id,
        name: s.name,
        department: s.department,
        password: s.password,
        profileImageUrl: s.profile_image_url,
        createdAt: s.created_at
      })))
    }
    setLoading(false)
  }

  const addStudent = async (studentData: Omit<RegisteredStudent, 'createdAt'>) => {
    const { error } = await supabase
      .from('students')
      .insert({
        id: studentData.id,
        name: studentData.name,
        department: studentData.department,
        password: studentData.password,
        profile_image_url: studentData.profileImageUrl
      })

    if (!error) {
      fetchStudents()
    }
  }

  const updateStudent = async (id: string, updates: Partial<RegisteredStudent>) => {
    const { error } = await supabase
      .from('students')
      .update({
        name: updates.name,
        department: updates.department,
        password: updates.password,
        profile_image_url: updates.profileImageUrl
      })
      .eq('id', id)

    if (!error) {
      fetchStudents()
    }
  }

  const deleteStudent = async (id: string) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchStudents()
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents
  }
}