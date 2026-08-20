import React from 'react';
import { motion } from 'motion/react';
import { QuoteForm } from './QuoteForm';
import { PhoneCall, ShieldCheck, Clock, Award } from 'lucide-react';

interface QuickQuoteSectionProps {
  onSuccess?: () => void;
}

export const QuickQuoteSection: React.FC<QuickQuoteSectionProps> = ({ onSuccess }) => {
  return (
    <section id="contact" className="relative bg-[#090b0e] text-white py-16 lg:py-24 overflow-hidden border-t border-white/10">
      {/* Blueprint background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f06a1d_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#f06a1d]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="text-[#f06a1d] text-xs font-black tracking-[0.25em] uppercase block mb-2">
            DEMANDE D'ÉTUDE TECHNIQUE & ESTIMATION
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight uppercase">
            CHIFFREZ VOTRE PROJET <span className="text-[#f06a1d]">EN LIGNE</span>
          </h2>
          <p className="text-white/70 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Bénéficiez d'une étude de prix personnalisée et d'un avant-métré certifié sous 48h ouvrées par notre bureau d'études.
          </p>
        </motion.div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto bg-[#10141d] border border-white/15 rounded-xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
          {/* Production Quote Form */}
          <QuoteForm onSuccess={onSuccess} />

          {/* Bottom Guarantees Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f06a1d]" />
              <span>Réponse garantie sous 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Données confidentielles RLS</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#f06a1d]" />
              <span>Assistance : +237 6 00 00 00 00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
