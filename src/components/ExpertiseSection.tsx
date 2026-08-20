import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';
import { SERVICES } from '../data/content';
import { ServiceItem } from '../types';

interface ExpertiseSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onViewAllServices: () => void;
}

const SERVICE_IMAGES: Record<string, { image: string; tag: string; caption: string }> = {
  construction: {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    tag: 'BÂTIMENT DURABLE',
    caption: 'Immeubles R+10 et complexes mixtes clé en main',
  },
  'genie-civil': {
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop',
    tag: 'INGÉNIERIE STRUCTURELLE',
    caption: 'Ponts, viaducs et fondations profondes',
  },
  'travaux-publics': {
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
    tag: 'VOIRIE & RÉSEAUX',
    caption: 'Terrassements massifs et autoroutes bitumées',
  },
  renovation: {
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    tag: 'RÉHABILITATION',
    caption: 'Renforcement de structure et surélévation technique',
  },
};

export const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  onSelectService,
  onViewAllServices,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<string>('genie-civil');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Parallax subtle vertical movement on left image
  const imageY = useTransform(smoothProgress, [0, 1], ['-6%', '6%']);
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [0.98, 1.02, 1]);

  const activeImage = SERVICE_IMAGES[hoveredServiceId] || SERVICE_IMAGES['genie-civil'];

  const renderServiceIcon = (type: ServiceItem['iconType']) => {
    switch (type) {
      case 'construction':
        return (
          <svg className="w-11 h-11 text-[#f06a1d]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 4v6M24 10l10 8v24H14V18l10-8z" />
            <path d="M20 22h8M20 28h8M20 34h8" />
            <path d="M8 42h32" />
            <path d="M14 26H8v16M34 26h6v16" />
          </svg>
        );
      case 'genie-civil':
        return (
          <svg className="w-11 h-11 text-[#f06a1d]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 38h36" />
            <path d="M10 38V18l14-6 14 6v20" />
            <path d="M18 38V24h12v14" />
            <path d="M10 24h28" />
            <line x1="24" y1="12" x2="24" y2="24" />
          </svg>
        );
      case 'travaux-publics':
        return (
          <svg className="w-11 h-11 text-[#f06a1d]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 42L20 6h8l8 36" />
            <line x1="24" y1="12" x2="24" y2="18" strokeDasharray="3 3" />
            <line x1="24" y1="24" x2="24" y2="30" strokeDasharray="3 3" />
            <line x1="24" y1="36" x2="24" y2="42" strokeDasharray="3 3" />
            <path d="M6 42h36" />
          </svg>
        );
      case 'renovation':
        return (
          <svg className="w-11 h-11 text-[#f06a1d]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 22l16-14 16 14v18a2 2 0 01-2 2H10a2 2 0 01-2-2V22z" />
            <path d="M18 40V26h12v14" />
            <path d="M34 10l4-4 4 4-4 4-4-4z" fill="#f06a1d" fillOpacity="0.2" />
          </svg>
        );
      default:
        return null;
    }
  };

  const visibleServices = SERVICES.slice(0, 4);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-white text-[#11141a] py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Interactive Parallax Image with Smooth Crossfade */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative group"
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="relative overflow-hidden rounded-md shadow-2xl bg-neutral-100 h-[380px] sm:h-[480px] lg:h-[580px]"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage.image}
                  src={activeImage.image}
                  alt={activeImage.caption}
                  initial={{ opacity: 0.2, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.2, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full object-cover object-center absolute inset-0"
                />
              </AnimatePresence>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Dynamic Image Badge */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#f06a1d] bg-black/75 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{activeImage.tag}</span>
                </span>
                <p className="text-sm font-bold mt-2 text-white/95 leading-snug">
                  {activeImage.caption}
                </p>
                <div className="text-[10px] text-white/60 mt-1">
                  Survolez les services à droite pour changer d'aperçu
                </div>
              </div>
            </motion.div>

            {/* Decorative background block */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#f06a1d]/10 -z-10 rounded-md" />
          </motion.div>

          {/* Right Column: Headings & 2x2 Services Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Section Tag & Headline with Scroll Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="mb-10 lg:mb-12"
            >
              <span className="text-[#f06a1d] text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase block mb-3">
                NOTRE EXPERTISE
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#0e1218] leading-[1.08] tracking-tight uppercase">
                DES SOLUTIONS
                <br />
                POUR TOUS VOS PROJETS
              </h2>
            </motion.div>

            {/* 2x2 Grid of 4 Services */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 mb-12"
            >
              {visibleServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  onMouseEnter={() => setHoveredServiceId(service.id)}
                  onClick={() => onSelectService(service)}
                  className={`group flex flex-col items-start cursor-pointer p-4 -m-4 rounded-lg transition-all duration-200 border ${
                    hoveredServiceId === service.id
                      ? 'bg-neutral-50 border-[#f06a1d]/30 shadow-sm'
                      : 'border-transparent hover:bg-neutral-50'
                  }`}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => e.key === 'Enter' && onSelectService(service)}
                  aria-label={`Détails du service ${service.title}`}
                >
                  <div className="mb-4 text-[#f06a1d] group-hover:scale-110 transition-transform duration-300">
                    {renderServiceIcon(service.iconType)}
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0e1218] tracking-wider uppercase mb-2 group-hover:text-[#f06a1d] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
                    {service.shortDesc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Link: VOIR TOUS NOS SERVICES + */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="flex justify-end pt-4 border-t border-neutral-200"
            >
              <button
                onClick={onViewAllServices}
                type="button"
                className="group inline-flex items-center gap-3 text-xs sm:text-sm font-extrabold tracking-[0.14em] uppercase text-[#0e1218] hover:text-[#f06a1d] transition-colors cursor-pointer focus:outline-none"
              >
                <span>VOIR TOUS NOS SERVICES</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-300 group-hover:border-[#f06a1d] group-hover:bg-[#f06a1d] text-[#0e1218] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
