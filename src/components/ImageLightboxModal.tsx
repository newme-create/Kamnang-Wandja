import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Sparkles, HardHat } from 'lucide-react';
import { GalleryItem } from '../types';

interface ImageLightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onOpenQuote?: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  item,
  onClose,
  onOpenQuote,
}) => {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-[#0d1016] border border-white/20 rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-[#f06a1d] text-white transition-colors cursor-pointer border border-white/20"
              aria-label="Fermer la vue agrandie"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-res Image View */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-950 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1016] via-transparent to-transparent opacity-80" />

              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded bg-[#f06a1d] text-white text-xs font-black tracking-wider uppercase shadow-lg">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Caption & Details Footer */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#f06a1d] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{item.tag}</span>
                </div>
                <h3 className="font-heading font-black text-lg sm:text-xl uppercase text-white">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#f06a1d]" />
                  <span>{item.location}</span>
                </div>
              </div>

              {onOpenQuote && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuote();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#f06a1d] hover:bg-[#ff7828] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <HardHat className="w-4 h-4" />
                  <span>Consulter sur ce type de travaux</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
