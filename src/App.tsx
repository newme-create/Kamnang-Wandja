import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NavigationTrack } from './components/NavigationTrack';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { DiagonalStreamSection } from './components/DiagonalStreamSection';
import { ExpertiseSection } from './components/ExpertiseSection';
import { RealisationSection } from './components/RealisationSection';
import { ConstructionInActionSection } from './components/ConstructionInActionSection';
import { TransformationSection } from './components/TransformationSection';
import { CommitmentSection } from './components/CommitmentSection';
import { NewsSection } from './components/NewsSection';
import { QuickQuoteSection } from './components/QuickQuoteSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ServiceModal } from './components/ServiceModal';
import { NewsModal } from './components/NewsModal';
import { QuoteModal } from './components/QuoteModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { AdminQuoteDashboard } from './components/admin/AdminQuoteDashboard';
import { ThemeProvider } from './lib/theme/ThemeContext';
import { Project, ServiceItem, NewsItem, GalleryItem } from './types';

export function AppContent() {
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isAdminView, setIsAdminView] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null);

  // ScrollSpy to update active milestone indicator on scroll
  useEffect(() => {
    const sectionIds = ['accueil', 'services', 'realisations', 'chantiers', 'a-propos', 'actualites', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionNavigate = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenService = (service: ServiceItem) => {
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const handleViewAllServices = () => {
    setSelectedService(null);
    setServiceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 relative flex flex-col selection:bg-theme-accent selection:text-white">
      {/* Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Top Navbar */}
      <Navbar
        onOpenQuote={() => setQuoteModalOpen(true)}
        activeSection={activeSection}
        onOpenAdmin={() => setIsAdminView(!isAdminView)}
        isAdminView={isAdminView}
      />

      {isAdminView ? (
        <div className="pt-20">
          <AdminQuoteDashboard />
        </div>
      ) : (
        <>
          {/* Left Milestone Navigation Track */}
          <NavigationTrack
            activeSection={activeSection}
            onSectionClick={handleSectionNavigate}
          />

          {/* Main Content Sections with Scroll & Parallax Animations */}
          <main className="flex-grow">
            {/* 01 ACCUEIL - Hero Section with Parallax Background & Staggered Reveal */}
            <HeroSection
              onDiscoverProjects={() => handleSectionNavigate('realisations')}
              onViewServices={() => handleSectionNavigate('services')}
              onScrollDown={() => handleSectionNavigate('services')}
            />

            {/* Stats Milestone Bar with Scroll-Triggered Reveal */}
            <StatsBar />

            {/* Diagonal Rectangular Viewport Stream: Bottom-Left to Top-Right */}
            <DiagonalStreamSection
              onImageClick={(item) => setSelectedGalleryImage(item)}
            />

            {/* 02 SERVICES - Notre Expertise with Interactive Image Switcher */}
            <ExpertiseSection
              onSelectService={handleOpenService}
              onViewAllServices={handleViewAllServices}
            />

            {/* 03 RÉALISATIONS - Nos Réalisations with Multi-Photo Gallery */}
            <RealisationSection
              onSelectProject={(project) => setSelectedProject(project)}
              onViewAllProjects={() => handleSectionNavigate('realisations')}
            />

            {/* 04 CHANTIERS - Photothèque de Terrain & Parallaxe Multi-Colonnes */}
            <ConstructionInActionSection
              onImageClick={(item) => setSelectedGalleryImage(item)}
            />

            {/* Transformation Avant / Après - Interactive Slider */}
            <TransformationSection />

            {/* 05 À PROPOS - Notre Engagement & Parallaxe */}
            <CommitmentSection
              onLearnMore={() => setQuoteModalOpen(true)}
            />

            {/* 06 ACTUALITÉS - Dernières Nouvelles with Scroll Cards */}
            <NewsSection
              onSelectNews={(news) => setSelectedNews(news)}
              onViewAllNews={() => handleSectionNavigate('actualites')}
            />

            {/* 07 CONTACT - Formulaire Devis Rapide */}
            <QuickQuoteSection
              onSuccess={() => {}}
            />
          </main>

          {/* Global Footer */}
          <Footer
            onOpenQuote={() => setQuoteModalOpen(true)}
            onSelectServiceTab={(_tabId) => {
              handleViewAllServices();
            }}
          />
        </>
      )}

      {/* Interactive Modals */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenQuote={() => setQuoteModalOpen(true)}
      />

      <ServiceModal
        isOpen={serviceModalOpen}
        selectedService={selectedService}
        onClose={() => {
          setServiceModalOpen(false);
          setSelectedService(null);
        }}
        onOpenQuote={() => {
          setServiceModalOpen(false);
          setQuoteModalOpen(true);
        }}
      />

      <NewsModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
        onOpenQuote={() => {
          setSelectedNews(null);
          setQuoteModalOpen(true);
        }}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      <ImageLightboxModal
        item={selectedGalleryImage}
        onClose={() => setSelectedGalleryImage(null)}
        onOpenQuote={() => {
          setSelectedGalleryImage(null);
          setQuoteModalOpen(true);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
