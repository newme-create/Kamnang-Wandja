import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowRight, HardHat } from 'lucide-react';
import { getPendingQuotesCount, QUOTES_UPDATED_EVENT } from '../lib/services/quoteStorage';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  onOpenQuote: () => void;
  activeSection: string;
  onOpenAdmin?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuote,
  activeSection,
  onOpenAdmin,
  isAdminView = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingQuotesCount, setPendingQuotesCount] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial count
    setPendingQuotesCount(getPendingQuotesCount());

    // Listen to real-time quote updates
    const handleQuotesChanged = () => {
      setPendingQuotesCount(getPendingQuotesCount());
    };

    window.addEventListener(QUOTES_UPDATED_EVENT, handleQuotesChanged);
    window.addEventListener('storage', handleQuotesChanged);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener(QUOTES_UPDATED_EVENT, handleQuotesChanged);
      window.removeEventListener('storage', handleQuotesChanged);
    };
  }, []);

  const navLinks = [
    { label: 'ACCUEIL', href: '#accueil', id: 'accueil' },
    { label: 'NOS SERVICES', href: '#services', id: 'services' },
    { label: 'RÉALISATIONS', href: '#realisations', id: 'realisations' },
    { label: 'À PROPOS', href: '#a-propos', id: 'a-propos' },
    { label: 'ACTUALITÉS', href: '#actualites', id: 'actualites' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090b0e]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
            : 'bg-gradient-to-b from-[#090b0e]/90 via-[#090b0e]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#accueil"
            onClick={(e) => handleLinkClick(e, '#accueil')}
            className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d] rounded-sm"
            aria-label="BÂTIR PRO — Accueil"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-white">
                BÂTIR<span className="text-[#f06a1d]">PRO.</span>
              </span>
            </div>
            <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.24em] text-white/70 uppercase group-hover:text-white transition-colors -mt-0.5">
              CONSTRUIRE L'AVENIR
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navigation principale">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-[12.5px] font-bold tracking-[0.08em] transition-all duration-200 py-1 relative ${
                    isActive
                      ? 'text-white'
                      : 'text-white/75 hover:text-white hover:opacity-100'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f06a1d] rounded-full shadow-[0_0_8px_#f06a1d]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions & CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Switcher */}
            <ThemeSwitcher variant="dropdown" />

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                type="button"
                className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer relative ${
                  isAdminView
                    ? 'bg-[#f06a1d] text-white border-[#f06a1d] shadow-lg shadow-[#f06a1d]/30'
                    : 'bg-[#121622] text-white/85 border-white/15 hover:border-[#f06a1d] hover:text-white'
                }`}
                title="Accéder au tableau de bord d'administration des devis"
              >
                <HardHat className="w-3.5 h-3.5 text-white" />
                <span>{isAdminView ? 'Vue Client' : 'Admin Devis'}</span>
                {pendingQuotesCount > 0 && !isAdminView && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#f06a1d] text-white text-[10px] font-black animate-pulse shadow-sm">
                    {pendingQuotesCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenQuote}
              type="button"
              className="relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-sm bg-[#f06a1d] hover:bg-[#ff7828] active:scale-[0.98] text-white text-[11px] sm:text-[13px] font-extrabold tracking-wider uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(240,106,29,0.35)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f06a1d]"
            >
              <span>DEMANDER UN DEVIS</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d]"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 w-[290px] sm:w-[340px] h-full bg-[#0d1016] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl z-50 animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex flex-col">
                  <span className="font-heading text-lg font-black tracking-tight text-white">
                    BÂTIR<span className="text-[#f06a1d]">PRO.</span>
                  </span>
                  <span className="text-[8px] font-bold tracking-[0.2em] text-white/60 uppercase">
                    CONSTRUIRE L'AVENIR
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold tracking-wide transition-all ${
                        isActive
                          ? 'bg-[#f06a1d]/15 text-[#f06a1d] font-extrabold'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-60" />
                    </a>
                  );
                })}
              </nav>

              {/* Mobile Admin Link Toggle */}
              {onOpenAdmin && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      isAdminView
                        ? 'bg-[#f06a1d] text-white border-[#f06a1d]'
                        : 'bg-[#121622] text-white/80 border-white/15 hover:border-[#f06a1d]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-[#f06a1d]" />
                      <span>{isAdminView ? 'Basculer Vue Client' : 'Admin Devis & Chiffrages'}</span>
                    </div>
                    {pendingQuotesCount > 0 && !isAdminView && (
                      <span className="px-2 py-0.5 rounded-full bg-[#f06a1d] text-white text-[10px] font-black animate-pulse">
                        {pendingQuotesCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Mobile Theme Selector */}
              <ThemeSwitcher variant="drawer" className="mt-4 pt-4 border-t border-white/10" />
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 rounded-sm bg-[#f06a1d] hover:bg-[#ff7828] text-white font-extrabold text-sm tracking-wider uppercase text-center shadow-lg cursor-pointer"
              >
                DEMANDER UN DEVIS
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-white/60 pt-2">
                <Phone className="w-3.5 h-3.5 text-[#f06a1d]" />
                <span>+237 6 12 34 56 78</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
