import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ShieldCheck, HardHat, Leaf, ArrowRight, CheckCircle2, Award, Zap } from 'lucide-react';
import { ParallaxImage } from './ParallaxImage';

interface CommitmentSectionProps {
  onLearnMore: () => void;
}

export const CommitmentSection: React.FC<CommitmentSectionProps> = ({ onLearnMore }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  const badgeY1 = useTransform(smoothProgress, [0, 1], ['25%', '-25%']);
  const badgeY2 = useTransform(smoothProgress, [0, 1], ['-20%', '30%']);

  return (
    <section
      id="a-propos"
      ref={sectionRef}
      className="relative bg-white text-[#11141a] py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Engineers On Active Construction Site with Parallax Motion */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative overflow-hidden rounded-md shadow-2xl bg-neutral-100 h-[420px] sm:h-[520px] lg:h-[600px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
                alt="Ingénieurs et chefs de chantier BÂTIR PRO sur site avec casques et plans"
                offset={15}
                containerClassName="w-full h-full"
                className="group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-85 group-hover:opacity-65 transition-opacity pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#f06a1d] bg-black/80 px-2.5 py-1 rounded backdrop-blur-sm border border-white/15">
                  ENGAGEMENT TERRAIN
                </span>
                <p className="text-sm sm:text-base font-bold mt-2 text-white/95 leading-snug">
                  Supervision rigoureuse et présence continue sur chaque chantier
                </p>
              </div>

              {/* Floating Dynamic ISO Tag 1 */}
              <motion.div
                style={{ y: badgeY1 }}
                className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-2 rounded border border-white/20 text-white flex items-center gap-2 text-xs font-bold shadow-xl will-change-transform z-10"
              >
                <CheckCircle2 className="w-4 h-4 text-[#f06a1d]" />
                <span>ISO 9001 & 14001</span>
              </motion.div>

              {/* Floating Dynamic Badge 2 (Bottom Left Floating) */}
              <motion.div
                style={{ y: badgeY2 }}
                className="absolute top-28 left-4 bg-[#141822]/90 backdrop-blur-md px-3.5 py-2.5 rounded border border-[#f06a1d]/40 text-white flex items-center gap-2.5 text-xs font-black shadow-2xl will-change-transform z-10"
              >
                <Award className="w-4 h-4 text-[#f06a1d]" />
                <div>
                  <div className="text-[10px] text-white/60 uppercase font-bold">Label Excellence</div>
                  <div className="text-xs font-black text-[#f06a1d]">ZÉRO ACCIDENT</div>
                </div>
              </motion.div>
            </div>

            {/* Decorative background box */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#f06a1d]/10 -z-10 rounded-md" />
          </motion.div>

          {/* Right Column: Commitment Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="mb-8 sm:mb-10"
            >
              <span className="text-[#f06a1d] text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase block mb-3">
                NOTRE ENGAGEMENT
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#0e1218] leading-[1.08] tracking-tight uppercase mb-6">
                LA QUALITÉ
                <br />
                COMME FONDATION
              </h2>
              <p className="text-neutral-700 text-sm sm:text-base leading-relaxed max-w-xl">
                Chaque projet est pour nous l'opportunité de démontrer notre savoir-faire, dans le respect strict des normes de sécurité, des délais et des engagements environnementaux.
              </p>
            </motion.div>

            {/* 3 Pillars List with staggered reveal */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12 },
                },
              }}
              className="space-y-6 sm:space-y-7 mb-10"
            >
              {/* Pillar 1: QUALITÉ */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-shrink-0 p-3 rounded-md bg-[#f06a1d]/10 text-[#f06a1d] mt-1">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0e1218] tracking-wide uppercase mb-1">
                    QUALITÉ
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    Des matériaux sélectionnés et un contrôle rigoureux à chaque étape du chantier.
                  </p>
                </div>
              </motion.div>

              {/* Pillar 2: SÉCURITÉ */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-shrink-0 p-3 rounded-md bg-[#f06a1d]/10 text-[#f06a1d] mt-1">
                  <HardHat className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0e1218] tracking-wide uppercase mb-1">
                    SÉCURITÉ
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    La sécurité de nos équipes et des riverains est notre priorité absolue.
                  </p>
                </div>
              </motion.div>

              {/* Pillar 3: DURABILITÉ */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-shrink-0 p-3 rounded-md bg-[#f06a1d]/10 text-[#f06a1d] mt-1">
                  <Leaf className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0e1218] tracking-wide uppercase mb-1">
                    DURABILITÉ
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    Une approche responsable favorisant l'efficacité énergétique et la durabilité.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Action CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={onLearnMore}
                type="button"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm bg-[#0e1218] hover:bg-[#1a202c] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d]"
              >
                <span>EN SAVOIR PLUS SUR NOTRE DÉMARCHE</span>
                <ArrowRight className="w-4 h-4 text-[#f06a1d] group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
