import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowLeft, Calendar, Ruler, HardHat, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { PROJECTS } from '../data/content';
import { Project } from '../types';

interface RealisationSectionProps {
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
}

export const RealisationSection: React.FC<RealisationSectionProps> = ({
  onSelectProject,
  onViewAllProjects,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageCardY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  const currentProject = PROJECTS[currentIndex];
  const nextIndex = (currentIndex + 1) % PROJECTS.length;
  const nextProject = PROJECTS[nextIndex];

  const currentGallery = currentProject.gallery && currentProject.gallery.length > 0
    ? currentProject.gallery
    : [currentProject.image];

  const currentPhoto = currentGallery[activePhotoIndex] || currentProject.image;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
    setActivePhotoIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));
    setActivePhotoIndex(0);
  };

  return (
    <section
      id="realisations"
      ref={sectionRef}
      className="relative bg-[#090b0e] text-white py-20 lg:py-28 overflow-hidden border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading, Description & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <span className="text-[#f06a1d] text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase block mb-3">
              NOS RÉALISATIONS
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.08] tracking-tight uppercase mb-6">
              DES PROJETS
              <br />
              QUI MARQUENT
              <br />
              LE PAYSAGE
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Découvrez une sélection de nos projets les plus emblématiques, alliant prouesse technique et intégration harmonieuse dans leur environnement.
            </p>

            <div>
              <button
                onClick={onViewAllProjects}
                type="button"
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-sm bg-transparent hover:bg-white/10 border border-white/30 hover:border-white text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d]"
              >
                <span>TOUTES LES RÉALISATIONS</span>
                <ArrowRight className="w-4 h-4 text-[#f06a1d] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Project Showcase Carousel Card with Multi-Image Gallery */}
          <motion.div
            style={{ y: imageCardY }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="relative group">
              {/* Project Main Image Frame */}
              <div
                onClick={() => onSelectProject(currentProject)}
                className="relative rounded-md overflow-hidden bg-neutral-900 aspect-[16/10] shadow-2xl border border-white/10 cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${currentProject.id}-${activePhotoIndex}`}
                    src={currentPhoto}
                    alt={currentProject.title}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover object-center image-zoom"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Project Title Badge Top Left */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <span className="font-heading text-xs sm:text-sm md:text-base font-black tracking-wider uppercase bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded border-l-2 border-[#f06a1d] shadow-lg">
                    {currentProject.title}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/80 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full hover:text-white transition-colors border border-white/10">
                    <span>Fiche complète</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#f06a1d]" />
                  </span>
                </div>

                {/* Project Meta Info Row Bottom Inside Image */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-medium text-white/90">
                  <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded">
                    <HardHat className="w-3.5 h-3.5 text-[#f06a1d]" />
                    <span className="font-bold tracking-wide uppercase">{currentProject.category}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded">
                    <Calendar className="w-3.5 h-3.5 text-[#f06a1d]" />
                    <span>{currentProject.year}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded">
                    <Ruler className="w-3.5 h-3.5 text-[#f06a1d]" />
                    <span>{currentProject.metric}</span>
                  </div>
                </div>
              </div>

              {/* Multi-Photo Thumbnail Bar for Active Project */}
              {currentGallery.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-white/50 mr-1 flex-shrink-0">
                    <ImageIcon className="w-3 h-3 text-[#f06a1d]" />
                    <span>Photos ({currentGallery.length}) :</span>
                  </div>
                  {currentGallery.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setActivePhotoIndex(pIdx)}
                      className={`relative w-14 h-9 rounded overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIndex === pIdx
                          ? 'border-[#f06a1d] scale-105 shadow-[0_0_8px_rgba(240,106,29,0.5)]'
                          : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                      }`}
                      aria-label={`Photo ${pIdx + 1} de ${currentProject.title}`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Carousel Controls, Counter and Next Thumbnail */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
              {/* Counter like 01 / 06 */}
              <div className="flex items-baseline gap-2 font-heading">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-white/40 text-sm font-bold">
                  / {String(PROJECTS.length).padStart(2, '0')}
                </span>
              </div>

              {/* Prev / Next Navigation Arrows and Next Project Peek */}
              <div className="flex items-center gap-4">
                {/* Next Project Peek Thumbnail */}
                <div
                  onClick={handleNext}
                  className="hidden md:flex items-center gap-3 p-1.5 pr-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/10"
                  title={`Suivant: ${nextProject.title}`}
                >
                  <img
                    src={nextProject.image}
                    alt={nextProject.title}
                    className="w-10 h-7 object-cover rounded"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Suivant</span>
                    <span className="text-[11px] font-bold text-white max-w-[120px] truncate">{nextProject.title}</span>
                  </div>
                </div>

                {/* Left & Right Button Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    type="button"
                    className="w-10 h-10 rounded-full border border-white/20 hover:border-[#f06a1d] hover:bg-[#f06a1d]/10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d]"
                    aria-label="Projet précédent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    type="button"
                    className="w-10 h-10 rounded-full border border-white/20 hover:border-[#f06a1d] hover:bg-[#f06a1d]/10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d]"
                    aria-label="Projet suivant"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
