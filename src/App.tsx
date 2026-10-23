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
import { MaintenancePage } from './components/MaintenancePage';
import { ArrowUp, Wrench } from 'lucide-react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preselectedTourId, setPreselectedTourId] = useState<string>('daimler-haupttour');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('walter_admin_authorized') === 'true';
  });

  // Maintenance mode (defaults to true so site stays in Coming Soon mode initially)
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('walter_maintenance_mode');
    return saved === null ? true : saved !== 'false';
  });

  // Real-time synchronization of maintenance setting from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'general'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data?.maintenanceMode === 'boolean') {
            setMaintenanceMode(data.maintenanceMode);
            localStorage.setItem('walter_maintenance_mode', String(data.maintenanceMode));
          }
        }
      },
      (error) => {
        console.warn('Settings listener error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleToggleMaintenanceMode = async (enabled: boolean) => {
    setMaintenanceMode(enabled);
    localStorage.setItem('walter_maintenance_mode', String(enabled));
    try {
      await setDoc(
        doc(db, 'settings', 'general'),
        {
          maintenanceMode: enabled,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not save maintenance setting to Firestore:', err);
    }
  };

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
      {/* If maintenance mode is active and user is NOT logged in as admin: show Coming Soon page */}
      {maintenanceMode && !isAdminLoggedIn ? (
        <MaintenancePage onOpenAdmin={() => setIsAdminOpen(true)} />
      ) : (
        <>
          {/* Top Banner if Admin is viewing full site while Maintenance Mode is active */}
          {maintenanceMode && isAdminLoggedIn && (
            <div className="bg-amber-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-between sticky top-0 z-50 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>
                  Wartungsmodus ist <strong>AKTIV</strong> (Besucher sehen die Coming-Soon-Seite mit Motorkutsche). Sie befinden sich in der <strong>Admin-Vorschau</strong>.
                </span>
              </div>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-2.5 py-1 rounded bg-amber-700 hover:bg-amber-800 text-white font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                Admin-Bereich öffnen
              </button>
            </div>
          )}

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
        </>
      )}

      {/* Secret Admin Dashboard for Walter Leppert (Always mounted at root so state never resets!) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        maintenanceMode={maintenanceMode}
        onToggleMaintenanceMode={handleToggleMaintenanceMode}
        onAuthChange={(authed) => setIsAdminLoggedIn(authed)}
      />
    </div>
  );
}
