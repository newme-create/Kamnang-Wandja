export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'staff';

export type QuoteStatus = 'pending' | 'in_review' | 'quoted' | 'rejected' | 'accepted';

export type ProjectType =
  | 'Rénovation'
  | 'Gros œuvre'
  | 'Construction neuve'
  | 'Extension'
  | 'Finitions'
  | 'Autre';

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: UserRole;
          created_at?: string;
        };
      };
      quote_requests: {
        Row: {
          id: string;
          client_name: string;
          client_phone: string;
          client_email: string;
          project_type: string;
          project_description: string;
          status: QuoteStatus;
          estimated_amount: number | null;
          admin_notes: string | null;
          quote_file_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_phone: string;
          client_email: string;
          project_type: string;
          project_description: string;
          status?: QuoteStatus;
          estimated_amount?: number | null;
          admin_notes?: string | null;
          quote_file_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_phone?: string;
          client_email?: string;
          project_type?: string;
          project_description?: string;
          status?: QuoteStatus;
          estimated_amount?: number | null;
          admin_notes?: string | null;
          quote_file_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
}

export type QuoteRequestRow = Database['public']['Tables']['quote_requests']['Row'];
export type QuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert'];
export type QuoteRequestUpdate = Database['public']['Tables']['quote_requests']['Update'];
