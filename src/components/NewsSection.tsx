import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, ArrowUpRight } from 'lucide-react';
import { NEWS } from '../data/content';
import { NewsItem } from '../types';
import { ParallaxImage } from './ParallaxImage';

interface NewsSectionProps {
  onSelectNews: (news: NewsItem) => void;
  onViewAllNews: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  onSelectNews,
  onViewAllNews,
}) => {
  return (
    <section
      id="actualites"
      className="relative bg-[#090b0e] text-white py-20 lg:py-28 overflow-hidden border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and "VOIR TOUTES LES ACTUALITÉS" Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <span className="text-[#f06a1d] text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase block mb-3">
              ACTUALITÉS & INNOVATIONS
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.08] tracking-tight uppercase">
              DERNIÈRES NOUVELLES
              <br />
              DU SECTEUR
            </h2>
          </div>

          <div>
            <button
              onClick={onViewAllNews}
              type="button"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-sm bg-transparent hover:bg-white/10 border border-white/20 hover:border-white text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d]"
            >
              <span>VOIR TOUTES LES ACTUALITÉS</span>
              <ArrowRight className="w-4 h-4 text-[#f06a1d] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* 3 News Cards Grid with Staggered Scroll Reveal and Parallax Images */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {NEWS.map((item, idx) => (
            <motion.article
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => onSelectNews(item)}
              className="group cursor-pointer flex flex-col bg-[#12151b] rounded-md overflow-hidden border border-white/10 hover:border-[#f06a1d]/60 transition-all duration-300 shadow-xl"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === 'Enter' && onSelectNews(item)}
              aria-label={`Lire l'article: ${item.title}`}
            >
              {/* Card Image with Parallax Movement */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <ParallaxImage
                  src={item.image}
                  alt={item.title}
                  offset={idx % 2 === 0 ? 12 : -12}
                  containerClassName="w-full h-full"
                  className="group-hover:scale-110 transition-transform duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151b] via-transparent to-transparent opacity-75 pointer-events-none" />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white px-2.5 py-1 rounded border border-white/10 z-10">
                  {item.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  {/* Date in bold orange font */}
                  <div className="flex items-center gap-2 text-[#f06a1d] text-xs font-extrabold tracking-[0.16em] uppercase mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {item.day} {item.monthYear}
                    </span>
                  </div>

                  {/* News Title */}
                  <h3 className="font-heading font-black text-base sm:text-lg text-white leading-snug tracking-wide uppercase mb-3 group-hover:text-[#f06a1d] transition-colors">
                    {item.title}
                  </h3>

                  {/* Subtitle / summary */}
                  <p className="text-white/65 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {item.subtitle}
                  </p>
                </div>

                {/* Read more footer link */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/60 group-hover:text-white transition-colors">
                  <span>Lire l'article ({item.readTime})</span>
                  <ArrowUpRight className="w-4 h-4 text-[#f06a1d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
