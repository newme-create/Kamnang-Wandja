import { z } from 'zod';

export const PROJECT_TYPES = [
  'Rénovation',
  'Gros œuvre',
  'Construction neuve',
  'Extension',
  'Finitions',
  'Autre',
] as const;

export const QUOTE_STATUSES = [
  'pending',
  'in_review',
  'quoted',
  'rejected',
  'accepted',
] as const;

// Helper to sanitize inputs and remove potential script injections / HTML tags
const sanitizeString = (val: string) => {
  return val
    .replace(/[<>]/g, '') // remove direct tag brackets
    .trim();
};

// Regex for international / local phone numbers
const phoneRegex = /^(\+?\d{1,4}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?[\d\s.-]{6,14}$/;

/**
 * Client Quote Request Form Schema (Zod)
 */
export const quoteFormSchema = z.object({
  client_name: z
    .string()
    .trim()
    .min(2, { message: 'Le nom doit comporter au moins 2 caractères.' })
    .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères.' })
    .transform(sanitizeString),

  client_phone: z
    .string()
    .trim()
    .regex(phoneRegex, {
      message: 'Veuillez saisir un numéro de téléphone valide (ex: +33 6 12 34 56 78 ou 0612345678).',
    })
    .transform(sanitizeString),

  client_email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Veuillez fournir une adresse e-mail professionnelle valide.' }),

  project_type: z.enum(PROJECT_TYPES, {
    message: 'Veuillez sélectionner un type de projet valide.',
  }),

  project_description: z
    .string()
    .trim()
    .min(20, { message: 'Veuillez détailler votre projet (au moins 20 caractères).' })
    .max(2000, { message: 'La description ne doit pas dépasser 2000 caractères.' })
    .transform(sanitizeString),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

/**
 * Admin Quote Request Update Schema (Zod)
 */
export const adminQuoteUpdateSchema = z.object({
  id: z.string().uuid({ message: 'ID de devis invalide.' }),
  status: z.enum(QUOTE_STATUSES, {
    message: 'Statut de devis invalide.',
  }),
  estimated_amount: z
    .union([z.number().positive({ message: 'Le montant estimé doit être positif.' }), z.null()])
    .optional(),
  admin_notes: z
    .union([z.string().max(3000, { message: 'Les notes ne doivent pas dépasser 3000 caractères.' }), z.null()])
    .optional()
    .transform((val) => (val ? sanitizeString(val) : null)),
  quote_file_url: z
    .union([z.string().url({ message: 'Lien de devis invalide (URL attendue).' }), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
});

export type AdminQuoteUpdateValues = z.infer<typeof adminQuoteUpdateSchema>;
