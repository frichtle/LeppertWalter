import React, { useState } from 'react';
import { Mail, MapPin, Lock, Calendar, ExternalLink, Send, CheckCircle2, Loader2, X, Phone } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { notifyNewInquiry } from '../services/notificationService';
import comingSoonImage from '../assets/coming-soon-motorkutsche.png';

interface MaintenancePageProps {
  onOpenAdmin: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ onOpenAdmin }) => {
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [groupSize, setGroupSize] = useState('15');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const docRef = doc(collection(db, 'inquiries'));
      await setDoc(docRef, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '',
        tourId: 'daimler-haupttour',
        tourTitle: 'Auf den Spuren von Gottlieb Daimler (Coming-Soon Anfrage)',
        date: date || 'nach Vereinbarung',
        groupSize: groupSize.toString() || '15',
        message: message.trim() || '',
        status: 'new',
        createdAt: serverTimestamp(),
      });

      // Send instant email alert to Walter Leppert
      notifyNewInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        tourTitle: 'Auf den Spuren von Gottlieb Daimler',
        date: date || 'nach Vereinbarung',
        groupSize: groupSize.toString() || '15',
        message: message.trim() || undefined,
      });

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setDate('');
      setMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ee] text-slate-800 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900 font-sans">
      {/* Subtle top heritage bar */}
      <div className="bg-[#2b1f16] text-[#e8dfcf] py-2 px-4 text-center text-xs tracking-wider uppercase border-b border-[#3d2d20]">
        Gottlieb Daimler · Schorndorf · Historische Stadtführungen
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
            src={comingSoonImage}
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
              Wir feilen noch an den letzten Feinheiten unserer neuen Internetpräsenz. Führungen für Vereine, Firmen, Familien und Reisegruppen können Sie jedoch bereits jetzt direkt hier anfragen.
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setShowInquiryModal(true);
                setSubmitted(false);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8c3b1e] hover:bg-[#722e16] text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Calendar className="w-4 h-4" />
              <span>Führung jetzt unverbindlich anfragen</span>
            </button>

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
              E-Mail:{' '}
              <a
                href="mailto:walter.leppert@aol.com"
                className="font-semibold text-slate-700 hover:underline"
              >
                walter.leppert@aol.com
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Booking Modal for Coming Soon page */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-6 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Terminanfrage Stadtführung
                </h3>
                <p className="text-xs text-slate-500">
                  Auf den Spuren von Gottlieb Daimler · Walter Leppert
                </p>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-900 text-base">
                    Anfrage erfolgreich übermittelt!
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Vielen Dank für Ihr Interesse. Ihre Anfrage wurde sicher gespeichert und Walter Leppert hat soeben eine Benachrichtigung erhalten. Er wird sich zeitnah bei Ihnen melden.
                  </p>
                </div>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Fenster schließen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Ihr Name / Ansprechpartner *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z.B. Sabine Müller oder Verein e.V."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8c3b1e]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Ihre E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8c3b1e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Telefonnummer (optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Für Rückfragen"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8c3b1e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Wunschdatum / Zeitraum
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="z.B. Sa. 14. November 14 Uhr"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8c3b1e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Teilnehmerzahl (ca.)
                    </label>
                    <input
                      type="text"
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                      placeholder="z.B. 15 Personen"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8c3b1e]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Ihre Wünsche / Nachricht
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Anlass (z.B. Betriebsausflug, Geburtstag), besondere Wünsche bezüglich Gehbehinderungen, Startzeit..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8c3b1e]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">* Pflichtfelder</span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInquiryModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs cursor-pointer"
                    >
                      Abbrechen
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-[#8c3b1e] hover:bg-[#722e16] disabled:opacity-60 text-white font-medium text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>{isSubmitting ? 'Wird gesendet...' : 'Anfrage absenden'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer with discreet Admin / Preview Link */}
      <footer className="py-6 px-4 border-t border-[#e8dfcf] text-xs text-slate-500 text-center flex flex-col sm:flex-row items-center justify-between max-w-4xl w-full mx-auto gap-3">
        <div>
          &copy; {new Date().getFullYear()} Walter Leppert · Stadtführungen Schorndorf
        </div>

        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1 px-2.5 rounded-lg border border-slate-300/80 hover:bg-white bg-white/50 text-[11px]"
          title="Admin-Login"
        >
          <Lock className="w-3 h-3 text-amber-800" />
          <span>Admin-Login</span>
        </button>
      </footer>
    </div>
  );
};
