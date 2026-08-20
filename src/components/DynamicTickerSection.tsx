import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from 'motion/react';
import { HardHat, Sparkles, Activity, Eye } from 'lucide-react';
import { GalleryItem } from '../types';

interface DynamicTickerSectionProps {
  onImageClick?: (item: GalleryItem) => void;
}

const TICKER_ITEMS_ROW1: GalleryItem[] = [
  {
    id: 'tk-1',
    title: 'Grue à Tour Liebherr 280 EC-H',
    category: 'GROS ŒUVRE',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1200&auto=format&fit=crop',
    location: 'Douala - Akwa',
    tag: 'LEVAGE LOURD 12T',
  },
  {
    id: 'tk-2',
    title: 'Coulage Radier Béton B50',
    category: 'GÉNIE CIVIL',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    location: 'Yaoundé - Nsimalen',
    tag: 'POMPAGE CONTINU',
  },
  {
    id: 'tk-3',
    title: 'Structure Métallique Pont Fluvial',
    category: 'OUVRAGES D’ART',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop',
    location: 'Pont Wouri',
    tag: 'ACIER HAUTE LIMITE',
  },
  {
    id: 'tk-4',
    title: 'Terrassement Pilonné & Compactage',
    category: 'VOIRIE & VRD',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
    location: 'Axe Lourd Douala - Bafoussam',
    tag: 'CAT D8T EN ACTION',
  },
  {
    id: 'tk-5',
    title: 'Façade Vitrée Double Peau',
    category: 'BÂTIMENT',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    location: 'Centre d’Affaires Bonanjo',
    tag: 'ISOLATION THERMIQUE',
  },
  {
    id: 'tk-6',
    title: 'Supervision & Contrôle Laser',
    category: 'INGÉNIERIE',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    location: 'Chantier Kribi Port',
    tag: 'TOPOGRAPHIE 3D',
  },
];

const TICKER_ITEMS_ROW2: GalleryItem[] = [
  {
    id: 'tk-7',
    title: 'Centrale à Béton Ready-Mix',
    category: 'INDUSTRIE BTP',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    location: 'Zone Industrielle Bassa',
    tag: 'CAPACITÉ 120 M³/H',
  },
  {
    id: 'tk-8',
    title: 'Forage Pieux Profonds 32m',
    category: 'GÉNIE CIVIL',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop',
    location: 'Fondations Tour Akwa',
    tag: 'FOREUSE BAUER BG28',
  },
  {
    id: 'tk-9',
    title: 'Pose de Poutres Précontraintes',
    category: 'OUVRAGES D’ART',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    location: 'Échangeur Autoroutier',
    tag: 'POUTRES 45 TONS',
  },
  {
    id: 'tk-10',
    title: 'Application Enrobé Chaud BBME',
    category: 'VOIRIE & VRD',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop',
    location: 'Rocade Sud Yaoundé',
    tag: 'FINISSEUR VÖGELE',
  },
  {
    id: 'tk-11',
    title: 'Charpente Spatiale Complexe',
    category: 'STRUCTURE',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    location: 'Terminal Logistique',
    tag: 'PORTÉE 60 MÈTRES',
  },
  {
    id: 'tk-12',
    title: 'Inspection Qualité Ultrasons',
    category: 'CONTRÔLE',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    location: 'Laboratoire Essais Matériaux',
    tag: 'CERTIFIÉ BUREAU VERITAS',
  },
];

interface MarqueeRowProps {
  items: GalleryItem[];
  baseVelocity: number;
  onItemClick?: (item: GalleryItem) => void;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, baseVelocity = 1, onItemClick }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Duplicate items 4 times to ensure seamless infinite looping on any screen size
  const fullList = [...items, ...items, ...items, ...items];

  useAnimationFrame((_t, delta) => {
    let moveBy = baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get());
    } else {
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
    }

    baseX.set(baseX.get() + moveBy);
  });

  const directionFactor = useRef<number>(1);
  const x = useTransform(baseX, (v) => `${(v % 25) - 25}%`);

  return (
    <div className="overflow-hidden whitespace-nowrap flex select-none py-3">
      <motion.div style={{ x }} className="flex gap-4 sm:gap-6 flex-nowrap">
        {fullList.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            onClick={() => onItemClick && onItemClick(item)}
            className="group relative flex-shrink-0 w-[280px] sm:w-[360px] md:w-[420px] aspect-[16/10] rounded-lg overflow-hidden bg-[#161a24] border border-white/10 hover:border-[#f06a1d] transition-all duration-300 shadow-xl cursor-pointer"
          >
            {/* Image with zoom effect */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Top Category Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-black tracking-wider uppercase text-[#f06a1d]">
                {item.category}
              </span>
            </div>

            {/* Top Right Inspection Eye */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-[#f06a1d] group-hover:border-[#f06a1d] transition-all duration-200">
              <Eye className="w-4 h-4" />
            </div>

            {/* Bottom Details */}
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-[#f06a1d] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>{item.tag}</span>
              </div>
              <h4 className="font-heading font-black text-sm sm:text-base uppercase text-white truncate group-hover:text-[#f06a1d] transition-colors">
                {item.title}
              </h4>
              <p className="text-white/60 text-xs truncate mt-0.5">{item.location}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const DynamicTickerSection: React.FC<DynamicTickerSectionProps> = ({ onImageClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#06080b] text-white py-16 sm:py-24 overflow-hidden border-y border-white/10"
    >
      {/* Background glow lines */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f06a1d]/30 to-transparent pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#f06a1d]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div style={{ opacity }} className="relative z-10">
        {/* Header Tag */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f06a1d]/15 border border-[#f06a1d]/30 text-[#f06a1d] text-xs font-black tracking-[0.2em] uppercase mb-3 shadow-lg">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>ACTIVITÉ CHANTIERS EN TEMPS RÉEL</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
            NOTRE PARC MATÉRIEL & <span className="text-[#f06a1d]">FLUX DE TRAVAUX</span>
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Les images s’animent en continu et accélèrent dynamiquement selon votre vitesse de défilement.
          </p>
        </div>

        {/* Row 1: Leftward Stream */}
        <div className="mb-2 sm:mb-4">
          <MarqueeRow items={TICKER_ITEMS_ROW1} baseVelocity={-1.4} onItemClick={onImageClick} />
        </div>

        {/* Row 2: Rightward Stream */}
        <div>
          <MarqueeRow items={TICKER_ITEMS_ROW2} baseVelocity={1.2} onItemClick={onImageClick} />
        </div>
      </motion.div>
    </section>
  );
};
