import React, { useState, useEffect, useCallback } from 'react';
import { QuoteRequestRow, QuoteStatus } from '../../lib/types/database';
import { updateQuoteStatusAndDetails } from '../../app/actions/quote-actions';
import {
  getStoredQuotes,
  updateStoredQuote,
  deleteStoredQuote,
  syncQuotesWithSupabase,
  pushLocalQuotesToSupabase,
  createQuickDemoQuote,
  QUOTES_UPDATED_EVENT,
} from '../../lib/services/quoteStorage';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
} from '../../lib/supabase/client';
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  AlertCircle,
  Save,
  Loader2,
  Mail,
  Phone,
  X,
  Plus,
  RefreshCw,
  Database,
  Trash2,
  Download,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building2,
  Briefcase,
  Layers,
  Copy,
  Check,
  Link,
  ShieldCheck,
  Send,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  pending: {
    label: 'En attente',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    desc: 'Nouvelle demande reçue, en attente de premier traitement.',
  },
  in_review: {
    label: 'En cours d’étude',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    desc: 'Métré et dimensionnement en cours au bureau d’études.',
  },
  quoted: {
    label: 'Devis chiffré',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    desc: 'Chiffrage finalisé et proposition commerciale envoyée.',
  },
  accepted: {
    label: 'Accepté / Signé',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    desc: 'Devis validé par le client, prêt pour démarrage des travaux.',
  },
  rejected: {
    label: 'Non retenu',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    desc: 'Dossier clos ou non retenu.',
  },
};

const SQL_SCHEMA_SCRIPT = `-- 1. Création de la table des demandes de devis (si non existante)
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT NOT NULL,
    project_type TEXT NOT NULL,
    project_description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'quoted', 'accepted', 'rejected')),
    estimated_amount NUMERIC(15, 2) NULL,
    admin_notes TEXT NULL,
    quote_file_url TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Accorder les permissions d'accès au rôle anon et public
GRANT ALL ON TABLE public.quote_requests TO anon, authenticated, service_role;

-- 3. Activer la sécurité Row Level Security (RLS)
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 4. Nettoyer les anciennes politiques restrictives
DROP POLICY IF EXISTS "Allow public insert" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow public select" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow public update" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow all for anon and authenticated" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow all operations for public and anon" ON public.quote_requests;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.quote_requests;
DROP POLICY IF EXISTS "Public can insert quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Public can select quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Public can update quote requests" ON public.quote_requests;

-- 5. Créer la politique universelle pour autoriser les envois et la gestion des devis
CREATE POLICY "Allow all operations for public and anon"
ON public.quote_requests
FOR ALL
TO public, anon, authenticated
USING (true)
WITH CHECK (true);
`;

export const AdminQuoteDashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRequestRow[]>(() => getStoredQuotes());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequestRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Supabase Connection Modal State
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState(() => getSupabaseCredentials());
  const [inputUrl, setInputUrl] = useState(() => {
    const creds = getSupabaseCredentials();
    return creds.isConfigured ? creds.url : '';
  });
  const [inputKey, setInputKey] = useState(() => {
    const creds = getSupabaseCredentials();
    return creds.isConfigured ? creds.anonKey : '';
  });
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    connected: boolean;
    tableExists: boolean;
    message: string;
  } | null>(null);
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [isPushingQuotes, setIsPushingQuotes] = useState(false);
  const [pushResult, setPushResult] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Editable fields in detail modal
  const [editStatus, setEditStatus] = useState<QuoteStatus>('pending');
  const [editAmount, setEditAmount] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editFileUrl, setEditFileUrl] = useState<string>('');

  const reloadQuotes = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const currentLocal = getStoredQuotes();
      setQuotes(currentLocal);

      // Background silent sync
      const syncResult = await syncQuotesWithSupabase();
      if (syncResult.quotes && syncResult.quotes.length > 0) {
        setQuotes(syncResult.quotes);
      }
    } catch (e) {
      console.warn('[AdminQuoteDashboard] Sync error', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Listen for new quote events in real-time
  useEffect(() => {
    reloadQuotes();

    const handleQuotesUpdated = () => {
      setQuotes(getStoredQuotes());
    };

    window.addEventListener(QUOTES_UPDATED_EVENT, handleQuotesUpdated);
    window.addEventListener('storage', handleQuotesUpdated);

    // Auto-refresh poll every 10 seconds
    const interval = setInterval(() => {
      setQuotes(getStoredQuotes());
    }, 10000);

    return () => {
      window.removeEventListener(QUOTES_UPDATED_EVENT, handleQuotesUpdated);
      window.removeEventListener('storage', handleQuotesUpdated);
      clearInterval(interval);
    };
  }, [reloadQuotes]);

  // Open quote details
  const handleOpenDetail = (quote: QuoteRequestRow) => {
    setSelectedQuote(quote);
    setEditStatus(quote.status);
    setEditAmount(quote.estimated_amount ? quote.estimated_amount.toString() : '');
    setEditNotes(quote.admin_notes || '');
    setEditFileUrl(quote.quote_file_url || '');
    setSaveFeedback(null);
    setDeleteConfirmId(null);
  };

  // Quick test quote generation
  const handleCreateTestQuote = () => {
    const newDemo = createQuickDemoQuote();
    reloadQuotes();
    handleOpenDetail(newDemo);
  };

  // Save changes to quote
  const handleSaveQuote = async () => {
    if (!selectedQuote) return;

    setIsSaving(true);
    setSaveFeedback(null);

    const parsedAmount = editAmount.trim() ? parseFloat(editAmount.replace(/[^0-9.]/g, '')) : null;

    try {
      // 1. Update local storage directly for instant response
      const updatedLocal = updateStoredQuote(selectedQuote.id, {
        status: editStatus,
        estimated_amount: parsedAmount,
        admin_notes: editNotes.trim() || null,
        quote_file_url: editFileUrl.trim() || null,
      });

      if (updatedLocal) {
        setSelectedQuote(updatedLocal);
      }

      // 2. Server Action update
      const response = await updateQuoteStatusAndDetails({
        id: selectedQuote.id,
        status: editStatus,
        estimated_amount: parsedAmount,
        admin_notes: editNotes.trim() || null,
        quote_file_url: editFileUrl.trim() || null,
      });

      if (response.success && response.data) {
        setSelectedQuote(response.data);
        updateStoredQuote(response.data.id, response.data);
      }

      setSaveFeedback({
        success: true,
        message: 'Modifications enregistrées avec succès dans la base de données.',
      });
      reloadQuotes();
    } catch (err: any) {
      setSaveFeedback({
        success: false,
        message: err.message || 'Erreur lors de la sauvegarde.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete quote
  const handleDeleteQuote = (id: string) => {
    deleteStoredQuote(id);
    setSelectedQuote(null);
    setDeleteConfirmId(null);
    reloadQuotes();
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (quotes.length === 0) return;

    const headers = ['ID', 'Date', 'Nom Client', 'Téléphone', 'Email', 'Type Projet', 'Statut', 'Montant Estimé (FCFA)', 'Notes'];
    const rows = quotes.map((q) => [
      `"${q.id}"`,
      `"${new Date(q.created_at).toLocaleDateString('fr-FR')}"`,
      `"${q.client_name.replace(/"/g, '""')}"`,
      `"${q.client_phone}"`,
      `"${q.client_email}"`,
      `"${q.project_type}"`,
      `"${STATUS_CONFIG[q.status]?.label || q.status}"`,
      `"${q.estimated_amount || 0}"`,
      `"${(q.admin_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `devis-batir-pro-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Test Supabase Connection & Save
  const handleSaveAndTestSupabase = async () => {
    if (!inputUrl.trim() || !inputKey.trim()) {
      setTestResult({
        tested: true,
        connected: false,
        tableExists: false,
        message: 'Veuillez saisir votre URL de projet Supabase et votre clé Anon.',
      });
      return;
    }

    setIsTestingConn(true);
    setTestResult(null);

    // Save to local storage
    saveSupabaseCredentials(inputUrl, inputKey);
    setSupabaseConfig(getSupabaseCredentials());

    try {
      const res = await testSupabaseConnection();
      setTestResult({
        tested: true,
        connected: res.connected,
        tableExists: res.tableExists,
        message: res.message,
      });

      if (res.connected && res.tableExists) {
        // Auto push existing quotes
        const pushRes = await pushLocalQuotesToSupabase();
        setPushResult(pushRes.message);
        reloadQuotes();
      }
    } catch (e: any) {
      setTestResult({
        tested: true,
        connected: false,
        tableExists: false,
        message: e.message || 'Échec de connexion.',
      });
    } finally {
      setIsTestingConn(false);
    }
  };

  // Push all local quotes to Supabase manually
  const handlePushAllQuotes = async () => {
    setIsPushingQuotes(true);
    setPushResult(null);
    try {
      const res = await pushLocalQuotesToSupabase();
      setPushResult(res.message);
      reloadQuotes();
    } catch (e: any) {
      setPushResult(e.message || 'Erreur lors du transfert.');
    } finally {
      setIsPushingQuotes(false);
    }
  };

  // Copy SQL script
  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Filtered quotes
  const filteredQuotes = quotes.filter((quote) => {
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    const qLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !qLower ||
      quote.client_name.toLowerCase().includes(qLower) ||
      quote.client_email.toLowerCase().includes(qLower) ||
      quote.client_phone.toLowerCase().includes(qLower) ||
      quote.project_type.toLowerCase().includes(qLower) ||
      quote.project_description.toLowerCase().includes(qLower);

    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    inReview: quotes.filter((q) => q.status === 'in_review').length,
    quoted: quotes.filter((q) => q.status === 'quoted').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
    totalVolume: quotes.reduce((acc, q) => acc + (q.estimated_amount || 0), 0),
  };

  const formatFCFA = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'Non chiffré';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white uppercase">
              TABLEAU DE BORD <span className="text-[#f06a1d]">DEVIS</span>
            </h1>

            {/* Database status pill */}
            <button
              onClick={() => setShowSupabaseModal(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                supabaseConfig.isConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>
                {supabaseConfig.isConfigured ? 'Supabase Connecté' : 'Lier mon Supabase (Recommandé)'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseConfig.isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-white/60 mt-1">
            Les demandes de devis s'enregistrent automatiquement et s'affichent ici en temps réel.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setShowSupabaseModal(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#161b26] hover:bg-[#1f2636] border border-[#f06a1d]/40 text-[#f06a1d] hover:text-[#ff7828] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            title="Configurer la liaison avec votre compte Supabase"
          >
            <Database className="w-4 h-4" />
            <span>Connecter Supabase</span>
          </button>

          <button
            onClick={handleCreateTestQuote}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#f06a1d] hover:bg-[#ff7828] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            title="Générer une demande de test pour vérifier la réception automatique"
          >
            <Plus className="w-4 h-4" />
            <span>Tester une demande</span>
          </button>

          <button
            onClick={reloadQuotes}
            disabled={isRefreshing}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#161b26] hover:bg-[#1f2636] border border-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
            title="Actualiser la liste"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-white/70 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#161b26] hover:bg-[#1f2636] border border-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
            title="Télécharger l'historique complet des devis en format Excel/CSV"
          >
            <Download className="w-3.5 h-3.5 text-white/70" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Supabase Notice Banner if not configured */}
      {!supabaseConfig.isConfigured && (
        <div className="my-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-300">
                Pourquoi vous ne voyez pas encore les demandes dans votre console Supabase ?
              </p>
              <p className="text-xs text-amber-200/80 mt-0.5">
                L'application enregistre actuellement vos devis localement. Pour que chaque nouvelle demande aille directement dans votre projet Supabase, cliquez sur « Connecter Supabase ».
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSupabaseModal(true)}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
          >
            Lier mon Supabase (2 min)
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-[#10141d] border border-white/10 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/50 text-xs font-medium uppercase tracking-wider">
            <span>Total Demandes</span>
            <FileText className="w-4 h-4 text-white/60" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{stats.total}</div>
          <div className="text-[11px] text-white/50 mt-1">Dossiers enregistrés</div>
        </div>

        <div className="bg-[#10141d] border border-amber-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium uppercase tracking-wider">
            <span>À Traiter (Nouvelles)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{stats.pending}</div>
          <div className="text-[11px] text-white/50 mt-1">En attente de métré</div>
        </div>

        <div className="bg-[#10141d] border border-blue-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-blue-400 text-xs font-medium uppercase tracking-wider">
            <span>En Étude</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">{stats.inReview}</div>
          <div className="text-[11px] text-white/50 mt-1">Chiffrage en cours</div>
        </div>

        <div className="bg-[#10141d] border border-emerald-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium uppercase tracking-wider">
            <span>Volume Estimé</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 truncate">
            {formatFCFA(stats.totalVolume)}
          </div>
          <div className="text-[11px] text-white/50 mt-1">
            {stats.quoted + stats.accepted} devis chiffrés
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#10141d] border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
            <button
              onClick={() => setSelectedStatus('all')}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Tous ({quotes.length})
            </button>

            {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map((status) => {
              const cfg = STATUS_CONFIG[status];
              const count = quotes.filter((q) => q.status === status).length;
              const isActive = selectedStatus === status;

              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                      : 'bg-white/5 border-transparent text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{cfg.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (nom, email, type...)"
              className="w-full bg-[#161b26] border border-white/15 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#f06a1d]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quote List Table */}
      <div className="bg-[#10141d] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        {filteredQuotes.length === 0 ? (
          <div className="py-16 text-center px-4">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-base font-semibold text-white">Aucune demande trouvée</p>
            <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
              {searchQuery
                ? 'Modifiez vos critères de recherche pour afficher des résultats.'
                : 'Les nouvelles demandes de devis soumises depuis le site apparaîtront automatiquement ici.'}
            </p>
            <button
              onClick={handleCreateTestQuote}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#f06a1d] text-white text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Créer une demande de test
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-[#141923] text-white/50 uppercase tracking-wider text-[10px] font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client & Contact</th>
                  <th className="py-3 px-4">Type de Projet</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Montant Estimé</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredQuotes.map((quote) => {
                  const statusInfo = STATUS_CONFIG[quote.status] || STATUS_CONFIG.pending;
                  const isNew =
                    new Date().getTime() - new Date(quote.created_at).getTime() < 24 * 3600 * 1000;

                  return (
                    <tr
                      key={quote.id}
                      onClick={() => handleOpenDetail(quote)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-white/60 font-mono">
                        <div className="flex items-center gap-1.5">
                          {isNew && (
                            <span
                              className="w-2 h-2 rounded-full bg-[#f06a1d] animate-ping"
                              title="Demande récente"
                            />
                          )}
                          <span>{new Date(quote.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="text-[10px] text-white/40">
                          {new Date(quote.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-[#f06a1d] transition-colors">
                          {quote.client_name}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-white/50 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-white/40" />
                            {quote.client_phone}
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-white/40" />
                            {quote.client_email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/90 font-medium">
                          {quote.project_type}
                        </span>
                        <div className="text-[11px] text-white/50 truncate max-w-[220px] mt-1">
                          {quote.project_description}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap text-white">
                        {quote.estimated_amount ? (
                          <span className="text-emerald-400">{formatFCFA(quote.estimated_amount)}</span>
                        ) : (
                          <span className="text-white/40 italic font-sans font-normal">À chiffrer</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white/10 hover:bg-[#f06a1d] text-white text-xs font-semibold transition-colors"
                        >
                          <span>Examiner</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Supabase Connection Modal */}
      {showSupabaseModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowSupabaseModal(false)}
        >
          <div
            className="bg-[#10141d] border border-white/15 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 relative text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase">
                    Connexion Supabase PostgreSQL
                  </h2>
                  <p className="text-white/50 text-xs">
                    Reliez votre base Supabase pour stocker et synchroniser tous les devis.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guide Step 1: SQL table creation */}
            <div className="my-5 p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f06a1d] text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  Créer la table dans Supabase (SQL Editor)
                </span>
                <button
                  onClick={handleCopySql}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#f06a1d] hover:bg-[#ff7828] text-white font-semibold text-[11px] transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Script Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le Script SQL</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-white/60 text-[11px] leading-relaxed">
                Rendez-vous dans votre console Supabase &gt; onglet <strong>SQL Editor</strong> &gt; collez le script copié et cliquez sur <strong>Run</strong>.
              </p>
            </div>

            {/* Guide Step 2: Paste credentials */}
            <div className="my-5 p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f06a1d] text-white flex items-center justify-center text-xs">
                  2
                </span>
                Renseigner vos identifiants Supabase
              </span>
              <p className="text-white/60 text-[11px]">
                Trouvez ces valeurs dans Supabase &gt; <strong>Project Settings &gt; API</strong> :
              </p>

              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="text-white/70 font-semibold block mb-1">
                    Project URL (ex: https://abcxyz.supabase.co)
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-[#161b26] border border-white/15 rounded-md px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#f06a1d]"
                  />
                </div>

                <div>
                  <label className="text-white/70 font-semibold block mb-1">
                    API Key Anon / Public (clé commençant par eyJ...)
                  </label>
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#161b26] border border-white/15 rounded-md px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#f06a1d]"
                  />
                </div>
              </div>
            </div>

            {/* Test connection feedback */}
            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs mb-4 flex items-start gap-2.5 ${
                  testResult.connected && testResult.tableExists
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}
              >
                {testResult.connected && testResult.tableExists ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">
                    {testResult.connected && testResult.tableExists
                      ? 'Connexion réussie avec Supabase !'
                      : 'Attention'}
                  </p>
                  <p className="mt-0.5">{testResult.message}</p>
                </div>
              </div>
            )}

            {/* Push result feedback */}
            {pushResult && (
              <div
                className={`p-3 rounded-lg text-xs mb-4 flex items-start gap-2.5 ${
                  pushResult.includes('RLS') || pushResult.includes('Erreur')
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                }`}
              >
                {pushResult.includes('RLS') || pushResult.includes('Erreur') ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p>{pushResult}</p>
                  {(pushResult.includes('RLS') || pushResult.includes('row-level security')) && (
                    <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between">
                      <span className="text-[11px] text-amber-200">
                        Cliquez sur « Copier le Script SQL » à l'étape 1 ci-dessus, puis collez et exécutez-le dans Supabase SQL Editor.
                      </span>
                      <button
                        onClick={handleCopySql}
                        type="button"
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold rounded"
                      >
                        {copiedSql ? 'Copié !' : 'Copier le SQL correctif'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handlePushAllQuotes}
                disabled={isPushingQuotes || !supabaseConfig.isConfigured}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isPushingQuotes ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transférer les devis ({quotes.length})</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowSupabaseModal(false)}
                  type="button"
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
                >
                  Fermer
                </button>

                <button
                  onClick={handleSaveAndTestSupabase}
                  disabled={isTestingConn}
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  {isTestingConn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Test en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Enregistrer & Tester</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedQuote(null)}
        >
          <div
            className="bg-[#10141d] border border-white/15 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[#f06a1d] text-xs font-black tracking-widest uppercase">
                  Dossier Devis #{selectedQuote.id.slice(0, 8).toUpperCase()}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {selectedQuote.client_name}
                </h2>
                <div className="text-xs text-white/50 mt-0.5">
                  Reçu le {new Date(selectedQuote.created_at).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(selectedQuote.created_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 p-3 bg-white/5 rounded-lg border border-white/10 text-xs">
              <a
                href={`tel:${selectedQuote.client_phone}`}
                className="flex items-center gap-2 text-white/80 hover:text-[#f06a1d] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#f06a1d]" />
                <span className="font-semibold">Appeler : {selectedQuote.client_phone}</span>
              </a>
              <a
                href={`mailto:${selectedQuote.client_email}?subject=Étude de votre projet de ${encodeURIComponent(
                  selectedQuote.project_type
                )} - BÂTIR PRO`}
                className="flex items-center gap-2 text-white/80 hover:text-[#f06a1d] transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-[#f06a1d]" />
                <span className="font-semibold truncate">Écrire : {selectedQuote.client_email}</span>
              </a>
            </div>

            {/* Client Project Description */}
            <div className="space-y-4 my-5 text-xs">
              <div>
                <label className="text-white/50 font-bold uppercase tracking-wider block mb-1">
                  Type de travaux demandés
                </label>
                <div className="px-3 py-2 bg-[#161b26] rounded-md border border-white/10 text-white font-medium">
                  {selectedQuote.project_type}
                </div>
              </div>

              <div>
                <label className="text-white/50 font-bold uppercase tracking-wider block mb-1">
                  Description détaillée du besoin client
                </label>
                <div className="p-3 bg-[#161b26] rounded-md border border-white/10 text-white/90 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {selectedQuote.project_description}
                </div>
              </div>

              {/* Management Form */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status selector */}
                <div>
                  <label className="text-white/70 font-bold uppercase tracking-wider block mb-1">
                    Statut du dossier
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as QuoteStatus)}
                    className="w-full bg-[#161b26] border border-white/15 rounded-md px-3 py-2 text-white text-xs focus:outline-none focus:border-[#f06a1d]"
                  >
                    <option value="pending">En attente (Nouvelle demande)</option>
                    <option value="in_review">En cours d’étude (Métré / Calcul)</option>
                    <option value="quoted">Devis chiffré (Offre envoyée)</option>
                    <option value="accepted">Accepté / Signé (Prêt démarrage)</option>
                    <option value="rejected">Non retenu</option>
                  </select>
                </div>

                {/* Estimated amount */}
                <div>
                  <label className="text-white/70 font-bold uppercase tracking-wider block mb-1">
                    Montant chiffré estimé (FCFA)
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="Ex: 45000000"
                    className="w-full bg-[#161b26] border border-white/15 rounded-md px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#f06a1d]"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="text-white/70 font-bold uppercase tracking-wider block mb-1">
                  Notes internes du bureau d'études
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Indiquez ici les détails techniques, avancée du métré, date de relance..."
                  className="w-full bg-[#161b26] border border-white/15 rounded-md p-3 text-white text-xs focus:outline-none focus:border-[#f06a1d]"
                />
              </div>

              {/* Quote PDF file link */}
              <div>
                <label className="text-white/70 font-bold uppercase tracking-wider block mb-1">
                  Lien vers le devis chiffré / document PDF (optionnel)
                </label>
                <input
                  type="url"
                  value={editFileUrl}
                  onChange={(e) => setEditFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#161b26] border border-white/15 rounded-md px-3 py-2 text-white text-xs focus:outline-none focus:border-[#f06a1d]"
                />
              </div>
            </div>

            {/* Save Feedback message */}
            {saveFeedback && (
              <div
                className={`p-3 rounded-md text-xs mb-4 flex items-center gap-2 ${
                  saveFeedback.success
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}
              >
                {saveFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{saveFeedback.message}</span>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              {deleteConfirmId === selectedQuote.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 text-xs font-semibold">Confirmer suppression ?</span>
                  <button
                    onClick={() => handleDeleteQuote(selectedQuote.id)}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded"
                  >
                    Oui, supprimer
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-1 bg-white/10 text-white text-xs rounded"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(selectedQuote.id)}
                  type="button"
                  className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs transition-colors py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer ce devis</span>
                </button>
              )}

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedQuote(null)}
                  type="button"
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                >
                  Fermer
                </button>

                <button
                  onClick={handleSaveQuote}
                  disabled={isSaving}
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
