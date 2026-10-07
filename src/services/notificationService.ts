/**
 * Notification service to send instant email alerts to Walter Leppert
 * using FormSubmit AJAX endpoint.
 */

const TARGET_EMAIL = 'walter.leppert@aol.com';
const NOTIFICATION_ENDPOINT = `https://formsubmit.co/ajax/${TARGET_EMAIL}`;

export interface InquiryNotificationPayload {
  name: string;
  email: string;
  phone?: string;
  tourTitle: string;
  date?: string;
  groupSize?: string;
  message?: string;
}

export interface GuestbookNotificationPayload {
  author: string;
  location: string;
  rating?: number;
  tourName: string;
  text: string;
  entryNumber?: number;
}

/**
 * Sends an email notification to Walter Leppert when a new tour inquiry is submitted.
 */
export async function notifyNewInquiry(data: InquiryNotificationPayload): Promise<boolean> {
  try {
    const response = await fetch(NOTIFICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `Neue Terminanfrage: ${data.tourTitle} - ${data.name}`,
        _template: 'table',
        _captcha: 'false',
        'Führung': data.tourTitle,
        'Name des Anfragenden': data.name,
        'E-Mail': data.email,
        'Telefon': data.phone || 'Keine Angabe',
        'Wunschdatum': data.date || 'Nach Vereinbarung',
        'Teilnehmerzahl (ca.)': `${data.groupSize || '15'} Personen`,
        'Nachricht / Besondere Wünsche': data.message || 'Keine zusätzlichen Angaben',
        'Hinweis': 'Sie können diese Anfrage auch im Admin-Bereich Ihrer Website einsehen und beantworten.',
      }),
    });

    return response.ok;
  } catch (err) {
    console.warn('Inquiry notification email delivery notice:', err);
    return false;
  }
}

/**
 * Sends an email notification to Walter Leppert when a new guestbook review is submitted.
 */
export async function notifyNewGuestbookEntry(data: GuestbookNotificationPayload): Promise<boolean> {
  try {
    const response = await fetch(NOTIFICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `Neuer Gästebucheintrag von ${data.author} - Wartet auf Freigabe`,
        _template: 'table',
        _captcha: 'false',
        'Status': 'Wartet auf Ihre Freigabe',
        'Name / Autor': data.author,
        'Herkunft / Ort': data.location || 'Gast in Schorndorf',
        'Führung': data.tourName,
        'Feedback / Gästebuchtext': data.text,
        'Eintrags-Nummer': data.entryNumber ? `#${data.entryNumber}` : 'Neu',
        'Nächster Schritt': 'Öffnen Sie den Admin-Bereich auf Ihrer Website, um diesen Eintrag mit 1 Klick freizuschalten.',
      }),
    });

    return response.ok;
  } catch (err) {
    console.warn('Guestbook notification email delivery notice:', err);
    return false;
  }
}
