import React from 'react';
import { Calendar, Clock, MapPin, Star, ArrowRight, Check } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreTours: () => void;
  onOpenGuestbook: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreTours,
  onOpenGuestbook,
}) => {
  return (
    <section id="home" className="py-12 sm:py-20 lg:py-24 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase">
                Historische Kostümführungen in Schorndorf
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Auf den Spuren von Gottlieb Daimler
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 font-medium">
                mit Stadtführer Walter Leppert
              </p>
            </div>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Erleben Sie das historische Schorndorf durch die Augen seines berühmtesten Sohnes.
              Stadtführer Walter Leppert schlüpft im originalgetreuen Frack und Zylinder in die Rolle des
              Automobil-Pioniers und führt Sie lebendig, fundiert und mit schwäbischem Humor zu den
              authentischen Schauplätzen von Daimlers Jugend.
            </p>

            {/* Quick Facts List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>ca. 1,5 – 2 Stunden</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Marktplatz Schorndorf</span>
              </div>
              <button
                onClick={onOpenGuestbook}
                className="flex items-center gap-2 hover:text-blue-700 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-medium underline decoration-slate-300">
                  5.0 (110 Gästebucheinträge)
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs active:scale-[0.99]"
              >
                <Calendar className="w-4 h-4" />
                <span>Führung anfragen</span>
              </button>

              <button
                onClick={onExploreTours}
                className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-700 font-medium text-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Führungsangebote & Stationen</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src="https://image.jimcdn.com/app/cms/image/transf/dimension=1200x900:format=jpg/path/s320364cb9e655ce0/image/i777a952fca0ee5ee/version/1469388799/image.jpg"
                alt="Historische Stadtführung mit Walter Leppert in Schorndorf"
                referrerPolicy="no-referrer"
                className="w-full aspect-4/3 sm:aspect-5/4 object-cover"
              />
              <div className="p-3.5 bg-white border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Historische Altstadt Schorndorf & Daimler-Geburtshaus</span>
                <span className="text-blue-700 font-medium">Höllgasse 7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
