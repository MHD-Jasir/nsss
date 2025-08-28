import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { RegisteredStudent, Coordinator } from '../types'

interface AuthUser {
  type: 'student' | 'coordinator' | 'officer'
  data: RegisteredStudent | Coordinator | { id: string; name: string }
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (credentials: { id: string; password: string }) => {
    setLoading(true)
    
    // Officer check
    if (credentials.id === 'OFFICER001' && credentials.password === 'NSS@OFFICER2025') {
      setCurrentUser({ type: 'officer', data: { id: credentials.id, name: 'Program Officer' } })
      setIsLoggedIn(true)
      setLoading(false)
      return { success: true, userType: 'officer' }
    }

    // Coordinator check
    const { data: coordinator } = await supabase
      .from('coordinators')
      .select('*')
      .eq('id', credentials.id)
      .eq('password', credentials.password)
      .eq('is_active', true)
      .single()

    if (coordinator) {
      setCurrentUser({ type: 'coordinator', data: coordinator })
      setIsLoggedIn(true)
      setLoading(false)
      return { success: true, userType: 'coordinator' }
    }

    // Student check
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('id', credentials.id)
      .eq('password', credentials.password)
      .single()

    if (student) {
      setCurrentUser({ type: 'student', data: student })
      setIsLoggedIn(true)
      setLoading(false)
      return { success: true, userType: 'student' }
    }

    setLoading(false)
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  return {
    isLoggedIn,
    currentUser,
    loading,
    login,
    logout
  }
}