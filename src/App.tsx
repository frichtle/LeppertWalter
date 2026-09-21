import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ToursSection } from './components/ToursSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { GuestbookSection } from './components/GuestbookSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preselectedTourId, setPreselectedTourId] = useState<string>('daimler-haupttour');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['home', 'tours', 'about', 'impressionen', 'guestbook', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId) || (sectionId === 'impressionen' ? document.getElementById('gallery') : null);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (tourId?: string) => {
    if (tourId) {
      setPreselectedTourId(tourId);
    }
    scrollToSection('contact');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={scrollToSection}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Startseite */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onExploreTours={() => scrollToSection('tours')}
          onOpenGuestbook={() => scrollToSection('guestbook')}
        />

        {/* 2. Führungen & Stationen */}
        <ToursSection
          onSelectTourForBooking={(tourId) => handleOpenBooking(tourId)}
        />

        {/* 3. Über Walter Leppert */}
        <AboutSection
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 4. Impressionen */}
        <GallerySection />

        {/* 5. Gästebuch (110 Original-Bewertungen) */}
        <GuestbookSection />

        {/* 6. Kontakt & Anfrage */}
        <ContactSection
          preselectedTourId={preselectedTourId}
        />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Minimal Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-white text-slate-700 hover:text-blue-600 hover:border-blue-300 border border-slate-200 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center animate-in fade-in"
          aria-label="Nach oben"
          title="Nach oben scrollen"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
