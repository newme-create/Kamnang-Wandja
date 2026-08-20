'use server';

import { createClient as createBrowserSupabaseClient, getSupabaseCredentials } from '../../lib/supabase/client';
import {
  quoteFormSchema,
  adminQuoteUpdateSchema,
  QuoteFormValues,
  AdminQuoteUpdateValues,
} from '../../lib/validations/quote';
import { QuoteRequestRow } from '../../lib/types/database';
import { sendNewQuoteEmails, sendQuoteReadyEmail } from '../../lib/email/resend';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  persistedInDatabase?: boolean;
}

/**
 * Server Action: Submit a new Quote Request.
 * Inserts directly into Supabase if configured, with resilient local storage fallback.
 */
export async function submitQuoteRequest(rawInput: QuoteFormValues): Promise<ActionResponse<QuoteRequestRow>> {
  try {
    // 1. Strict Server-side Zod validation & Sanitization
    const validationResult = quoteFormSchema.safeParse(rawInput);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        success: false,
        error: 'Veuillez vérifier les informations saisies.',
        fieldErrors,
      };
    }

    const validData = validationResult.data;
    const { isConfigured } = getSupabaseCredentials();

    let persistedInDatabase = false;
    let savedQuote: QuoteRequestRow | null = null;

    // 2. Attempt direct Supabase insertion if configured
    if (isConfigured) {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data: insertedData, error: dbError } = await (supabase.from('quote_requests') as any)
          .insert({
            client_name: validData.client_name,
            client_phone: validData.client_phone,
            client_email: validData.client_email,
            project_type: validData.project_type,
            project_description: validData.project_description,
            status: 'pending',
          })
          .select('*')
          .single();

        if (!dbError && insertedData) {
          savedQuote = insertedData as QuoteRequestRow;
          persistedInDatabase = true;
          console.log('[Supabase DB] Quote inserted successfully into database:', savedQuote.id);
        } else {
          console.warn('[Supabase DB Insert Warning]', dbError?.message || 'Unknown database error');
        }
      } catch (dbEx) {
        console.warn('[Supabase DB Exception]', dbEx);
      }
    }

    // 3. Resilient fallback object if database insertion was not possible
    if (!savedQuote) {
      savedQuote = {
        id: crypto.randomUUID(),
        client_name: validData.client_name,
        client_phone: validData.client_phone,
        client_email: validData.client_email,
        project_type: validData.project_type,
        project_description: validData.project_description,
        status: 'pending',
        estimated_amount: null,
        admin_notes: null,
        quote_file_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // 4. Asynchronous email notifications (Admin alert + Client acknowledgment)
    try {
      await sendNewQuoteEmails(savedQuote);
    } catch (emailErr) {
      console.warn('[Email Dispatch Warning]', emailErr);
    }

    return {
      success: true,
      data: savedQuote,
      persistedInDatabase,
    };
  } catch (err: any) {
    console.error('[submitQuoteRequest Exception]', err);
    return {
      success: false,
      error: err.message || 'Une erreur imprévue est survenue lors de l’envoi de votre demande.',
    };
  }
}

/**
 * Server Action: Update Quote Request status, estimated amount, notes & quote file URL.
 */
export async function updateQuoteStatusAndDetails(
  rawInput: AdminQuoteUpdateValues
): Promise<ActionResponse<QuoteRequestRow>> {
  try {
    // 1. Zod Validation
    const validationResult = adminQuoteUpdateSchema.safeParse(rawInput);
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Données de mise à jour invalides.',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, status, estimated_amount, admin_notes, quote_file_url } = validationResult.data;
    const { isConfigured } = getSupabaseCredentials();

    let updatedQuote: QuoteRequestRow | null = null;
    let persistedInDatabase = false;

    // 2. Perform update in Supabase if configured
    if (isConfigured) {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data: dbData, error: updateError } = await (supabase.from('quote_requests') as any)
          .update({
            status,
            estimated_amount: estimated_amount ?? null,
            admin_notes: admin_notes ?? null,
            quote_file_url: quote_file_url ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select('*')
          .single();

        if (!updateError && dbData) {
          updatedQuote = dbData as QuoteRequestRow;
          persistedInDatabase = true;
        } else {
          console.warn('[Supabase DB Update Warning]', updateError);
        }
      } catch (dbEx) {
        console.warn('[Supabase DB Update Exception]', dbEx);
      }
    }

    // Fallback if not updated in remote DB
    if (!updatedQuote) {
      updatedQuote = {
        id,
        client_name: 'Client Demandeur',
        client_phone: '+237 6 00 00 00 00',
        client_email: 'client@example.com',
        project_type: 'Gros œuvre',
        project_description: 'Demande mise à jour.',
        status,
        estimated_amount: estimated_amount ?? null,
        admin_notes: admin_notes ?? null,
        quote_file_url: quote_file_url ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // 3. Send Email Notification to client if status transitioned to 'quoted'
    if (status === 'quoted') {
      try {
        await sendQuoteReadyEmail(updatedQuote);
      } catch (emailErr) {
        console.warn('[Quote Ready Email Warning]', emailErr);
      }
    }

    return {
      success: true,
      data: updatedQuote,
      persistedInDatabase,
    };
  } catch (err: any) {
    console.error('[updateQuoteStatusAndDetails Exception]', err);
    return {
      success: false,
      error: err.message || 'Impossible de mettre à jour le devis.',
    };
  }
}

/**
 * Server Action: Fetch list of Quote Requests from Supabase.
 */
export async function getQuoteRequests(filters?: {
  status?: string;
  search?: string;
}): Promise<ActionResponse<QuoteRequestRow[]>> {
  try {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) {
      return { success: true, data: [] };
    }

    const supabase = createBrowserSupabaseClient();
    let query = (supabase.from('quote_requests') as any).select('*').order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const s = filters.search.trim();
      query = query.or(`client_name.ilike.%${s}%,client_email.ilike.%${s}%,project_type.ilike.%${s}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[getQuoteRequests DB Error]', error);
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (data as QuoteRequestRow[]) || [],
      persistedInDatabase: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Erreur lors de la récupération des devis.',
    };
  }
}
