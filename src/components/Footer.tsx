import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenQuote: () => void;
  onSelectServiceTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote, onSelectServiceTab }) => {
  return (
    <footer className="bg-[#06080a] text-white border-t border-white/10 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Column 1: Brand & Presentation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex flex-col mb-4">
              <span className="font-heading text-2xl font-black tracking-tight text-white">
                BÂTIR<span className="text-[#f06a1d]">PRO.</span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.24em] text-white/70 uppercase -mt-0.5">
                CONSTRUIRE L'AVENIR
              </span>
            </div>

            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm mb-6">
              Entreprise générale de référence en Afrique centrale, spécialisée dans les ouvrages d’art, les grands travaux d’infrastructure et les ensembles immobiliers durables.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#f06a1d] hover:bg-[#ff7828] text-white text-xs font-extrabold tracking-wider uppercase transition-colors"
              >
                <span>DEMANDER UN DEVIS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-black tracking-[0.18em] uppercase text-white mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href="#accueil" className="hover:text-[#f06a1d] transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#f06a1d] transition-colors">
                  Nos Services
                </a>
              </li>
              <li>
                <a href="#realisations" className="hover:text-[#f06a1d] transition-colors">
                  Réalisations
                </a>
              </li>
              <li>
                <a href="#a-propos" className="hover:text-[#f06a1d] transition-colors">
                  À Propos
                </a>
              </li>
              <li>
                <a href="#actualites" className="hover:text-[#f06a1d] transition-colors">
                  Actualités
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#f06a1d] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Expertises (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-black tracking-[0.18em] uppercase text-white mb-4">
              EXPERTISES
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onSelectServiceTab('construction')}
                  className="hover:text-[#f06a1d] transition-colors text-left"
                >
                  Construction Bâtiment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectServiceTab('genie-civil')}
                  className="hover:text-[#f06a1d] transition-colors text-left"
                >
                  Génie Civil & Ponts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectServiceTab('travaux-publics')}
                  className="hover:text-[#f06a1d] transition-colors text-left"
                >
                  Travaux Publics & VRD
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectServiceTab('renovation')}
                  className="hover:text-[#f06a1d] transition-colors text-left"
                >
                  Rénovation & Structure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectServiceTab('etudes')}
                  className="hover:text-[#f06a1d] transition-colors text-left"
                >
                  Études & Conception BIM
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-black tracking-[0.18em] uppercase text-white mb-4">
              SIÈGE & CONTACT
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#f06a1d] flex-shrink-0 mt-0.5" />
                <span>Boulevard de la Liberté, Akwa, Douala — Cameroun</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#f06a1d] flex-shrink-0" />
                <span>+237 6 12 34 56 78 / +237 2 33 42 00 11</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#f06a1d] flex-shrink-0" />
                <span>contact@batirpro-btp.com</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1 text-white/50">
                <Clock className="w-4 h-4 text-[#f06a1d] flex-shrink-0 mt-0.5" />
                <span>Lun - Ven : 07h30 - 18h00 | Sam : 08h00 - 13h00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} BÂTIR PRO. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="#mentions" className="hover:text-white transition-colors">
              Mentions Légales
            </a>
            <a href="#confidentialite" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </a>
            <span className="text-[#f06a1d] font-bold">Certifié ISO 9001:2015</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
