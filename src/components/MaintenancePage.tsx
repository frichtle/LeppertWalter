import React from 'react';
import { Mail, MapPin, Lock, Calendar, ExternalLink } from 'lucide-react';

interface MaintenancePageProps {
  onOpenAdmin: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ onOpenAdmin }) => {
  return (
    <div className="min-h-screen bg-[#faf6ee] text-slate-800 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900 font-sans">
      {/* Subtle top heritage bar */}
      <div className="bg-[#2b1f16] text-[#e8dfcf] py-2 px-4 text-center text-xs tracking-wider uppercase border-b border-[#3d2d20]">
        Gottlieb Daimler · Schorndorf 1834 – 1900 · Historische Stadtführungen
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-2 max-w-xl">
          <p className="text-amber-800 font-semibold text-xs sm:text-sm tracking-widest uppercase">
            Stadtführer Walter Leppert
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#241a12] tracking-tight font-serif">
            Auf den Spuren von Gottlieb Daimler
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1">
            Erleben Sie Schorndorfs Geschichte lebendig, humorvoll und im originalgetreuen Gewand des Automobil-Pioniers.
          </p>
        </div>

        {/* Vintage Illustration Banner */}
        <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl border-4 border-[#e5d8c3] bg-white relative group">
          <img
            src="/assets/aistudio/image_7d9f51b2.png"
            alt="Coming soon - Gottlieb Daimler Motorkutsche 1886"
            className="w-full h-auto object-contain block hover:scale-[1.01] transition-transform duration-500"
          />
        </div>

        {/* Status Note & Contact Box */}
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xs rounded-2xl p-6 sm:p-8 border border-[#e4d7c2] shadow-sm space-y-6 text-center">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsere neue Website entsteht gerade für Sie
            </span>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Wir feilen noch an den letzten Feinheiten unserer neuen Internetpräsenz. Führungen für Vereine, Firmen, Familien und Reisegruppen können Sie jedoch bereits jetzt jederzeit direkt anfragen.
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="mailto:walter.leppert@aol.com?subject=Terminanfrage%20Stadtf%C3%BChrung%20Schorndorf"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8c3b1e] hover:bg-[#722e16] text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Terminanfrage per E-Mail senden</span>
            </a>

            <a
              href="https://www.levents.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>levents.eu besuchen</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Location & Info Footer within Card */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>73614 Schorndorf (Remstal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Führungen nach Absprache</span>
            </div>
            <div>
              E-Mail: <a href="mailto:walter.leppert@aol.com" className="font-semibold text-slate-700 hover:underline">walter.leppert@aol.com</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with discreet Admin / Preview Link */}
      <footer className="py-6 px-4 border-t border-[#e8dfcf] text-xs text-slate-500 text-center flex flex-col sm:flex-row items-center justify-between max-w-4xl w-full mx-auto gap-3">
        <div>
          &copy; {new Date().getFullYear()} Walter Leppert · Stadtführungen Schorndorf
        </div>

        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1 px-2.5 rounded-lg border border-slate-300/80 hover:bg-white bg-white/50 text-[11px]"
          title="Admin-Login & Website-Vorschau"
        >
          <Lock className="w-3 h-3 text-amber-800" />
          <span>Vorschau-Login für Walter Leppert / Admin</span>
        </button>
      </footer>
    </div>
  );
};
