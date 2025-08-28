import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          department: string
          password: string
          profile_image_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          department: string
          password: string
          profile_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          department?: string
          password?: string
          profile_image_url?: string | null
        }
      }
      coordinators: {
        Row: {
          id: string
          name: string
          department: string
          password: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          department: string
          password: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          department?: string
          password?: string
          is_active?: boolean
        }
      }
      programs: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          venue: string
          coordinator_ids: string[]
          participant_ids: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          venue: string
          coordinator_ids?: string[]
          participant_ids?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          date?: string
          time?: string
          venue?: string
          coordinator_ids?: string[]
          participant_ids?: string[]
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          is_active?: boolean
        }
      }
    }
  }
}