import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, ArrowDown, ShieldCheck, HardHat, Sparkles, Building2 } from 'lucide-react';

interface HeroSectionProps {
  onDiscoverProjects: () => void;
  onViewServices: () => void;
  onScrollDown: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onDiscoverProjects,
  onViewServices,
  onScrollDown,
}) => {
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll hooks
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Parallax transforms: background moves down slowly and zooms slightly
  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '35%']);
  const backgroundScale = useTransform(smoothProgress, [0, 1], [1.02, 1.2]);
  const contentY = useTransform(smoothProgress, [0, 1], ['0%', '20%']);
  const contentOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0.1]);

  // Right-side floating image card parallax movements
  const card1Y = useTransform(smoothProgress, [0, 1], ['0%', '-45%']);
  const card2Y = useTransform(smoothProgress, [0, 1], ['0%', '-25%']);

  return (
    <section
      id="accueil"
      ref={heroRef}
      className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-between pt-28 pb-16 overflow-hidden bg-[#090b0e]"
    >
      {/* Background Image with Sunset Cranes & Dynamic Parallax Motion */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 z-0 origin-center pointer-events-none will-change-transform"
      >
        <img
          src="https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=2200&auto=format&fit=crop"
          alt="Chantier de construction BÂTIR PRO au coucher du soleil"
          className="w-full h-full object-cover object-center"
        />
        {/* Layered Overlays for depth and text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b0e]/95 via-[#090b0e]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-[#090b0e]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#f06a1d]/20 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 sm:pt-14 pb-8">
          {/* Main Display Column */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="lg:col-span-7"
          >
            {/* Tagline category with animated fade & slide */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#f06a1d] animate-pulse" />
              <span className="text-[#f06a1d] text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase">
                BTP • GÉNIE CIVIL • CONSTRUCTION
              </span>
            </motion.div>

            {/* Main Display Headline with staggered word reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] text-white tracking-tight uppercase mb-6 sm:mb-8"
            >
              CONSTRUIRE
              <br />
              AUJOURD'HUI
              <br />
              <span className="text-[#f06a1d] drop-shadow-[0_0_25px_rgba(240,106,29,0.35)]">L'AVENIR</span> DE DEMAIN
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/85 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl mb-8 sm:mb-10 text-justify sm:text-left"
            >
              BÂTIR PRO accompagne les acteurs publics et privés dans la réalisation de projets durables, innovants et à fort impact territorial.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4 sm:gap-5"
            >
              <button
                onClick={onDiscoverProjects}
                type="button"
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm bg-[#f06a1d] hover:bg-[#ff7828] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_6px_25px_rgba(240,106,29,0.4)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>DÉCOUVRIR NOS RÉALISATIONS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewServices}
                type="button"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm bg-black/40 hover:bg-white/10 active:scale-[0.98] border border-white/40 hover:border-white text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white backdrop-blur-sm"
              >
                <span>NOS SERVICES</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Dynamic Floating Parallax Visual Cards */}
          <div className="hidden lg:flex lg:col-span-5 relative h-[420px] flex-col justify-center items-end">
            {/* Floating Card 1: Featured Project Bridge with live parallax */}
            <motion.div
              style={{ y: card1Y }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="w-72 rounded-lg overflow-hidden bg-black/70 backdrop-blur-md border border-white/20 shadow-2xl p-2.5 will-change-transform cursor-pointer hover:border-[#f06a1d] transition-colors"
              onClick={onDiscoverProjects}
            >
              <div className="relative aspect-[16/10] rounded overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=600&auto=format&fit=crop"
                  alt="Pont Wouri"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-[#f06a1d] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  GÉNIE CIVIL
                </div>
              </div>
              <div className="px-1">
                <div className="text-white font-heading font-black text-xs uppercase truncate">
                  PONT SUR LE FLEUVE WOURI
                </div>
                <div className="text-white/60 text-[10px] mt-0.5">320m • Ouvrage haubané</div>
              </div>
            </motion.div>

            {/* Floating Card 2: Metrics & ISO Badge */}
            <motion.div
              style={{ y: card2Y }}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="w-64 -mt-8 mr-8 rounded-lg bg-[#141822]/90 backdrop-blur-md border border-white/20 shadow-2xl p-4 will-change-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#f06a1d]/20 border border-[#f06a1d]/40 flex items-center justify-center text-[#f06a1d]">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-black text-base text-white">120+ CHANTIERS</div>
                  <div className="text-[10px] uppercase font-bold text-white/50">Livrés avec succès</div>
                </div>
              </div>
              <div className="h-px bg-white/10 my-2.5" />
              <div className="flex items-center justify-between text-xs text-[#f06a1d] font-bold">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-white/90">Normes ISO 9001</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-[#f06a1d]" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Right Scroll Down Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex justify-end pt-4 sm:pt-6"
        >
          <button
            onClick={onScrollDown}
            type="button"
            className="group flex items-center gap-3 text-white/75 hover:text-white transition-all cursor-pointer focus:outline-none"
            aria-label="Faire défiler vers le bas"
          >
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] uppercase">
              DÉCOUVRIR LES CHANTIERS
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 group-hover:border-[#f06a1d] group-hover:bg-[#f06a1d]/10 flex items-center justify-center transition-all">
              <ArrowDown className="w-4 h-4 text-white group-hover:text-[#f06a1d] group-hover:translate-y-0.5 transition-transform animate-bounce" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
