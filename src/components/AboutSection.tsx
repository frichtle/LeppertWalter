import React from 'react';
import { Calendar, Quote, MapPin } from 'lucide-react';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Portrait Photo */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src="https://image.jimcdn.com/app/cms/image/transf/dimension=800x1000:format=jpg/path/s320364cb9e655ce0/image/i0ef314b4c8919e8b/version/1466154490/image.jpg"
                alt="Walter Leppert als Gottlieb Daimler im Frack und Zylinder"
                referrerPolicy="no-referrer"
                className="w-full aspect-4/5 object-cover object-top"
              />
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="font-bold text-slate-900 text-lg">Walter Leppert</div>
                <div className="text-xs text-slate-500">Stadtführer & Gottlieb-Daimler-Darsteller in Schorndorf</div>
              </div>
            </div>
          </div>

          {/* Bio Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-blue-600 font-semibold text-xs sm:text-sm tracking-wide uppercase">
                Über Ihren Stadtführer
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Geschichte mit Leidenschaft & Humor
              </h2>
            </div>

            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                Herzlich willkommen in Schorndorf! Mein Name ist <strong>Walter Leppert</strong>. Als heimatverbundener
                Schorndorfer fasziniert mich die Geschichte unserer traditionsreichen Fachwerkstadt und insbesondere
                das Lebenswerk unseres berühmtesten Erfinders: <strong>Gottlieb Daimler</strong> (1834–1900).
              </p>
              <p>
                Bei meinen Rundgängen schlüpfe ich originalgetreu in Frack und Zylinder. Als Gottlieb Daimler nehme
                ich Sie mit auf eine unterhaltsame Zeitreise in das 19. Jahrhundert – von der Bäckerei meines Vaters
                in der Höllgasse über die ersten Lehrjahre bis hin zu den revolutionären Versuchen mit dem leichten
                Schnellläufer-Benzinmotor.
              </p>
              <p>
                Über <em>levents.eu</em> und gemeinsam mit der Stadt Schorndorf durfte ich in den vergangenen Jahren
                bereits hunderte Gruppen, Familien, Firmen und Vereine begeistern. Jede Führung passe ich flexibel an
                Ihre Interessen und Ihr Wunschtempo an.
              </p>
            </div>

            {/* Quote */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-700 italic text-sm leading-relaxed">
              „Geschichte darf kein trockenes Aufsagen von Jahreszahlen sein. Wer Schorndorf besucht, soll den
              Erfindergeist spüren, schmunzeln und mit schönen Erinnerungen nach Hause gehen.“
            </div>

            {/* CTA */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs active:scale-[0.99]"
              >
                <Calendar className="w-4 h-4" />
                <span>Führung mit Walter Leppert anfragen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
