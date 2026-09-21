import React, { useState } from 'react';
import { Mail, MapPin, ExternalLink, X } from 'lucide-react';

interface FooterProps {
  onNavigate: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [legalModalType, setLegalModalType] = useState<'impressum' | 'datenschutz' | null>(null);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Brand */}
          <div className="space-y-3">
            <div className="font-bold text-lg text-white">
              Walter Leppert
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Historische Gottlieb-Daimler-Stadtführungen in Schorndorf.
              Unterhaltsam, fundiert und im originalgetreuen Gewand des 19. Jahrhunderts.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>73614 Schorndorf (Remstal, Baden-Württemberg)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Startseite
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tours')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Führungsangebote & Stationen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Über Walter Leppert
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('impressionen')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Impressionen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guestbook')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Gästebuch (110 Bewertungen)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Kontakt & Anfrage
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Partner */}
          <div className="space-y-2">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              Kontakt & Quellen
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-400">
              <div>
                <span className="block text-xs text-slate-500">Direkte E-Mail:</span>
                <a
                  href="mailto:walter.leppert@aol.com"
                  className="text-blue-400 hover:text-blue-300 hover:underline break-all"
                >
                  walter.leppert@aol.com
                </a>
              </div>

              <div className="pt-2 text-xs space-y-1">
                <a
                  href="https://www.levents.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>levents.eu (Leppert Events)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <br />
                <a
                  href="https://www.schorndorf.de/de/freizeit-tourismus/fuehrungen-erlebnisse/stadtfuehrungen/auf-den-spuren-von-gottlieb-daimler"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Stadt Schorndorf Tourismus</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            &copy; {new Date().getFullYear()} Walter Leppert &middot; Stadtführungen Schorndorf
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLegalModalType('impressum')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Impressum
            </button>
            <span>&middot;</span>
            <button
              onClick={() => setLegalModalType('datenschutz')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </div>

      {/* Impressum & Datenschutz Modal */}
      {legalModalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setLegalModalType(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {legalModalType === 'impressum' ? (
              <div className="space-y-3 text-sm">
                <h3 className="text-xl font-bold">Impressum</h3>
                <p className="text-xs text-slate-500">Angaben gemäß § 5 TMG</p>
                <div className="space-y-1 text-slate-700 text-xs sm:text-sm">
                  <p className="font-semibold">Walter Leppert</p>
                  <p>Stadtführungen Schorndorf & levents.eu</p>
                  <p>73614 Schorndorf, Deutschland</p>
                  <p className="pt-2">
                    <strong>E-Mail:</strong>{' '}
                    <a href="mailto:walter.leppert@aol.com" className="text-blue-600 underline hover:text-blue-800">
                      walter.leppert@aol.com
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <h3 className="text-xl font-bold">Datenschutz</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Diese Website verwendet keine Tracking-Cookies. Anfragen werden direkt über Ihr gewohntes E-Mail-Programm an Walter Leppert (walter.leppert@aol.com) übermittelt.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gästebucheinträge werden lokal im Browser vorgehalten und per E-Mail versendet. Eine Weitergabe an Dritte erfolgt nicht.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLegalModalType(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
