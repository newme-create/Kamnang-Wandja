import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { FIELD_GALLERY } from '../data/content';
import { GalleryItem } from '../types';
import { Eye, HardHat, Camera, Filter, Sparkles, MoveDown } from 'lucide-react';
import { ParallaxImage } from './ParallaxImage';

interface ConstructionInActionSectionProps {
  onImageClick: (item: GalleryItem) => void;
}

export const ConstructionInActionSection: React.FC<ConstructionInActionSectionProps> = ({
  onImageClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('TOUS');

  // Parallax scroll hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // 3 Columns with pronounced multi-speed parallax translations
  const yCol1 = useTransform(smoothProgress, [0, 1], ['-8%', '12%']);
  const yCol2 = useTransform(smoothProgress, [0, 1], ['10%', '-14%']);
  const yCol3 = useTransform(smoothProgress, [0, 1], ['-5%', '10%']);

  const categories = ['TOUS', 'GROS ŒUVRE', 'GÉNIE CIVIL', 'OUVRAGES D’ART', 'VOIRIE & VRD', 'CHARPENTE'];

  const filteredItems = activeFilter === 'TOUS'
    ? FIELD_GALLERY
    : FIELD_GALLERY.filter((item) => item.category === activeFilter);

  // Divide filtered items into 3 columns
  const col1 = filteredItems.filter((_, i) => i % 3 === 0);
  const col2 = filteredItems.filter((_, i) => i % 3 === 1);
  const col3 = filteredItems.filter((_, i) => i % 3 === 2);

  return (
    <section
      id="chantiers"
      ref={containerRef}
      className="relative bg-[#0d1016] text-white py-24 lg:py-32 overflow-hidden border-t border-white/10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#f06a1d]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#f06a1d]/10 border border-[#f06a1d]/20 mb-3">
              <Camera className="w-3.5 h-3.5 text-[#f06a1d]" />
              <span className="text-[#f06a1d] text-xs font-extrabold tracking-[0.2em] uppercase">
                GALERIE PARALLAXE DE TERRAIN
              </span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.08] tracking-tight uppercase">
              CHANTIERS & ENGINS
              <br />
              <span className="text-[#f06a1d]">EN DÉPLACEMENT CONTINU</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-white/70 text-sm sm:text-base max-w-md leading-relaxed text-left md:text-right">
              Chaque image glisse à sa propre vitesse pendant le défilement pour une immersion totale dans nos chantiers.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#f06a1d] font-bold">
              <MoveDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Faites défiler pour voir le mouvement 3D</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none"
        >
          <div className="flex items-center gap-1.5 text-xs text-white/50 mr-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#f06a1d]" />
            <span className="uppercase font-bold tracking-wider">Filtrer:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-shrink-0 ${
                activeFilter === cat
                  ? 'bg-[#f06a1d] text-white shadow-[0_2px_12px_rgba(240,106,29,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* 3-Column Parallax Gallery with Individual Parallax Glides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Column 1 - Translates downwards */}
          <motion.div style={{ y: yCol1 }} className="flex flex-col gap-6 lg:gap-8 will-change-transform">
            {col1.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={idx}
                parallaxOffset={14}
                onClick={() => onImageClick(item)}
              />
            ))}
          </motion.div>

          {/* Column 2 - Translates upwards */}
          <motion.div style={{ y: yCol2 }} className="flex flex-col gap-6 lg:gap-8 md:mt-6 lg:mt-0 will-change-transform">
            {col2.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={idx + 3}
                parallaxOffset={-14}
                onClick={() => onImageClick(item)}
              />
            ))}
          </motion.div>

          {/* Column 3 - Translates downwards */}
          <motion.div style={{ y: yCol3 }} className="hidden lg:flex flex-col gap-6 lg:gap-8 will-change-transform">
            {col3.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={idx + 6}
                parallaxOffset={16}
                onClick={() => onImageClick(item)}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom Banner with Live Fleet Counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mt-16 sm:mt-20 p-6 sm:p-8 rounded-lg bg-gradient-to-r from-[#141822] via-[#1a202c] to-[#141822] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-[#f06a1d]/15 border border-[#f06a1d]/30 flex items-center justify-center text-[#f06a1d] flex-shrink-0">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-black text-base sm:text-lg uppercase text-white">
                PARC MATÉRIEL DE DERNIÈRE GÉNÉRATION
              </h4>
              <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                Plus de 60 engins lourds (Liebherr, Caterpillar, Komatsu) inspectés et certifiés hebdomadairement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-center">
              <div className="font-heading text-2xl sm:text-3xl font-black text-[#f06a1d]">100%</div>
              <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Conformité HSE</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="font-heading text-2xl sm:text-3xl font-black text-white">24/7</div>
              <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Supervision</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  parallaxOffset?: number;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, parallaxOffset = 12, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative rounded-lg overflow-hidden bg-[#161a24] border border-white/10 hover:border-[#f06a1d]/60 transition-all duration-300 shadow-xl cursor-pointer"
    >
      {/* Inner Image with Parallax Movement inside its Frame */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ParallaxImage
          src={item.image}
          alt={item.title}
          offset={parallaxOffset}
          containerClassName="w-full h-full"
          className="group-hover:scale-115 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1016] via-black/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity pointer-events-none" />

        {/* Category Pill Top Left */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-extrabold tracking-wider uppercase text-white shadow-md">
            {item.category}
          </span>
        </div>

        {/* Inspection Hover Icon Top Right */}
        <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-[#f06a1d] group-hover:border-[#f06a1d] transition-all duration-200 shadow-lg">
          <Eye className="w-4 h-4" />
        </div>

        {/* Bottom Card Content */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#f06a1d] uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{item.tag}</span>
          </div>
          <h3 className="font-heading font-bold text-sm sm:text-base uppercase text-white leading-snug group-hover:text-[#f06a1d] transition-colors">
            {item.title}
          </h3>
          <p className="text-white/60 text-xs mt-1 truncate">
            {item.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
