import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/content';
import { ServiceItem } from '../types';

interface ServiceModalProps {
  selectedService: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  selectedService,
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  const [activeId, setActiveId] = useState<string>(selectedService ? selectedService.id : SERVICES[0].id);

  // Sync state with selectedService prop if provided
  const currentService = SERVICES.find((s) => s.id === (selectedService?.id || activeId)) || SERVICES[0];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0d1016] border border-white/15 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white animate-scaleUp flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Tabs on Left */}
        <div className="w-full md:w-64 bg-[#141822] p-5 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f06a1d] block mb-4">
            NOS EXPERTISES
          </span>
          <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {SERVICES.map((s) => {
              const isSelected = currentService.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`flex-shrink-0 text-left px-3.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                    isSelected
                      ? 'bg-[#f06a1d] text-white shadow-md'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Detail Body */}
        <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#f06a1d]">
                DÉTAILS DU DOMAINE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                {currentService.title}
              </h3>
            </div>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              {currentService.fullDesc}
            </p>

            <h4 className="font-heading text-xs font-black tracking-wider uppercase text-white/90 mb-3">
              POINTS FORTS & PRESTATIONS ASSOCIÉES
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentService.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded bg-[#181d26] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#f06a1d] flex-shrink-0" />
                  <span className="text-xs text-white/85">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-white/10 hover:bg-white/15 text-xs font-bold uppercase tracking-wider text-white"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenQuote();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#f06a1d] hover:bg-[#ff7828] text-xs font-extrabold uppercase tracking-wider text-white shadow-lg cursor-pointer"
            >
              <span>Demander un devis pour ce service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
