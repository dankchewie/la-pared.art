export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artists: {
        Row: {
          created_at: string
          display_name: string
          id: string
          location: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          location?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          location?: string | null
          slug?: string
        }
        Relationships: []
      }
      artworks: {
        Row: {
          created_at: string
          id: string
          image_height: number | null
          image_url: string
          image_width: number | null
          medium: string | null
          size: string | null
          sort_order: number | null
          statement: string | null
          title: string
          user_id: string
          year: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_height?: number | null
          image_url: string
          image_width?: number | null
          medium?: string | null
          size?: string | null
          sort_order?: number | null
          statement?: string | null
          title: string
          user_id: string
          year?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_height?: number | null
          image_url?: string
          image_width?: number | null
          medium?: string | null
          size?: string | null
          sort_order?: number | null
          statement?: string | null
          title?: string
          user_id?: string
          year?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
