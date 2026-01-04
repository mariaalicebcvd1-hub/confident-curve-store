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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          action_notes: string | null
          action_taken: boolean | null
          created_at: string
          description: string
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          priority: string | null
          stage: Database["public"]["Enums"]["funnel_stage"] | null
          suggestion_type: string
          title: string
        }
        Insert: {
          action_notes?: string | null
          action_taken?: boolean | null
          created_at?: string
          description: string
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: string | null
          stage?: Database["public"]["Enums"]["funnel_stage"] | null
          suggestion_type: string
          title: string
        }
        Update: {
          action_notes?: string | null
          action_taken?: boolean | null
          created_at?: string
          description?: string
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: string | null
          stage?: Database["public"]["Enums"]["funnel_stage"] | null
          suggestion_type?: string
          title?: string
        }
        Relationships: []
      }
      dashboard_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      funnel_goals: {
        Row: {
          created_at: string
          current_value: number | null
          deadline: string | null
          goal_name: string
          id: string
          is_active: boolean | null
          stage: Database["public"]["Enums"]["funnel_stage"]
          target_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          goal_name: string
          id?: string
          is_active?: boolean | null
          stage: Database["public"]["Enums"]["funnel_stage"]
          target_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          goal_name?: string
          id?: string
          is_active?: boolean | null
          stage?: Database["public"]["Enums"]["funnel_stage"]
          target_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      funnel_metrics: {
        Row: {
          created_at: string
          date: string
          id: string
          metric_name: string
          metric_value: number
          notes: string | null
          stage: Database["public"]["Enums"]["funnel_stage"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          metric_name: string
          metric_value?: number
          notes?: string | null
          stage: Database["public"]["Enums"]["funnel_stage"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metric_name?: string
          metric_value?: number
          notes?: string | null
          stage?: Database["public"]["Enums"]["funnel_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          created_at: string
          element_id: string | null
          event_name: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          metadata: Json | null
          page_url: string | null
          session_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          element_id?: string | null
          event_name?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          element_id?: string | null
          event_name?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          visitor_id?: string | null
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
      event_type:
        | "page_view"
        | "click"
        | "scroll"
        | "video_view"
        | "form_submit"
        | "add_to_cart"
        | "checkout_start"
      funnel_stage:
        | "attraction"
        | "engagement"
        | "consideration"
        | "conversion"
        | "retention"
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
    Enums: {
      event_type: [
        "page_view",
        "click",
        "scroll",
        "video_view",
        "form_submit",
        "add_to_cart",
        "checkout_start",
      ],
      funnel_stage: [
        "attraction",
        "engagement",
        "consideration",
        "conversion",
        "retention",
      ],
    },
  },
} as const
