import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ToursSection } from './components/ToursSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { GuestbookSection } from './components/GuestbookSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preselectedTourId, setPreselectedTourId] = useState<string>('daimler-haupttour');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check hash for #admin
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Ctrl+Shift+A or Alt+A to open admin
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
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
      <Footer
        onNavigate={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Secret Admin Dashboard for Walter Leppert */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

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
