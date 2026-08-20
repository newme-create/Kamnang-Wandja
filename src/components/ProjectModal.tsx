import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Ruler, HardHat, MapPin, Building2, ArrowRight, Image as ImageIcon, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenQuote }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | 'beforeAfter'>('gallery');

  if (!project) return null;

  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
  const activeImage = gallery[selectedPhotoIndex] || project.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-[#0d1016] border border-white/15 rounded-lg max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/75 hover:bg-[#f06a1d] text-white transition-colors cursor-pointer border border-white/20"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View Mode Toggle: Galerie Photos vs Avant/Après */}
        {project.beforeAfter && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-1 p-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                viewMode === 'gallery' ? 'bg-[#f06a1d] text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galerie ({gallery.length})</span>
            </button>
            <button
              onClick={() => setViewMode('beforeAfter')}
              className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                viewMode === 'beforeAfter' ? 'bg-[#f06a1d] text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Avant / Après</span>
            </button>
          </div>
        )}

        {/* Modal Main Visual Frame */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-950 overflow-hidden">
          {viewMode === 'gallery' ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={project.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1016] via-transparent to-transparent opacity-90" />
            </>
          ) : project.beforeAfter ? (
            <div className="grid grid-cols-2 h-full w-full">
              <div className="relative h-full overflow-hidden border-r border-white/20">
                <img
                  src={project.beforeAfter.before}
                  alt="Avant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-2.5 py-1 rounded bg-amber-500/90 text-black text-[10px] font-black uppercase">
                    Avant Travaux
                  </span>
                  <p className="text-xs text-white mt-1 font-semibold">
                    {project.beforeAfter.beforeLabel}
                  </p>
                </div>
              </div>
              <div className="relative h-full overflow-hidden">
                <img
                  src={project.beforeAfter.after}
                  alt="Après"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-2.5 py-1 rounded bg-[#f06a1d] text-white text-[10px] font-black uppercase">
                    Ouvrage Livré
                  </span>
                  <p className="text-xs text-white mt-1 font-semibold">
                    {project.beforeAfter.afterLabel}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Bottom Title Bar */}
          <div className="absolute bottom-4 left-6 right-6 z-20">
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#f06a1d] bg-black/75 px-3 py-1 rounded backdrop-blur-sm border border-white/10">
              {project.category}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black uppercase text-white mt-2">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Thumbnail Gallery Navigation */}
        {viewMode === 'gallery' && gallery.length > 1 && (
          <div className="px-6 py-3 bg-[#121620] border-b border-white/10 flex items-center gap-3 overflow-x-auto">
            <span className="text-[10px] font-extrabold uppercase text-white/50 flex-shrink-0">
              VUES DU PROJET :
            </span>
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative w-16 h-11 rounded overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  selectedPhotoIndex === idx
                    ? 'border-[#f06a1d] scale-105 shadow-[0_0_8px_rgba(240,106,29,0.6)]'
                    : 'border-white/15 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metric Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-md bg-[#161a22] border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 block">Année</span>
              <div className="flex items-center gap-1.5 mt-1 font-heading text-sm font-bold text-white">
                <Calendar className="w-3.5 h-3.5 text-[#f06a1d]" />
                <span>{project.year}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 block">Envergure</span>
              <div className="flex items-center gap-1.5 mt-1 font-heading text-sm font-bold text-white">
                <Ruler className="w-3.5 h-3.5 text-[#f06a1d]" />
                <span>{project.metric}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 block">Localisation</span>
              <div className="flex items-center gap-1.5 mt-1 font-heading text-sm font-bold text-white truncate">
                <MapPin className="w-3.5 h-3.5 text-[#f06a1d] flex-shrink-0" />
                <span className="truncate">{project.location}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 block">Maître d'ouvrage</span>
              <div className="flex items-center gap-1.5 mt-1 font-heading text-sm font-bold text-white truncate">
                <Building2 className="w-3.5 h-3.5 text-[#f06a1d] flex-shrink-0" />
                <span className="truncate">{project.client}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-heading text-xs font-black tracking-wider uppercase text-[#f06a1d] mb-2">
              PRÉSENTATION TECHNIQUE DU PROJET
            </h4>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-white/10 hover:bg-white/15 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
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
              <span>Lancer un projet similaire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
