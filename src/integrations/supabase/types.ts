export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          branch_code: string
          branch_name: string
          created_at: string
          degree_type: string
          duration: number
          id: string
        }
        Insert: {
          branch_code: string
          branch_name: string
          created_at?: string
          degree_type?: string
          duration?: number
          id?: string
        }
        Update: {
          branch_code?: string
          branch_name?: string
          created_at?: string
          degree_type?: string
          duration?: number
          id?: string
        }
        Relationships: []
      }
      college_branches: {
        Row: {
          branch_id: string
          college_id: string
          created_at: string
          fees_per_year: number | null
          id: string
          intake_capacity: number | null
        }
        Insert: {
          branch_id: string
          college_id: string
          created_at?: string
          fees_per_year?: number | null
          id?: string
          intake_capacity?: number | null
        }
        Update: {
          branch_id?: string
          college_id?: string
          created_at?: string
          fees_per_year?: number | null
          id?: string
          intake_capacity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "college_branches_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_branches_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          autonomy_status: string | null
          college_code: string
          college_name: string
          created_at: string
          established_year: number | null
          id: string
          location: string
          type: string | null
          university_name: string | null
          website_url: string | null
        }
        Insert: {
          autonomy_status?: string | null
          college_code: string
          college_name: string
          created_at?: string
          established_year?: number | null
          id?: string
          location: string
          type?: string | null
          university_name?: string | null
          website_url?: string | null
        }
        Update: {
          autonomy_status?: string | null
          college_code?: string
          college_name?: string
          created_at?: string
          established_year?: number | null
          id?: string
          location?: string
          type?: string | null
          university_name?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      cutoffs: {
        Row: {
          category: string
          closing_percentile: number
          college_branch_id: string
          created_at: string
          domicile: string
          gender: string | null
          id: string
          opening_percentile: number
          round_number: number
          year: number
        }
        Insert: {
          category: string
          closing_percentile: number
          college_branch_id: string
          created_at?: string
          domicile: string
          gender?: string | null
          id?: string
          opening_percentile: number
          round_number: number
          year: number
        }
        Update: {
          category?: string
          closing_percentile?: number
          college_branch_id?: string
          created_at?: string
          domicile?: string
          gender?: string | null
          id?: string
          opening_percentile?: number
          round_number?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "cutoffs_college_branch_id_fkey"
            columns: ["college_branch_id"]
            isOneToOne: false
            referencedRelation: "college_branches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          category: string | null
          created_at: string
          domicile: string | null
          email: string
          full_name: string
          id: string
          percentile: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          domicile?: string | null
          email: string
          full_name: string
          id?: string
          percentile?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          domicile?: string | null
          email?: string
          full_name?: string
          id?: string
          percentile?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_predictions: {
        Row: {
          category: string
          created_at: string
          domicile: string
          id: string
          percentile: number
          predicted_colleges: Json | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          domicile: string
          id?: string
          percentile: number
          predicted_colleges?: Json | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          domicile?: string
          id?: string
          percentile?: number
          predicted_colleges?: Json | null
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
