export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          description: string
          price: number
          image: string
          created_at: string
          updated_at: string
          category: string
          sizes: string[]
          tags: string[]
        }
        Insert: {
          id?: number
          name: string
          description: string
          price: number
          image: string
          created_at?: string
          updated_at?: string
          category: string
          sizes: string[]
          tags: string[]
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          image?: string
          created_at?: string
          updated_at?: string
          category?: string
          sizes?: string[]
          tags?: string[]
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          status: string
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          status?: string
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          status?: string
          total?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 