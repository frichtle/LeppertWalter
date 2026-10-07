import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  CheckCircle2,
  Trash2,
  Mail,
  Calendar,
  Users,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Upload,
  RefreshCw,
  ExternalLink,
  Phone,
} from 'lucide-react';
import {
  auth,
  db,
  loginWithGoogle,
  logoutUser,
  isUserAdmin,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { InquiryItem, GuestbookEntry, GalleryItem } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pinAuthorized, setPinAuthorized] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'guestbook' | 'inquiries' | 'gallery'>('guestbook');

  // Brute force protection states
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    return parseInt(localStorage.getItem('walter_admin_failed_attempts') || '0', 10);
  });
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    return parseInt(localStorage.getItem('walter_admin_lockout_until') || '0', 10);
  });
  const [remainingLockSeconds, setRemainingLockSeconds] = useState<number>(0);

  // Countdown timer for lockout
  useEffect(() => {
    const checkLockout = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        setRemainingLockSeconds(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setRemainingLockSeconds(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Firestore Data
  const [guestbookItems, setGuestbookItems] = useState<GuestbookEntry[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [customGalleryItems, setCustomGalleryItems] = useState<GalleryItem[]>([]);

  // Add Photo Form State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState('Führungen');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoYear, setPhotoYear] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isAuthorized = isUserAdmin(currentUser) || pinAuthorized;

  // Realtime Listeners for Admin Data
  useEffect(() => {
    if (!isOpen || !isAuthorized) return;

    // 1. Guestbook entries
    const gbQuery = query(collection(db, 'guestbook_entries'));
    const unsubGb = onSnapshot(
      gbQuery,
      (snapshot) => {
        const items: GuestbookEntry[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            author: d.author || 'Gast',
            location: d.location || '',
            date: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString('de-DE') : 'Aktuell',
            rating: d.rating || 5,
            tourName: d.tourName || 'Stadtführung',
            text: d.text || '',
            entryNumber: d.entryNumber || 0,
            status: d.status || 'pending',
            createdAt: d.createdAt?.seconds ? d.createdAt.seconds * 1000 : Date.now(),
          });
        });
        items.sort((a, b) => b.createdAt - a.createdAt);
        setGuestbookItems(items);
      },
      (error) => {
        console.warn('Guestbook fetch error:', error);
      }
    );

    // 2. Inquiries
    const inqQuery = query(collection(db, 'inquiries'));
    const unsubInq = onSnapshot(
      inqQuery,
      (snapshot) => {
        const items: InquiryItem[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            name: d.name || '',
            email: d.email || '',
            phone: d.phone || '',
            tourId: d.tourId || '',
            tourTitle: d.tourTitle || 'Führung',
            date: d.date || '',
            groupSize: d.groupSize || '15',
            message: d.message || '',
            status: d.status || 'new',
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Gerade eben',
          });
        });
        setInquiries(items);
      },
      (error) => {
        console.warn('Inquiries fetch error:', error);
      }
    );

    // 3. Custom Gallery items
    const galQuery = query(collection(db, 'gallery_items'));
    const unsubGal = onSnapshot(
      galQuery,
      (snapshot) => {
        const items: GalleryItem[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            title: d.title || '',
            category: d.category || 'allgemein',
            imageUrl: d.imageUrl || '',
            year: d.year || '',
            description: d.description || '',
            createdAt: d.createdAt,
          });
        });
        setCustomGalleryItems(items);
      },
      (error) => {
        console.warn('Gallery items fetch error:', error);
      }
    );

    return () => {
      unsubGb();
      unsubInq();
      unsubGal();
    };
  }, [isOpen, isAuthorized]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Date.now() < lockoutUntil) {
      return;
    }

    const trimmed = pinInput.trim();
    // Master PIN for Walter Leppert / Administrator
    if (trimmed === 'daimler1834' || trimmed === 'leppert73614') {
      setPinAuthorized(true);
      setPinError(null);
      setPinInput('');
      setFailedAttempts(0);
      setLockoutUntil(0);
      localStorage.removeItem('walter_admin_failed_attempts');
      localStorage.removeItem('walter_admin_lockout_until');
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      localStorage.setItem('walter_admin_failed_attempts', nextFailed.toString());

      if (nextFailed >= 5) {
        // Lock for 5 minutes (300 seconds)
        const lockTime = Date.now() + 300 * 1000;
        setLockoutUntil(lockTime);
        localStorage.setItem('walter_admin_lockout_until', lockTime.toString());
        setPinError('Zu viele Fehlversuche. Zugang für 5 Minuten gesperrt.');
      } else if (nextFailed >= 3) {
        // Lock for 30 seconds
        const lockTime = Date.now() + 30 * 1000;
        setLockoutUntil(lockTime);
        localStorage.setItem('walter_admin_lockout_until', lockTime.toString());
        setPinError('Zu viele Fehlversuche. Bitte 30 Sekunden warten.');
      } else {
        const remainingTries = 5 - nextFailed;
        setPinError(`Ungültiges Passwort. (Noch ${remainingTries} Versuch${remainingTries === 1 ? '' : 'e'} vor vorübergehender Sperre)`);
      }
    }
  };

  const handleApproveGuestbook = async (id: string) => {
    try {
      const ref = doc(db, 'guestbook_entries', id);
      await updateDoc(ref, { status: 'approved' });
      setActionMessage('Eintrag erfolgreich freigegeben!');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `guestbook_entries/${id}`);
    }
  };

  const handleDeleteGuestbook = async (id: string) => {
    if (!window.confirm('Möchten Sie diesen Eintrag wirklich löschen?')) return;
    try {
      const ref = doc(db, 'guestbook_entries', id);
      await deleteDoc(ref);
      setActionMessage('Eintrag gelöscht.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `guestbook_entries/${id}`);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: 'new' | 'contacted' | 'completed') => {
    try {
      const ref = doc(db, 'inquiries', id);
      await updateDoc(ref, { status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Möchten Sie diese Anfrage löschen?')) return;
    try {
      const ref = doc(db, 'inquiries', id);
      await deleteDoc(ref);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  // Image Upload handler (File -> Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Bitte wählen Sie ein Bild unter 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl.trim()) return;

    setUploadLoading(true);
    try {
      const newDocRef = doc(collection(db, 'gallery_items'));
      await setDoc(newDocRef, {
        title: photoTitle.trim(),
        category: photoCategory.trim(),
        imageUrl: photoUrl.trim(),
        year: photoYear.trim() || new Date().getFullYear().toString(),
        description: photoDescription.trim(),
        createdAt: serverTimestamp(),
      });

      setPhotoTitle('');
      setPhotoUrl('');
      setPhotoYear('');
      setPhotoDescription('');
      setActionMessage('Foto wurde erfolgreich zur Galerie hinzugefügt!');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'gallery_items');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm('Foto aus der Galerie entfernen?')) return;
    try {
      const ref = doc(db, 'gallery_items', id);
      await deleteDoc(ref);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery_items/${id}`);
    }
  };

  if (!isOpen) return null;

  const pendingGuestbookCount = guestbookItems.filter((e) => e.status === 'pending').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Admin-Bereich · Walter Leppert
              </h2>
              <p className="text-xs text-slate-500">
                Gästebuch moderieren, Anfragen einsehen & Galerie verwalten
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action message */}
        {actionMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Authorization Screen */}
        {!isAuthorized ? (
          <div className="py-10 max-w-sm mx-auto text-center space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                Admin-Zugang
              </h3>
              <p className="text-xs text-slate-500">
                Bitte geben Sie das Administrator-Passwort ein.
              </p>
            </div>

            {/* Password Form */}
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                placeholder={remainingLockSeconds > 0 ? 'Vorübergehend gesperrt' : 'Passwort eingeben'}
                autoFocus={remainingLockSeconds === 0}
                disabled={remainingLockSeconds > 0}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100 disabled:text-slate-400"
              />
              {remainingLockSeconds > 0 ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
                  <div className="font-semibold">Zu viele Fehlversuche (Brute-Force-Schutz)</div>
                  <p>
                    Erneuter Versuch möglich in <strong>{remainingLockSeconds}s</strong>
                  </p>
                </div>
              ) : (
                pinError && <p className="text-xs text-red-600 font-medium">{pinError}</p>
              )}
              <button
                type="submit"
                disabled={remainingLockSeconds > 0}
                className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {remainingLockSeconds > 0 ? `Gesperrt (${remainingLockSeconds}s)` : 'Anmelden'}
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Dashboard */
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            {/* Top Navigation Tabs & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('guestbook')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'guestbook'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Gästebuch-Freigabe</span>
                  {pendingGuestbookCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full font-bold text-[10px]">
                      {pendingGuestbookCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'inquiries'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Anfragen</span>
                  {newInquiriesCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full font-bold text-[10px]">
                      {newInquiriesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Bilder & Galerie</span>
                  {customGalleryItems.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px]">
                      {customGalleryItems.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Logout button */}
              <button
                onClick={async () => {
                  setPinAuthorized(false);
                  if (currentUser) await logoutUser();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                title="Abmelden"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Abmelden</span>
              </button>
            </div>

            {/* Content per Tab */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* TAB 1: GUESTBOOK */}
              {activeTab === 'guestbook' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Eingereichte Gästebuch-Einträge ({guestbookItems.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Neue Einträge müssen erst freigegeben werden, bevor sie öffentlich sichtbar sind.
                    </p>
                  </div>

                  {guestbookItems.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                      Noch keine neuen Online-Einträge in der Firebase-Datenbank vorhanden.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {guestbookItems.map((entry) => (
                        <div
                          key={entry.id}
                          className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                            entry.status === 'pending'
                              ? 'bg-amber-50/60 border-amber-300'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {entry.author}
                                </span>
                                <span className="text-slate-400">({entry.location})</span>
                                {entry.status === 'pending' ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                                    Wartet auf Freigabe
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                    Öffentlich freigegeben
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 text-[11px] block mt-0.5">
                                Tour: {entry.tourName} · Datum: {entry.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {entry.status === 'pending' && (
                                <button
                                  onClick={() => handleApproveGuestbook(entry.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Freigeben</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteGuestbook(entry.id)}
                                className="p-1.5 rounded-lg border border-slate-300 hover:border-red-400 hover:text-red-600 text-slate-500 transition-colors cursor-pointer"
                                title="Eintrag löschen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-100">
                            „{entry.text}“
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Eingegangene Terminanfragen ({inquiries.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Anfragen direkt aus dem Online-Formular gespeichert
                    </p>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                      Noch keine neuen Anfragen in der Datenbank eingegangen.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs shadow-2xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {inq.name}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    inq.status === 'new'
                                      ? 'bg-red-100 text-red-800'
                                      : inq.status === 'contacted'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {inq.status === 'new'
                                    ? 'Neu'
                                    : inq.status === 'contacted'
                                    ? 'In Bearbeitung'
                                    : 'Erledigt'}
                                </span>
                              </div>
                              <span className="text-slate-400 text-[11px]">
                                Eingegangen: {inq.createdAt}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Reply button */}
                              <a
                                href={`mailto:${inq.email}?subject=${encodeURIComponent(
                                  `Ihre Anfrage zur Stadtführung: ${inq.tourTitle}`
                                )}&body=${encodeURIComponent(
                                  `Hallo ${inq.name},\n\nvielen Dank für Ihre Anfrage bezüglich der Führung „${inq.tourTitle}“ am ${inq.date}.\n\nMit freundlichen Grüßen,\nWalter Leppert`
                                )}`}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Antworten</span>
                              </a>

                              <select
                                value={inq.status}
                                onChange={(e) =>
                                  handleUpdateInquiryStatus(
                                    inq.id,
                                    e.target.value as 'new' | 'contacted' | 'completed'
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-blue-600"
                              >
                                <option value="new">Neu</option>
                                <option value="contacted">In Bearbeitung</option>
                                <option value="completed">Erledigt</option>
                              </select>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-red-400 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                                title="Anfrage löschen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Führung:</span>
                              <strong className="text-slate-900">{inq.tourTitle}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Termin / Gruppe:</span>
                              <span>{inq.date || 'k.A.'} (ca. {inq.groupSize} Pers.)</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Kontakt:</span>
                              <div className="truncate">
                                <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline">
                                  {inq.email}
                                </a>
                              </div>
                              {inq.phone && (
                                <div className="text-slate-600">
                                  Tel: <a href={`tel:${inq.phone}`} className="hover:underline">{inq.phone}</a>
                                </div>
                              )}
                            </div>
                          </div>

                          {inq.message && (
                            <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-400 block mb-0.5">Nachricht:</span>
                              <p className="text-slate-800 whitespace-pre-wrap">{inq.message}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Upload new photo form */}
                  <form
                    onSubmit={handleAddPhoto}
                    className="p-5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-4 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        Neues Foto zur Impressionen-Galerie hinzufügen
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Titel / Bildunterschrift *
                        </label>
                        <input
                          type="text"
                          required
                          value={photoTitle}
                          onChange={(e) => setPhotoTitle(e.target.value)}
                          placeholder="z.B. Besuchergruppe am Daimler-Geburtshaus"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Kategorie
                        </label>
                        <select
                          value={photoCategory}
                          onChange={(e) => setPhotoCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 text-xs"
                        >
                          <option value="Führungen">Führungen & Gruppen</option>
                          <option value="Gottlieb Daimler">Gottlieb Daimler & Historie</option>
                          <option value="Schorndorf">Schorndorf Altstadt</option>
                          <option value="Events">Sonderveranstaltungen</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Foto auswählen (vom Computer / Handy)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Oder unten direkt eine Bild-Webadresse eintragen:
                        </span>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Bild-URL (alternativ)
                        </label>
                        <input
                          type="url"
                          value={photoUrl.startsWith('data:') ? '' : photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="https://... / Bild-Link"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 text-xs"
                        />
                      </div>
                    </div>

                    {photoUrl && (
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                        <img
                          src={photoUrl}
                          alt="Vorschau"
                          className="w-16 h-16 object-cover rounded-md border border-slate-200"
                        />
                        <span className="text-xs text-emerald-700 font-medium">
                          ✓ Bild bereit zum Hinzufügen
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Jahr (optional)
                        </label>
                        <input
                          type="text"
                          value={photoYear}
                          onChange={(e) => setPhotoYear(e.target.value)}
                          placeholder="z.B. 2026"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Ergänzende Beschreibung (optional)
                        </label>
                        <input
                          type="text"
                          value={photoDescription}
                          onChange={(e) => setPhotoDescription(e.target.value)}
                          placeholder="z.B. Teilnehmer vor dem Rathaus"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={uploadLoading || !photoUrl}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        {uploadLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Foto speichern</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing custom photos */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Eigene hochgeladene Fotos ({customGalleryItems.length})
                    </h4>
                    {customGalleryItems.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">
                        Noch keine zusätzlichen Fotos hochgeladen. Nutzen Sie das Formular oben.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {customGalleryItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs relative group shadow-2xs"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-32 object-cover rounded-lg border border-slate-100"
                            />
                            <div className="font-semibold text-slate-900 truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-500 flex justify-between">
                              <span>{item.category}</span>
                              <span>{item.year}</span>
                            </div>
                            <button
                              onClick={() => handleDeletePhoto(item.id)}
                              className="w-full mt-2 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Löschen</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
