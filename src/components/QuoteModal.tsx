import React from 'react';
import { X } from 'lucide-react';
import { QuoteForm } from './QuoteForm';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0d1016] border border-white/15 rounded-lg max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl text-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-[#f06a1d] text-xs font-extrabold tracking-[0.2em] uppercase block mb-1">
            BÂTIR PRO • DIRECTION COMMERCIALE & BUREAU D'ÉTUDES
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase">
            DEMANDE D'ÉTUDE & DEVIS
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Remplissez les spécifications de votre projet pour recevoir un chiffrage quantitatif et estimatif sous 24 à 48h.
          </p>
        </div>

        {/* Production Quote Form with Zod, Supabase & Server Action */}
        <QuoteForm />
      </div>
    </div>
  );
};
