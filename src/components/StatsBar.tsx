import React from 'react';
import { motion } from 'motion/react';
import { Award, Building2, Users2, Trophy } from 'lucide-react';
import { STATS } from '../data/content';
import { StatItem } from '../types';

export const StatsBar: React.FC = () => {
  const getIcon = (type: StatItem['iconType']) => {
    switch (type) {
      case 'experience':
        return <Award className="w-9 h-9 text-[#f06a1d] stroke-[1.6]" />;
      case 'projects':
        return <Building2 className="w-9 h-9 text-[#f06a1d] stroke-[1.6]" />;
      case 'experts':
        return <Users2 className="w-9 h-9 text-[#f06a1d] stroke-[1.6]" />;
      case 'satisfaction':
        return <Trophy className="w-9 h-9 text-[#f06a1d] stroke-[1.6]" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      aria-label="Statistiques clés BÂTIR PRO"
      className="relative z-20 bg-[#0d1016] border-y border-white/10 py-10 sm:py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex items-start gap-4 p-2 transition-colors rounded-lg group cursor-default"
            >
              {/* Gold/Orange Line Icon with glow on hover */}
              <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-[#f06a1d]/10 border border-[#f06a1d]/20 group-hover:border-[#f06a1d] group-hover:bg-[#f06a1d]/20 transition-all duration-300 shadow-[0_0_15px_transparent] group-hover:shadow-[0_0_15px_rgba(240,106,29,0.3)]">
                {getIcon(stat.iconType)}
              </div>

              {/* Number and description */}
              <div className="flex flex-col">
                <div className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none mb-1.5 group-hover:text-[#f06a1d] transition-colors">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-[12px] font-extrabold tracking-[0.14em] text-white/90 uppercase mb-1">
                  {stat.label}
                </div>
                <p className="text-[12px] sm:text-[13px] text-white/60 leading-relaxed font-normal">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
