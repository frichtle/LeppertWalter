import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_GUESTBOOK_ENTRIES } from '../data/guestbookData';
import { GuestbookEntry } from '../types';
import { Search, Send, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { notifyNewGuestbookEntry } from '../services/notificationService';

const ITEMS_PER_PAGE = 6;

export const GuestbookSection: React.FC = () => {
  const [firestoreEntries, setFirestoreEntries] = useState<GuestbookEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  // Real-time listener for approved entries in Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'guestbook_entries'),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const approved: GuestbookEntry[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          approved.push({
            id: docSnap.id,
            author: d.author || 'Gast',
            location: d.location || 'Gast in Schorndorf',
            date: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Kürzlich',
            rating: d.rating || 5,
            tourName: d.tourName || 'Auf den Spuren von Gottlieb Daimler',
            text: d.text || '',
            entryNumber: d.entryNumber || undefined,
            status: 'approved',
            createdAt: d.createdAt?.seconds ? d.createdAt.seconds * 1000 : Date.now(),
          });
        });
        approved.sort((a, b) => b.createdAt - a.createdAt);
        setFirestoreEntries(approved);
      },
      (error) => {
        console.warn('Guestbook listener error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Merge Firestore approved entries with the initial archive entries
  const allEntries = useMemo(() => {
    const firestoreIds = new Set(firestoreEntries.map((e) => e.id));
    return [...firestoreEntries, ...INITIAL_GUESTBOOK_ENTRIES.filter((e) => !firestoreIds.has(e.id))];
  }, [firestoreEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const maxNum = Math.max(...allEntries.map((e) => e.entryNumber || 0), 115);
    const newEntryNumber = maxNum + 1;

    try {
      const docRef = doc(collection(db, 'guestbook_entries'));
      await setDoc(docRef, {
        author: name.trim(),
        location: location.trim() || 'Gast in Schorndorf',
        tourName: 'Auf den Spuren von Gottlieb Daimler',
        text: message.trim(),
        status: 'pending',
        entryNumber: newEntryNumber,
        createdAt: serverTimestamp(),
      });

      setSubmittedSuccess(
        `Vielen Dank, ${name.trim()}! Ihr Eintrag #${newEntryNumber} wurde eingereicht und wird nach kurzer Prüfung durch Walter Leppert freigeschaltet.`
      );
      setShowForm(false);

      // Send instant email notification to Walter Leppert
      notifyNewGuestbookEntry({
        author: name.trim(),
        location: location.trim() || 'Gast in Schorndorf',
        tourName: 'Auf den Spuren von Gottlieb Daimler',
        text: message.trim(),
        entryNumber: newEntryNumber,
      });

      setName('');
      setLocation('');
      setMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'guestbook_entries');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter entries based on search
  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) return allEntries;
    const q = searchTerm.toLowerCase();
    return allEntries.filter(
      (e) =>
        e.author.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.text.toLowerCase().includes(q) ||
        (e.entryNumber && `#${e.entryNumber}`.includes(q))
    );
  }, [allEntries, searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE) || 1;
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  return (
    <section id="guestbook" className="py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm tracking-wide uppercase">
            Erfahrungsberichte
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Gästebuch
          </h2>
          <div className="pt-1">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSubmittedSuccess(null);
              }}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{showForm ? 'Formular schließen' : 'Eintrag schreiben'}</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {submittedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{submittedSuccess}</span>
          </div>
        )}

        {/* Minimal Add Entry Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-4 text-sm"
          >
            <div className="font-bold text-slate-900 text-xl">
              Neuen Gästebucheintrag verfassen
            </div>
            <p className="text-slate-600 text-xs">
              Ihr Feedback wird im Gästebuch gespeichert und per E-Mail an Walter Leppert gesendet.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ihr Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Familie Müller"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Herkunftsort / Verein</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="z.B. Stuttgart"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ihre Nachricht / Feedback *</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Wie hat Ihnen die Führung gefallen?"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSubmitting ? 'Wird gespeichert...' : 'Eintrag absenden'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Minimal Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Gästebuch durchsuchen (Name, Ort, Text)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="text-xs text-slate-500 self-start sm:self-center font-medium">
            {filteredEntries.length} Einträge gefunden
          </div>
        </div>

        {/* Cards Grid: 6 per page */}
        {filteredEntries.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-300 rounded-xl">
            Keine Einträge für „{searchTerm}“ gefunden.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-3 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-600 truncate">{entry.tourName}</span>
                    <span className="shrink-0 ml-2">{entry.date}</span>
                  </div>

                  <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                    „{entry.text}“
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">
                      {entry.author}
                    </span>
                    <span className="text-slate-500 block truncate">{entry.location}</span>
                  </div>
                  {entry.entryNumber && (
                    <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0 ml-2">
                      #{entry.entryNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div>
              Seite <span className="font-semibold text-slate-900">{currentPage}</span> von{' '}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Vorherige</span>
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span>Nächste</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
