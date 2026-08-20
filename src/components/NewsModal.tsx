import React from 'react';
import { X, Calendar, Clock, Share2, ArrowRight } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsModalProps {
  news: NewsItem | null;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ news, onClose, onOpenQuote }) => {
  if (!news) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0d1016] border border-white/15 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full bg-neutral-900">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1016] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-4 text-xs font-bold text-white/60">
            <span className="text-[#f06a1d] font-extrabold uppercase">{news.category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#f06a1d]" />
              <span>{news.day} {news.monthYear}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{news.readTime}</span>
            </div>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-black uppercase text-white leading-snug">
            {news.title}
          </h3>

          <p className="text-[#f06a1d] text-sm font-semibold italic">
            "{news.subtitle}"
          </p>

          <div className="text-white/80 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
            <p>{news.fullContent}</p>
            <p>
              À travers cette initiative, BÂTIR PRO réaffirme sa position de leader engagé pour le développement durable des infrastructures et l'amélioration continue des conditions de vie des populations locales.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded bg-white/10 hover:bg-white/15 text-xs font-bold uppercase tracking-wider text-white"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenQuote();
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded bg-[#f06a1d] hover:bg-[#ff7828] text-xs font-extrabold uppercase tracking-wider text-white shadow-md cursor-pointer"
            >
              <span>Contacter l'équipe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
