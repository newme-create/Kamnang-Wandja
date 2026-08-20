import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeftRight, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const TransformationSection: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activePreset, setActivePreset] = useState<'bridge' | 'tower'>('bridge');

  const presets = {
    bridge: {
      title: 'FRANCHISSEMENT FLUVIAL & OUVRAGE D’ART',
      location: 'Douala, Cameroun • Pont Wouri',
      beforeImg: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1600&auto=format&fit=crop',
      beforeTitle: 'PHASE 1 : TERRASSEMENT & PIEUX FORÉS',
      afterImg: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1600&auto=format&fit=crop',
      afterTitle: 'LIVRAISON : PONT À HAUBANS ÉCLAIRÉ',
      specs: [
        { label: 'Durée chantier', val: '24 mois' },
        { label: 'Béton haute perf.', val: '14 000 m³' },
        { label: 'Sécurité zéro accident', val: '100%' },
      ],
    },
    tower: {
      title: 'TOUR TERTIAIRE R+18 & COMPLEXE SKYLINE',
      location: 'Douala - Akwa • Bâtiment Durable',
      beforeImg: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1600&auto=format&fit=crop',
      beforeTitle: 'PHASE 1 : RADIER BÉTON & GRUES À TOUR',
      afterImg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
      afterTitle: 'LIVRAISON : FAÇADE DOUBLE PEAU BREEAM',
      specs: [
        { label: 'Surface construite', val: '24 000 m²' },
        { label: 'Étages', val: '18 Niveaux' },
        { label: 'Certification', val: 'BREEAM' },
      ],
    },
  };

  const current = presets[activePreset];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="relative bg-[#090b0e] text-white py-24 lg:py-28 overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#f06a1d]/10 border border-[#f06a1d]/20 mb-3">
            <Layers className="w-3.5 h-3.5 text-[#f06a1d]" />
            <span className="text-[#f06a1d] text-xs font-extrabold tracking-[0.2em] uppercase">
              TRANSFORMATION VISUELLE
            </span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight uppercase">
            AVANT / APRÈS : <span className="text-[#f06a1d]">LA MÉTAMORPHOSE</span>
          </h2>
          <p className="text-white/70 text-sm sm:text-base mt-3">
            Glissez le curseur pour observer le passage du terrain brut aux chefs-d'œuvre architecturaux livrés.
          </p>

          {/* Project Preset Selector */}
          <div className="inline-flex p-1 rounded-md bg-white/5 border border-white/10 mt-6">
            <button
              onClick={() => setActivePreset('bridge')}
              className={`px-4 py-2 rounded text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activePreset === 'bridge'
                  ? 'bg-[#f06a1d] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Pont & Génie Civil
            </button>
            <button
              onClick={() => setActivePreset('tower')}
              className={`px-4 py-2 rounded text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activePreset === 'tower'
                  ? 'bg-[#f06a1d] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Tour Akwa Skyline
            </button>
          </div>
        </motion.div>

        {/* Interactive Comparison Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto rounded-lg overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl select-none"
        >
          {/* Comparison Container */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full cursor-ew-resize overflow-hidden"
          >
            {/* After Image (Full background) */}
            <img
              src={current.afterImg}
              alt={current.afterTitle}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={current.beforeImg}
                alt={current.beforeTitle}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Drag Handle Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(240,106,29,0.8)] pointer-events-none -translate-x-1/2 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-[#f06a1d] text-white border-2 border-white shadow-2xl flex items-center justify-center pointer-events-auto">
                <ArrowLeftRight className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Left Tag: AVANT */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="px-3 py-1.5 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-extrabold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                <span>◀ AVANT : TRAVAUX</span>
              </span>
            </div>

            {/* Right Tag: APRÈS */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              <span className="px-3 py-1.5 rounded bg-[#f06a1d]/90 backdrop-blur-md border border-white/20 text-[11px] font-extrabold tracking-wider uppercase text-white flex items-center gap-1.5 shadow-lg">
                <span>APRÈS : LIVRÉ ▶</span>
              </span>
            </div>

            {/* Bottom Caption Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded border border-white/10">
                <h4 className="font-heading font-extrabold text-sm uppercase text-white">
                  {current.title}
                </h4>
                <p className="text-xs text-white/70">{current.location}</p>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-2 rounded border border-white/10 text-xs text-white/75">
                <Sparkles className="w-4 h-4 text-[#f06a1d]" />
                <span>Faites glisser pour comparer</span>
              </div>
            </div>
          </div>

          {/* Specs Footer Under Slider */}
          <div className="p-4 sm:p-6 bg-[#12151d] border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {current.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#f06a1d] flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-white/50">{spec.label}</div>
                  <div className="font-heading font-black text-sm text-white">{spec.val}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
