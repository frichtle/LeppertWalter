import React from 'react';
import { TOUR_PACKAGES, TOUR_STOPS } from '../data/toursData';
import { Clock, MapPin, Users, Check, ArrowRight } from 'lucide-react';

interface ToursSectionProps {
  onSelectTourForBooking: (tourId: string) => void;
}

export const ToursSection: React.FC<ToursSectionProps> = ({ onSelectTourForBooking }) => {
  const mainTour = TOUR_PACKAGES[0]; // Auf den Spuren von Gottlieb Daimler
  const customTour = TOUR_PACKAGES[2]; // Gruppen & Firmen / Individuell

  return (
    <section id="tours" className="py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm tracking-wide uppercase">
            Angebote im Überblick
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Führungen mit Walter Leppert
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Wählen Sie zwischen der beliebten Original-Kostümführung oder einer individuell abgestimmten Tour für Ihre Gruppe.
          </p>
        </div>

        {/* 2 Focused Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Haupttour */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-blue-300 transition-colors">
            <div className="space-y-4">
              <div className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700">
                Die beliebte Original-Kostümführung
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {mainTour.title}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Im historischen Gehrock und Zylinder durch die Geburtsstadt
                </p>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {mainTour.description}
              </p>

              {/* Meta details */}
              <div className="pt-2 space-y-2 text-sm text-slate-700 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Dauer:</strong> {mainTour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Treffpunkt:</strong> Historisches Rathaus (Marktplatz 1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Gruppengröße:</strong> Für kleine & große Gruppen geeignet</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-2 space-y-1.5 text-sm text-slate-600">
                <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Inhalte & Höhepunkte:
                </div>
                {mainTour.features.slice(0, 4).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Pauschal- & Gruppenpreise auf Anfrage</span>
              <button
                onClick={() => onSelectTourForBooking(mainTour.id)}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-[0.99]"
              >
                <span>Führung anfragen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Individuelle Tour */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-300 transition-colors">
            <div className="space-y-4">
              <div className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
                Maßgeschneidert & Flexibel
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {customTour.title}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Für Betriebsausflüge, Vereine, Geburtstage & Jubiläen
                </p>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {customTour.description}
              </p>

              {/* Meta details */}
              <div className="pt-2 space-y-2 text-sm text-slate-700 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Dauer:</strong> {customTour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Treffpunkt:</strong> Wunschort in Schorndorf (z.B. Hotel oder Bahnhof)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Gruppengröße:</strong> Individuell vereinbar</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-2 space-y-1.5 text-sm text-slate-600">
                <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Ihre Vorteile:
                </div>
                {customTour.features.slice(0, 4).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Auf Wunsch mit Einkehr / Sektempfang</span>
              <button
                onClick={() => onSelectTourForBooking(customTour.id)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50/50 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Gruppe anfragen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stationen des Rundgangs: Clean, sequential list */}
        <div className="pt-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">
              Stationen des historischen Rundgangs
            </h3>
            <p className="text-slate-600 text-sm">
              Auf dieser ca. 1,5-stündigen Route durch die Schorndorfer Altstadt erleben Sie die wichtigsten Meilensteine:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOUR_STOPS.map((stop) => (
              <div
                key={stop.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors space-y-2 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {stop.number}
                  </span>
                  <div className="font-bold text-slate-900 text-base leading-snug">
                    {stop.title}
                  </div>
                </div>

                <div className="text-xs text-blue-700 font-medium">
                  {stop.address}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {stop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
