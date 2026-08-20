import { QuoteRequestRow, QuoteStatus } from '../types/database';
import { createClient as createBrowserSupabaseClient, getSupabaseCredentials } from '../supabase/client';

const STORAGE_KEY = 'batir_pro_quote_requests';
export const QUOTES_UPDATED_EVENT = 'batir_quotes_updated';

export const DEFAULT_INITIAL_QUOTES: QuoteRequestRow[] = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    client_name: 'Société Immobilière du Littoral',
    client_phone: '+237 6 99 88 77 66',
    client_email: 'direction@immolittoral.cm',
    project_type: 'Construction neuve',
    project_description: 'Construction d’un complexe de bureaux R+5 avec sous-sol parking à Douala Bonanjo. Surface totale 3 500 m². Début souhaité T3.',
    status: 'in_review',
    estimated_amount: 450000000,
    admin_notes: 'Étude de sol géotechnique requise. Contact pris avec l’architecte pour plans de structure.',
    quote_file_url: 'https://batir-pro.com/devis/devis-immo-littoral-v1.pdf',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'f7e8d9c0-b1a2-4f3e-8d7c-6b5a4f3e2d1c',
    client_name: 'Jean-Marc Kamga',
    client_phone: '+33 6 45 78 90 12',
    client_email: 'jm.kamga@orange.fr',
    project_type: 'Rénovation',
    project_description: 'Rénovation complète d’une villa résidentielle 280 m² avec renforcement structurel, reprise d’étanchéité toiture et réaménagement paysager.',
    status: 'pending',
    estimated_amount: null,
    admin_notes: null,
    quote_file_url: null,
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: '9a8b7c6d-5e4f-4d3c-2b1a-0f9e8d7c6b5a',
    client_name: 'Logistique Portuaire Ouest SARL',
    client_phone: '+237 6 77 11 22 33',
    client_email: 'projets@portuaire-ouest.com',
    project_type: 'Gros œuvre',
    project_description: 'Dallage industriel lourd 10 000 m² pour terminal conteneurs avec caniveaux préfabriqués et voirie lourde de circulation.',
    status: 'quoted',
    estimated_amount: 820000000,
    admin_notes: 'Devis complet validé par le bureau d’études. Offre transmise par email au directeur technique.',
    quote_file_url: 'https://batir-pro.com/devis/devis-logistique-portuaire.pdf',
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
    client_name: 'SCI Mont Fébé',
    client_phone: '+237 6 55 44 33 22',
    client_email: 'contact@scimontfebe.cm',
    project_type: 'Extension',
    project_description: 'Extension d’un pavillon de santé de 400 m² sur 2 niveaux avec structure mixte acier/béton.',
    status: 'accepted',
    estimated_amount: 175000000,
    admin_notes: 'Contrat signé le 18/08. Ordre de service de démarrage en cours de rédaction.',
    quote_file_url: 'https://batir-pro.com/devis/contrat-sci-montfebe.pdf',
    created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

/**
 * Get all stored quotes from localStorage (with initial fallback seed).
 */
export function getStoredQuotes(): QuoteRequestRow[] {
  if (typeof window === 'undefined') {
    return DEFAULT_INITIAL_QUOTES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_QUOTES));
      return DEFAULT_INITIAL_QUOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_QUOTES));
    return DEFAULT_INITIAL_QUOTES;
  } catch (err) {
    console.warn('[quoteStorage] Failed to read localStorage, using default quotes', err);
    return DEFAULT_INITIAL_QUOTES;
  }
}

/**
 * Save a newly submitted quote to local storage and dispatch update notification.
 */
export function saveQuoteToStore(newQuote: QuoteRequestRow): QuoteRequestRow[] {
  const current = getStoredQuotes();
  // Check if quote already exists by ID
  const existingIdx = current.findIndex((q) => q.id === newQuote.id);
  let updatedList: QuoteRequestRow[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = newQuote;
  } else {
    // Prepend to top of list for instant admin visibility
    updatedList = [newQuote, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent(QUOTES_UPDATED_EVENT, { detail: newQuote }));
    } catch (e) {
      console.warn('[quoteStorage] Failed to write localStorage', e);
    }
  }

  return updatedList;
}

/**
 * Update an existing quote in local storage and dispatch event.
 */
export function updateStoredQuote(id: string, updates: Partial<QuoteRequestRow>): QuoteRequestRow | null {
  const current = getStoredQuotes();
  const index = current.findIndex((q) => q.id === id);

  if (index === -1) {
    return null;
  }

  const updatedItem: QuoteRequestRow = {
    ...current[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const updatedList = [...current];
  updatedList[index] = updatedItem;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent(QUOTES_UPDATED_EVENT, { detail: updatedItem }));
    } catch (e) {
      console.warn('[quoteStorage] Failed to update localStorage', e);
    }
  }

  return updatedItem;
}

/**
 * Delete a quote by ID.
 */
export function deleteStoredQuote(id: string): boolean {
  const current = getStoredQuotes();
  const filtered = current.filter((q) => q.id !== id);

  if (filtered.length === current.length) return false;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent(QUOTES_UPDATED_EVENT, { detail: { deletedId: id } }));
    } catch (e) {
      console.warn('[quoteStorage] Failed to delete from localStorage', e);
    }
  }

  return true;
}

/**
 * Get count of pending quotes.
 */
export function getPendingQuotesCount(): number {
  const quotes = getStoredQuotes();
  return quotes.filter((q) => q.status === 'pending').length;
}

/**
 * Asynchronously syncs with Supabase if configured, while preserving local submissions.
 */
export async function syncQuotesWithSupabase(): Promise<{ quotes: QuoteRequestRow[]; syncedWithDb: boolean; error?: string }> {
  const localQuotes = getStoredQuotes();
  const { isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return { quotes: localQuotes, syncedWithDb: false };
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data: dbQuotes, error } = await (supabase.from('quote_requests') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { quotes: localQuotes, syncedWithDb: false, error: error.message };
    }

    if (!dbQuotes || dbQuotes.length === 0) {
      return { quotes: localQuotes, syncedWithDb: true };
    }

    // Merge: Map by ID
    const map = new Map<string, QuoteRequestRow>();
    
    // Put db quotes
    for (const q of dbQuotes as QuoteRequestRow[]) {
      map.set(q.id, q);
    }

    // Merge local quotes
    for (const lq of localQuotes) {
      if (!map.has(lq.id)) {
        map.set(lq.id, lq);
      } else {
        const existing = map.get(lq.id)!;
        if (new Date(lq.updated_at).getTime() > new Date(existing.updated_at).getTime()) {
          map.set(lq.id, lq);
        }
      }
    }

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent(QUOTES_UPDATED_EVENT, { detail: merged }));
      } catch (e) {
        // ignore
      }
    }

    return { quotes: merged, syncedWithDb: true };
  } catch (err: any) {
    return { quotes: localQuotes, syncedWithDb: false, error: err.message };
  }
}

/**
 * Pushes all existing local quotes to Supabase table quote_requests.
 */
export async function pushLocalQuotesToSupabase(): Promise<{
  success: boolean;
  insertedCount: number;
  message: string;
  error?: string;
}> {
  const localQuotes = getStoredQuotes();
  const { isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return {
      success: false,
      insertedCount: 0,
      message: 'Veuillez d’abord renseigner votre URL Supabase et votre clé Anon.',
    };
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const rowsToUpsert = localQuotes.map((q) => ({
      id: q.id,
      client_name: q.client_name,
      client_phone: q.client_phone,
      client_email: q.client_email,
      project_type: q.project_type,
      project_description: q.project_description,
      status: q.status,
      estimated_amount: q.estimated_amount,
      admin_notes: q.admin_notes,
      quote_file_url: q.quote_file_url,
      created_at: q.created_at,
      updated_at: q.updated_at || new Date().toISOString(),
    }));

    const { data, error } = await (supabase.from('quote_requests') as any).upsert(rowsToUpsert, {
      onConflict: 'id',
    });

    if (error) {
      const isRlsError = error.message?.toLowerCase().includes('row-level security') || error.code === '42501';
      const msg = isRlsError
        ? `Erreur de permission RLS Supabase : la politique de sécurité bloque l'écriture. Exécutez le script SQL mis à jour dans le SQL Editor de Supabase pour autoriser le rôle public/anon.`
        : `Erreur d’envoi vers Supabase: ${error.message}`;

      return {
        success: false,
        insertedCount: 0,
        message: msg,
        error: error.message,
      };
    }

    return {
      success: true,
      insertedCount: localQuotes.length,
      message: `${localQuotes.length} demande(s) de devis ont été envoyées avec succès vers votre table Supabase.`,
    };
  } catch (err: any) {
    return {
      success: false,
      insertedCount: 0,
      message: `Erreur: ${err.message || err}`,
      error: String(err),
    };
  }
}

/**
 * Generate and submit a demo client quote in 1 click (useful for testing admin flow).
 */
export function createQuickDemoQuote(): QuoteRequestRow {
  const sampleNames = ['Groupe Hôtelier Océan', 'Cabinet Médical Akwa', 'Investissements Étoile SARL', 'Dr. Paul Ebanda'];
  const sampleTypes = ['Gros œuvre', 'Construction neuve', 'Rénovation', 'Extension'];
  const sampleDesc = [
    'Construction d’un bâtiment R+3 pour hébergement de standing à Kribi avec piscine et voirie.',
    'Aménagement d’une clinique médicale avec blocs opératoires et renforcement de plancher.',
    'Travaux de génie civil et dallage renforcé pour entrepôt de stockage à Bassa Douala.',
  ];

  const randIdx = Math.floor(Math.random() * sampleNames.length);
  const newDemoQuote: QuoteRequestRow = {
    id: crypto.randomUUID(),
    client_name: sampleNames[randIdx] || 'Nouveau Client Entreprise',
    client_phone: `+237 6 ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)}`,
    client_email: `contact@${(sampleNames[randIdx] || 'client').toLowerCase().replace(/[^a-z0-9]/g, '')}.cm`,
    project_type: sampleTypes[Math.floor(Math.random() * sampleTypes.length)] || 'Construction neuve',
    project_description: sampleDesc[Math.floor(Math.random() * sampleDesc.length)] || 'Projet de construction clé en main.',
    status: 'pending',
    estimated_amount: null,
    admin_notes: null,
    quote_file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveQuoteToStore(newDemoQuote);
  return newDemoQuote;
}
