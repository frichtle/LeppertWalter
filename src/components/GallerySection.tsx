import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_GALLERY_ITEMS } from '../data/galleryData';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon, MapPin } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

export const GallerySection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const totalItems = INITIAL_GALLERY_ITEMS.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Paginated items
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPhotos = INITIAL_GALLERY_ITEMS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Lightbox handlers
  const handleOpenLightbox = (indexInCurrentPage: number) => {
    setLightboxIndex(startIndex + indexInCurrentPage);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! + 1) % totalItems));
  }, [lightboxIndex, totalItems]);

  const handlePrevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + totalItems) % totalItems);
  }, [lightboxIndex, totalItems]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNextPhoto, handlePrevPhoto]);

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxIndex]);

  const activePhoto = lightboxIndex !== null ? INITIAL_GALLERY_ITEMS[lightboxIndex] : null;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('impressionen');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="impressionen" className="py-16 sm:py-24 border-b border-slate-200 scroll-mt-20">
      {/* Anchor for backward compatibility with older #gallery links */}
      <span id="gallery" className="sr-only" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <p className="text-blue-600 font-semibold text-xs sm:text-sm tracking-wide uppercase">
              Fotoarchiv & Rundgänge
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Impressionen
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Alle <strong>{totalItems} Originalfotos</strong> von Führungen, Stationen und Besuchergruppen mit Stadtführer Walter Leppert aus dem Fotoarchiv.
            </p>
          </div>

          {/* External Source Reference */}
          <div className="shrink-0">
            <a
              href="https://www.levents.eu/impressionen/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Quelle: levents.eu/impressionen</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Counter & Page Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 py-2.5 border-y border-slate-200">
          <div>
            Zeige Fotos <strong>{startIndex + 1}</strong>–<strong>{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</strong> von <strong>{totalItems}</strong>
          </div>
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <span>Seite {currentPage} von {totalPages}</span>
          </div>
        </div>

        {/* Clean Responsive Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {currentPhotos.map((photo, index) => {
            const globalIndex = startIndex + index + 1;
            return (
              <div
                key={photo.id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all aspect-square"
              >
                <img
                  src={photo.thumbUrl || photo.imageUrl}
                  alt={`Impression #${globalIndex} - Stadtführung Schorndorf`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    if (photo.fallbackUrl && e.currentTarget.src !== photo.fallbackUrl) {
                      e.currentTarget.src = photo.fallbackUrl;
                    }
                  }}
                />
                {/* Minimal Overlay Indicator */}
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-end p-2">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                    #{globalIndex}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lean Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Vorherige Fotos</span>
          </button>

          {/* Page Number Quick Selector */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((pageNum, idx, arr) => {
                const prevNum = arr[idx - 1];
                const showEllipsis = prevNum && pageNum - prevNum > 1;

                return (
                  <React.Fragment key={pageNum}>
                    {showEllipsis && <span className="px-1 text-slate-400 text-xs">…</span>}
                    <button
                      onClick={() => goToPage(pageNum)}
                      className={`w-8 h-8 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                      aria-label={`Seite ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Nächste Fotos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Fullscreen Interactive Lightbox */}
        {activePhoto && lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 select-none"
            onClick={handleCloseLightbox}
          >
            {/* Modal Dialog */}
            <div
              className="relative max-w-5xl w-full max-h-[95vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60 text-slate-300 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-400">Impression #{lightboxIndex + 1}</span>
                  <span className="text-slate-500">von {totalItems}</span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activePhoto.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1 text-xs text-slate-400"
                    title="Originalbild öffnen"
                  >
                    <span>Original anzeigen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={handleCloseLightbox}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Schließen (Esc)"
                    title="Schließen (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Stage with Nav Buttons */}
              <div className="relative flex-1 bg-black flex items-center justify-center p-2 sm:p-4 min-h-[50vh] max-h-[78vh] overflow-hidden">
                <img
                  src={activePhoto.imageUrl}
                  alt={`Impression #${lightboxIndex + 1} - Walter Leppert Stadtführung`}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-full object-contain mx-auto transition-opacity duration-200"
                  onError={(e) => {
                    if (activePhoto.fallbackUrl && e.currentTarget.src !== activePhoto.fallbackUrl) {
                      e.currentTarget.src = activePhoto.fallbackUrl;
                    }
                  }}
                />

                {/* Prev Button */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all cursor-pointer backdrop-blur-xs focus:outline-hidden"
                  aria-label="Vorheriges Bild"
                  title="Vorheriges Bild (Pfeil links)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all cursor-pointer backdrop-blur-xs focus:outline-hidden"
                  aria-label="Nächstes Bild"
                  title="Nächstes Bild (Pfeil rechts)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Footer Bar */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Schorndorf (Remstal) – Gottlieb-Daimler-Führung</span>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  Tipp: Mit Pfeiltasten (← / →) navigieren
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
