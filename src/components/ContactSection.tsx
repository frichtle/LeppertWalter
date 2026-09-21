import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { TOUR_PACKAGES } from '../data/toursData';

interface ContactSectionProps {
  preselectedTourId?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedTourId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tourId, setTourId] = useState(preselectedTourId || 'daimler-haupttour');
  const [date, setDate] = useState('');
  const [groupSize, setGroupSize] = useState('15');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (preselectedTourId) {
      setTourId(preselectedTourId);
    }
  }, [preselectedTourId]);

  const selectedTour = TOUR_PACKAGES.find((t) => t.id === tourId) || TOUR_PACKAGES[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const subject = encodeURIComponent(`Anfrage Stadtführung: ${selectedTour.title} - ${name.trim()}`);
    const body = encodeURIComponent(
      `Hallo Herr Leppert,\n\nich möchte eine Stadtführung in Schorndorf anfragen:\n\n` +
      `Führung: ${selectedTour.title}\n` +
      `Wunschdatum: ${date || 'nach Vereinbarung'}\n` +
      `Teilnehmerzahl: ca. ${groupSize} Personen\n\n` +
      `Kontaktdaten:\n` +
      `Name: ${name.trim()}\n` +
      `E-Mail: ${email.trim()}\n` +
      `Telefon: ${phone.trim() || 'k.A.'}\n\n` +
      `Nachricht / Anmerkungen:\n` +
      `${message.trim() || 'Keine zusätzlichen Angaben'}\n\n` +
      `Mit freundlichen Grüßen,\n${name.trim()}`
    );

    window.location.href = `mailto:walter.leppert@aol.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm tracking-wide uppercase">
            Direktkontakt
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kontakt & Terminanfrage
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Fragen Sie unverbindlich Ihren Wunschtermin für eine Führung in Schorndorf an.
            Walter Leppert meldet sich zeitnah bei Ihnen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white space-y-6 shadow-xs">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Walter Leppert</h3>
                <p className="text-xs text-slate-500">Stadtführer & Daimler-Darsteller in Schorndorf</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-slate-500">E-Mail für Anfragen:</div>
                    <a
                      href="mailto:walter.leppert@aol.com"
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      walter.leppert@aol.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-slate-500">Standard-Treffpunkt:</div>
                    <div className="font-medium text-slate-900">
                      Historisches Rathaus am Marktplatz 1<br />
                      73614 Schorndorf (Remstal)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900">Bequeme Anreise:</div>
                <p>
                  S-Bahn S2 ab Stuttgart Hbf direkt bis Schorndorf (nur ca. 5 Minuten Fußweg zum Marktplatz).
                  Parkplätze und Parkhäuser sind rund um die Altstadt ausgeschildert.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Clean Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-5">
              <h3 className="text-xl font-bold text-slate-900">
                Unverbindliche Terminanfrage
              </h3>

              {submitted && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Vielen Dank, {name}!</strong>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Ihr E-Mail-Programm wurde geöffnet, um die Anfrage an <strong>walter.leppert@aol.com</strong> abzusenden.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gewünschte Führung
                  </label>
                  <select
                    value={tourId}
                    onChange={(e) => setTourId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="daimler-haupttour">Auf den Spuren von Gottlieb Daimler (ca. 1,5–2 Std.)</option>
                    <option value="firmen-und-events">Individuelle Gruppen- & Vereinstour (nach Absprache)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Wunschdatum
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teilnehmerzahl (ca.)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                      placeholder="z.B. 15"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ihr Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Vor- und Nachname"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ihre E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ihre@email.de"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefonnummer für Rückfragen (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="z.B. 0170 1234567"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nachricht oder Wünsche (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Haben Sie besondere Wünsche bezüglich Startzeit, Gehbehinderungen oder Anlass?"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">* Pflichtfelder</span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto shadow-xs active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Anfrage absenden</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
