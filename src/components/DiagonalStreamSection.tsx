import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from 'motion/react';
import {
  TrendingUp,
  Building2,
  HardHat,
  Compass,
  Sparkles,
  Eye,
  Play,
  Pause,
  Zap,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { GalleryItem } from '../types';

interface DiagonalStreamSectionProps {
  onImageClick?: (item: GalleryItem) => void;
}

const DIAGONAL_ITEMS_LANE1: GalleryItem[] = [
  {
    id: 'diag-1',
    title: 'Tour d’Affaires Akwa Skyline - R+18',
    category: 'BÂTIMENT & GROS ŒUVRE',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop',
    location: 'Douala - Akwa',
    tag: 'FAÇADE DOUBLE PEAU BREEAM',
  },
  {
    id: 'diag-2',
    title: 'Pont Fluvial Haubané 320m',
    category: 'GÉNIE CIVIL & OUVRAGES D’ART',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1400&auto=format&fit=crop',
    location: 'Franchissement Wouri',
    tag: 'BÉTON PRÉCONTRAINT C50/60',
  },
  {
    id: 'diag-3',
    title: 'Grue à Tour Liebherr 280 EC-H',
    category: 'LEVAGE LOURD',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1400&auto=format&fit=crop',
    location: 'Chantier Tertiaire Central',
    tag: 'CAPACITÉ MAX 12 TONS',
  },
  {
    id: 'diag-4',
    title: 'Échangeur Autoroutier Multi-Niveaux',
    category: 'VOIRIE & TRAVAUX PUBLICS',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop',
    location: 'Rocade Nord - Yaoundé',
    tag: 'RAMPES D’ACCÈS 1.8 KM',
  },
  {
    id: 'diag-5',
    title: 'Supervision & Contrôle Laser 3D',
    category: 'INGÉNIERIE & TOPOGRAPHIE',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop',
    location: 'Port en Eau Profonde Kribi',
    tag: 'STATION TOTALE LEICA',
  },
];

const DIAGONAL_ITEMS_LANE2: GalleryItem[] = [
  {
    id: 'diag-6',
    title: 'Centrale à Béton Ready-Mix B50',
    category: 'INDUSTRIE DU BÉTON',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1400&auto=format&fit=crop',
    location: 'Base Logistique Bassa',
    tag: 'PRODUCTION 120 M³/H',
  },
  {
    id: 'diag-7',
    title: 'Fondations Spéciales & Forage Pieux',
    category: 'GÉOTECHNIQUE',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1400&auto=format&fit=crop',
    location: 'Complexe Hôtelier Littoral',
    tag: 'PIEUX FORÉS PROFONDEUR 32M',
  },
  {
    id: 'diag-8',
    title: 'Hub Logistique Portuaire 45 000 m²',
    category: 'CHARPENTE & STRUCTURE',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400&auto=format&fit=crop',
    location: 'Zone Franche Portuaire',
    tag: 'PORTÉE LIBRE 60 MÈTRES',
  },
  {
    id: 'diag-9',
    title: 'Application Enrobé Chaud Haute Performance',
    category: 'VOIRIE & VRD',
    image: 'https://images.unsplash.com/photo-1584463623578-30129a00a2be?q=80&w=1400&auto=format&fit=crop',
    location: 'Axe Lourd Trans-National',
    tag: 'GUIDAGE LASER VÖGELE',
  },
  {
    id: 'diag-10',
    title: 'Terrassement Massif & Déroctage',
    category: 'GÉNIE CIVIL',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1400&auto=format&fit=crop',
    location: 'Plateforme Industrielle',
    tag: 'BULLDOZER CAT D8T',
  },
];

interface DiagonalTrackProps {
  items: GalleryItem[];
  speedMultiplier: number;
  isPaused: boolean;
  onItemClick?: (item: GalleryItem) => void;
}

// Track that translates cards from Bottom-Left (-X, +Y) to Top-Right (+X, -Y)
const DiagonalTrack: React.FC<DiagonalTrackProps> = ({
  items,
  speedMultiplier,
  isPaused,
  onItemClick,
}) => {
  // Motion value representing progress along the diagonal vector
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });

  const velocityFactor = useTransform(smoothVelocity, [-1500, 1500], [-3, 3], {
    clamp: false,
  });

  // Triplicate list for continuous infinite looping
  const fullList = [...items, ...items, ...items];

  useAnimationFrame((_t, delta) => {
    if (isPaused) return;

    // Base continuous motion from bottom-left to top-right (positive increment)
    let moveBy = 0.045 * speedMultiplier * (delta / 16.66);
    
    // Add scroll velocity response
    const vFactor = velocityFactor.get();
    moveBy += moveBy * Math.abs(vFactor);

    // Increment progress
    const nextVal = (progress.get() + moveBy) % 100;
    progress.set(nextVal);
  });

  // Calculate X and Y coordinates along diagonal axis (Bottom-Left to Top-Right)
  // When progress goes 0 -> 100: X moves left to right (+), Y moves bottom to top (-)
  const translateX = useTransform(progress, [0, 100], ['-33.33%', '0%']);
  const translateY = useTransform(progress, [0, 100], ['15%', '-15%']);

  return (
    <div className="relative overflow-visible whitespace-nowrap select-none py-4">
      <motion.div
        style={{ x: translateX, y: translateY }}
        className="flex gap-6 sm:gap-8 flex-nowrap will-change-transform"
      >
        {fullList.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            onClick={() => onItemClick && onItemClick(item)}
            className="group relative flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] aspect-[16/10] rounded-md overflow-hidden bg-[#10141d] border border-white/15 hover:border-[#f06a1d] shadow-[0_12px_35px_rgba(0,0,0,0.6)] cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(240,106,29,0.25)]"
          >
            {/* Real high-res architectural image with subtle hover zoom */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Industrial gradient shading */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

            {/* Technical grid corner marks */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/40 pointer-events-none" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/40 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/40 pointer-events-none" />

            {/* Top Left Category Badge */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-sm bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-wider uppercase text-[#f06a1d]">
                {item.category}
              </span>
            </div>

            {/* Top Right Inspection Icon */}
            <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-sm bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-[#f06a1d] group-hover:border-[#f06a1d] transition-all duration-200 shadow-lg">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Bottom Card Content */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-[#f06a1d] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{item.tag}</span>
              </div>
              <h4 className="font-heading font-black text-sm sm:text-base uppercase text-white truncate group-hover:text-[#f06a1d] transition-colors leading-snug">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-white/60 text-xs mt-1">
                <span className="truncate">{item.location}</span>
                <span className="text-[10px] text-white/40 font-mono">BÂTIR PRO</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const DiagonalStreamSection: React.FC<DiagonalStreamSectionProps> = ({ onImageClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('TOUS');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
  });

  // Parallax tilt of the entire viewport frame
  const frameY = useTransform(smoothProgress, [0, 1], ['4%', '-4%']);

  const categories = ['TOUS', 'BÂTIMENT', 'GÉNIE CIVIL', 'OUVRAGES D’ART', 'VOIRIE & VRD'];

  const filterLane = (lane: GalleryItem[]) => {
    if (activeFilter === 'TOUS') return lane;
    return lane.filter(
      (item) => item.category.toUpperCase().includes(activeFilter) || item.tag.toUpperCase().includes(activeFilter)
    );
  };

  const lane1Items = filterLane(DIAGONAL_ITEMS_LANE1).length > 0 ? filterLane(DIAGONAL_ITEMS_LANE1) : DIAGONAL_ITEMS_LANE1;
  const lane2Items = filterLane(DIAGONAL_ITEMS_LANE2).length > 0 ? filterLane(DIAGONAL_ITEMS_LANE2) : DIAGONAL_ITEMS_LANE2;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#07090e] text-white py-20 lg:py-28 overflow-hidden border-y border-white/10"
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f06a1d_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#f06a1d]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#f06a1d]/15 border border-[#f06a1d]/30 text-[#f06a1d] text-xs font-black tracking-[0.2em] uppercase mb-3 shadow-md">
              <TrendingUp className="w-4 h-4 text-[#f06a1d]" />
              <span>DÉFILEMENT DIAGONAL DU BAS-GAUCHE VERS LE HAUT-DROIT (↗)</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-[1.08]">
              CHANTIERS & MATÉRIEL
              <br />
              <span className="text-[#f06a1d]">EN DÉFILEMENT CONTINU</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Speed & Pause Interactive Controls */}
            <div className="inline-flex items-center gap-2 bg-[#121622] p-1.5 rounded-md border border-white/15 shadow-lg">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`p-2 rounded text-xs font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPaused ? 'bg-[#f06a1d] text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={isPaused ? 'Reprendre le défilement' : 'Mettre en pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Reprendre' : 'Pause'}</span>
              </button>

              <div className="h-5 w-px bg-white/15" />

              <button
                onClick={() => setSpeed(1)}
                className={`px-2.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                  speed === 1 && !isPaused ? 'bg-white/20 text-[#f06a1d] font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                1x Vitesse
              </button>

              <button
                onClick={() => setSpeed(2)}
                className={`px-2.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                  speed === 2 && !isPaused ? 'bg-[#f06a1d] text-white font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                2x Vitesse
              </button>
            </div>

            {/* Direction Indicator Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#121622] border border-white/15 text-xs text-white/80 font-bold">
              <Compass className="w-4 h-4 text-[#f06a1d] animate-spin" style={{ animationDuration: '10s' }} />
              <span className="font-mono text-[#f06a1d]">VECTEUR [ -X,-Y ➔ +X,+Y ]</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-shrink-0 ${
                activeFilter === cat
                  ? 'bg-[#f06a1d] text-white shadow-[0_2px_12px_rgba(240,106,29,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RECTANGULAR VIEWPORT CONTAINER (Le Rectangle Architectural avec Défilement Diagonal) */}
      <div className="relative max-w-[1500px] mx-auto px-2 sm:px-4">
        <motion.div
          style={{ y: frameY }}
          className="relative rounded-lg overflow-hidden bg-[#0a0d14] border-2 border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 sm:p-6 lg:p-8"
        >
          {/* Top Frame Tech Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-[11px] font-mono text-white/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f06a1d] animate-ping" />
              <span className="text-white font-bold tracking-wider uppercase">
                CADRE RECTANGULAIRE • FLUX CINÉMATIQUE DIAGONAL
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span>AXE: 14.5° DIAGONAL (SW ➔ NE)</span>
              <span>RÉSOLUTION: 4K HDR CIVIL</span>
              <span className="text-[#f06a1d] font-bold">NORME ISO 9001:2015</span>
            </div>
          </div>

          {/* Angled Diagonal Canvas Wrapper (tilted at -4deg for accentuated bottom-left to top-right stream) */}
          <div className="relative overflow-hidden py-4 -my-4 transform -rotate-1 origin-center">
            {/* Lane 1: Bottom-Left to Top-Right */}
            <div className="mb-4 sm:mb-6">
              <DiagonalTrack
                items={lane1Items}
                speedMultiplier={speed}
                isPaused={isPaused}
                onItemClick={onImageClick}
              />
            </div>

            {/* Lane 2: Bottom-Left to Top-Right (with offset speed for staggered parallax depth) */}
            <div>
              <DiagonalTrack
                items={lane2Items}
                speedMultiplier={speed * 1.18}
                isPaused={isPaused}
                onItemClick={onImageClick}
              />
            </div>
          </div>

          {/* Bottom Technical Datum Bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-4 h-4 text-[#f06a1d]" />
                <span className="font-bold uppercase">Contrôle Bureau Veritas</span>
              </div>
              <div className="hidden sm:block text-white/30">•</div>
              <span className="text-white/60">Parc de 60+ engins lourds en rotation continue</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#f06a1d]">
              <span>[ CLIQUEZ SUR UNE IMAGE POUR AGRANDIR ]</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
