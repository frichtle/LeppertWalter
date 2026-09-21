import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_GUESTBOOK_ENTRIES } from '../data/guestbookData';
import { GuestbookEntry } from '../types';
import { Star, Search, Send, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const GuestbookSection: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK_ENTRIES);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  // Merge user-added entries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('walter_user_added_guestbook_entries');
      if (saved) {
        const parsed: GuestbookEntry[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userIds = new Set(parsed.map((e) => e.id));
          setEntries([...parsed, ...INITIAL_GUESTBOOK_ENTRIES.filter((e) => !userIds.has(e.id))]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const maxNum = Math.max(...entries.map((e) => e.entryNumber || 0), 115);
    const newEntryNumber = maxNum + 1;

    const newEntry: GuestbookEntry = {
      id: `user-${Date.now()}`,
      entryNumber: newEntryNumber,
      author: name.trim(),
      location: location.trim() || 'Gast in Schorndorf',
      date: new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      rating,
      tourName: 'Auf den Spuren von Gottlieb Daimler',
      text: message.trim(),
      createdAt: Date.now(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);

    try {
      const savedUserEntries = JSON.parse(
        localStorage.getItem('walter_user_added_guestbook_entries') || '[]'
      );
      localStorage.setItem(
        'walter_user_added_guestbook_entries',
        JSON.stringify([newEntry, ...savedUserEntries])
      );
    } catch {
      // ignore
    }

    setSubmittedSuccess(`Vielen Dank, ${name.trim()}! Ihr Eintrag #${newEntryNumber} wurde hinzugefügt.`);
    setShowForm(false);
    setCurrentPage(1);

    // Send email to walter.leppert@aol.com
    const subject = encodeURIComponent(`Neuer Gästebucheintrag #${newEntryNumber} von ${name.trim()}`);
    const body = encodeURIComponent(
      `Hallo Herr Leppert,\n\nneuer Gästebucheintrag auf Ihrer Website:\n\n` +
      `Eintrags-Nr: #${newEntryNumber}\n` +
      `Name: ${name.trim()}\n` +
      `Ort: ${location.trim() || 'k.A.'}\n` +
      `Bewertung: ${rating} von 5 Sternen\n\n` +
      `Nachricht:\n"${message.trim()}"\n\n` +
      `Mit freundlichen Grüßen,\n${name.trim()}`
    );
    window.location.href = `mailto:walter.leppert@aol.com?subject=${subject}&body=${body}`;

    setName('');
    setLocation('');
    setMessage('');
    setRating(5);
  };

  // Filter entries based on search
  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) return entries;
    const q = searchTerm.toLowerCase();
    return entries.filter(
      (e) =>
        e.author.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.text.toLowerCase().includes(q) ||
        (e.entryNumber && `#${e.entryNumber}`.includes(q))
    );
  }, [entries, searchTerm]);

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-blue-600 font-semibold text-xs sm:text-sm tracking-wide uppercase">
              Erfahrungsberichte
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Gästebuch
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Alle <strong>110 Original-Einträge</strong> von{' '}
              <a
                href="https://www.levents.eu/g%C3%A4stebuch/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 font-medium inline-flex items-center gap-1"
              >
                levents.eu/gästebuch
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              seit 2016 – mit 100% 5-Sterne-Bewertungen für Walter Leppert.
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setSubmittedSuccess(null);
            }}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-2 shadow-xs active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>{showForm ? 'Formular schließen' : 'Eintrag schreiben'}</span>
          </button>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bewertung</label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-600 ml-2">({rating} von 5 Sternen)</span>
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
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                Eintrag absenden
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
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < entry.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{entry.date}</span>
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
