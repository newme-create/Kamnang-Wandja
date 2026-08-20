import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  quoteFormSchema,
  QuoteFormValues,
  PROJECT_TYPES,
} from '../lib/validations/quote';
import { submitQuoteRequest } from '../app/actions/quote-actions';
import { QuoteRequestRow } from '../lib/types/database';
import { saveQuoteToStore } from '../lib/services/quoteStorage';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  User,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Wand2,
} from 'lucide-react';

interface QuoteFormProps {
  onSuccess?: (quote: QuoteRequestRow) => void;
  className?: string;
  defaultProjectType?: string;
}

const SAMPLE_PRESETS: { label: string; data: QuoteFormValues }[] = [
  {
    label: 'Villa Contemporaine',
    data: {
      client_name: 'Alexandre Meyer (SCI Horizon)',
      client_phone: '+33 6 42 78 91 30',
      client_email: 'a.meyer@sci-horizon.fr',
      project_type: 'Construction neuve',
      project_description:
        'Construction d’une villa contemporaine R+1 de 240 m² avec sous-sol complet, piscine en béton armé et toiture terrasse végétalisée. Terrain viabilisé, début des travaux prévu sous 3 mois.',
    },
  },
  {
    label: 'Rénovation Bureaux',
    data: {
      client_name: 'Cabinet Conseil & Associés',
      client_phone: '+33 1 45 67 89 00',
      client_email: 'travaux@conseil-associes.fr',
      project_type: 'Rénovation',
      project_description:
        'Réhabilitation totale de 350 m² de locaux tertiaires : dépose des cloisons, reprise de la chape, mise aux normes PMR, rénovation électrique CFO/CFA, isolation acoustique renforcée et faux-plafonds.',
    },
  },
  {
    label: 'Gros Œuvre Immeuble',
    data: {
      client_name: 'Groupe Promotion Grand Ouest',
      client_phone: '+33 6 11 22 33 44',
      client_email: 'projets@grand-ouest-immo.com',
      project_type: 'Gros œuvre',
      project_description:
        'Réalisation des fondations profondes (pieux forés), voiles béton banché et planchers dalles pleines pour un immeuble collectif de 12 logements sur 3 niveaux.',
    },
  },
];

export const QuoteForm: React.FC<QuoteFormProps> = ({
  onSuccess,
  className = '',
  defaultProjectType,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<QuoteRequestRow | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      client_name: '',
      client_phone: '',
      client_email: '',
      project_type: (defaultProjectType as any) || 'Construction neuve',
      project_description: '',
    },
    mode: 'onTouched',
  });

  const watchedDescription = watch('project_description') || '';
  const descriptionLength = watchedDescription.length;

  const handleAutoFill = (index = 0) => {
    const preset = SAMPLE_PRESETS[index];
    if (!preset) return;

    setActivePresetIndex(index);
    setValue('client_name', preset.data.client_name, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue('client_phone', preset.data.client_phone, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue('client_email', preset.data.client_email, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue('project_type', preset.data.project_type, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue('project_description', preset.data.project_description, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setServerError(null);
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await submitQuoteRequest(data);

      if (response.success && response.data) {
        saveQuoteToStore(response.data);
        setSubmissionSuccess(response.data);
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        setServerError(response.error || 'Erreur lors de la soumission de votre demande.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Une erreur réseau est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmissionSuccess(null);
    setServerError(null);
    setActivePresetIndex(null);
    reset();
  };

  // Success Confirmation Card
  if (submissionSuccess) {
    return (
      <div className="bg-[#0f131a] rounded-lg p-6 sm:p-8 border border-green-500/30 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mx-auto mb-5 shadow-lg shadow-green-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded bg-[#f06a1d]/15 text-[#f06a1d] text-xs font-black tracking-widest uppercase mb-2">
          RÉF: {submissionSuccess.id.substring(0, 8).toUpperCase()}
        </span>

        <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tight mb-2">
          DEMANDE DE DEVIS ENREGISTRÉE !
        </h3>

        <p className="text-white/75 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Merci <strong className="text-white">{submissionSuccess.client_name}</strong>. Nos ingénieurs étudient votre projet de <strong>{submissionSuccess.project_type}</strong> sous 24h à 48h.
        </p>

        {/* SLA & Steps Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-6 p-4 rounded bg-white/5 border border-white/10">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#f06a1d] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white uppercase">Étude 24-48h</div>
              <div className="text-[11px] text-white/60">Analyse par un métreur</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-[#f06a1d] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white uppercase">Accusé Envoyé</div>
              <div className="text-[11px] text-white/60 truncate">{submissionSuccess.client_email}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#f06a1d] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white uppercase">Devis Sans Engagement</div>
              <div className="text-[11px] text-white/60">Chiffrage garanti 30j</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Faire une autre demande</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-5 text-left ${className}`} noValidate>
      {/* Auto-fill Helper Bar */}
      <div className="p-3.5 rounded-lg bg-[#151a24] border border-[#f06a1d]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2 text-white/90 text-xs font-bold">
          <div className="w-6 h-6 rounded-full bg-[#f06a1d]/20 text-[#f06a1d] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-white uppercase tracking-wider font-extrabold text-[11px]">
            Auto-remplissage test :
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleAutoFill(idx)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                activePresetIndex === idx
                  ? 'bg-[#f06a1d] text-white shadow-md shadow-[#f06a1d]/30'
                  : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10'
              }`}
              title={`Remplir avec le scénario ${preset.label}`}
            >
              <Wand2 className="w-3 h-3" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner Alert if server error */}
      {serverError && (
        <div className="p-4 rounded-md bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Erreur de transmission :</div>
            <div>{serverError}</div>
          </div>
        </div>
      )}

      {/* Grid: Client Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Client Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-1.5">
            Nom Complet ou Entreprise <span className="text-[#f06a1d]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('client_name')}
              placeholder="Ex: Jean Dupont ou Société Bâtir"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-3.5 py-3 rounded bg-black/40 border text-white text-sm placeholder:text-white/30 focus:outline-none transition-colors ${
                errors.client_name
                  ? 'border-red-500/80 focus:border-red-500'
                  : touchedFields.client_name
                  ? 'border-green-500/60 focus:border-green-500'
                  : 'border-white/15 focus:border-[#f06a1d]'
              }`}
            />
          </div>
          {errors.client_name && (
            <p className="mt-1 text-[11px] text-red-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.client_name.message}</span>
            </p>
          )}
        </div>

        {/* Client Phone */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-1.5">
            Téléphone <span className="text-[#f06a1d]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              {...register('client_phone')}
              placeholder="Ex: +33 6 12 34 56 78"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-3.5 py-3 rounded bg-black/40 border text-white text-sm placeholder:text-white/30 focus:outline-none transition-colors ${
                errors.client_phone
                  ? 'border-red-500/80 focus:border-red-500'
                  : touchedFields.client_phone
                  ? 'border-green-500/60 focus:border-green-500'
                  : 'border-white/15 focus:border-[#f06a1d]'
              }`}
            />
          </div>
          {errors.client_phone && (
            <p className="mt-1 text-[11px] text-red-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.client_phone.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Grid: Email & Project Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-1.5">
            Email Professionnel <span className="text-[#f06a1d]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              {...register('client_email')}
              placeholder="votre.nom@entreprise.com"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-3.5 py-3 rounded bg-black/40 border text-white text-sm placeholder:text-white/30 focus:outline-none transition-colors ${
                errors.client_email
                  ? 'border-red-500/80 focus:border-red-500'
                  : touchedFields.client_email
                  ? 'border-green-500/60 focus:border-green-500'
                  : 'border-white/15 focus:border-[#f06a1d]'
              }`}
            />
          </div>
          {errors.client_email && (
            <p className="mt-1 text-[11px] text-red-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.client_email.message}</span>
            </p>
          )}
        </div>

        {/* Project Type */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-1.5">
            Type de Projet <span className="text-[#f06a1d]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Building className="w-4 h-4" />
            </div>
            <select
              {...register('project_type')}
              disabled={isSubmitting}
              className="w-full pl-10 pr-8 py-3 rounded bg-[#10141d] border border-white/15 text-white text-sm focus:outline-none focus:border-[#f06a1d] transition-colors cursor-pointer appearance-none"
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-[#10141d] text-white">
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
              ▼
            </div>
          </div>
          {errors.project_type && (
            <p className="mt-1 text-[11px] text-red-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.project_type.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Project Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-white/80">
            Description & Spécifications du Projet <span className="text-[#f06a1d]">*</span>
          </label>
          <span
            className={`text-[11px] font-mono ${
              descriptionLength < 20
                ? 'text-white/40'
                : descriptionLength > 2000
                ? 'text-red-400 font-bold'
                : 'text-green-400'
            }`}
          >
            {descriptionLength}/2000 car. (min. 20)
          </span>
        </div>

        <div className="relative">
          <textarea
            {...register('project_description')}
            rows={4}
            disabled={isSubmitting}
            placeholder="Détaillez votre projet : localisation géographique, superficie approximative, calendrier prévisionnel des travaux, contraintes techniques particulières..."
            className={`w-full p-3.5 rounded bg-black/40 border text-white text-sm placeholder:text-white/30 focus:outline-none transition-colors resize-y leading-relaxed ${
              errors.project_description
                ? 'border-red-500/80 focus:border-red-500'
                : descriptionLength >= 20
                ? 'border-green-500/60 focus:border-green-500'
                : 'border-white/15 focus:border-[#f06a1d]'
            }`}
          />
        </div>
        {errors.project_description && (
          <p className="mt-1 text-[11px] text-red-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.project_description.message}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-sm bg-[#f06a1d] hover:bg-[#ff7828] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(240,106,29,0.35)] flex items-center justify-center gap-2.5 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Validation & Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>ENVOYER MA DEMANDE DE DEVIS GRATUITE</span>
          </>
        )}
      </button>

      {/* Security & RLS Disclaimer */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-white/50 text-center pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
        <span>Données chiffrées & traitées en conformité RGPD / RLS Supabase</span>
      </div>
    </form>
  );
};
