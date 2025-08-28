import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Program } from '../types'

export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && !error) {
      setPrograms(data.map(p => ({
        ...p,
        coordinatorIds: p.coordinator_ids || [],
        participantIds: p.participant_ids || []
      })))
    }
    setLoading(false)
  }

  const addProgram = async (programData: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('programs')
      .insert({
        title: programData.title,
        description: programData.description,
        date: programData.date,
        time: programData.time,
        venue: programData.venue,
        coordinator_ids: programData.coordinatorIds || [],
        participant_ids: []
      })
      .select()
      .single()

    if (data && !error) {
      fetchPrograms()
    }
  }

  const updateProgram = async (id: string, programData: Partial<Program>) => {
    const { error } = await supabase
      .from('programs')
      .update({
        title: programData.title,
        description: programData.description,
        date: programData.date,
        time: programData.time,
        venue: programData.venue,
        coordinator_ids: programData.coordinatorIds,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (!error) {
      fetchPrograms()
    }
  }

  const deleteProgram = async (id: string) => {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchPrograms()
    }
  }

  const updateParticipants = async (programId: string, studentIds: string[]) => {
    const { error } = await supabase
      .from('programs')
      .update({ participant_ids: studentIds })
      .eq('id', programId)

    if (!error) {
      fetchPrograms()
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  return {
    programs,
    loading,
    addProgram,
    updateProgram,
    deleteProgram,
    updateParticipants,
    refetch: fetchPrograms
  }
}