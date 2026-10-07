/**
 * Types for Walter Leppert - Stadtführungen Schorndorf
 */

export interface TourStop {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  address: string;
  description: string;
  historicalFact: string;
}

export interface TourPackage {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  duration: string;
  groupSize: string;
  meetingPoint: string;
  priceNote: string;
  description: string;
  features: string[];
  imageUrl: string;
  highlight?: boolean;
}

export interface GuestbookEntry {
  id: string;
  entryNumber?: number;
  author: string;
  location: string;
  date: string;
  rating?: number; // 1 to 5 (optional)
  tourName: string;
  text: string;
  verifiedBadge?: string;
  createdAt: number;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tourId: string;
  tourTitle: string;
  date?: string;
  groupSize?: string;
  message?: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt: any;
}

export interface GalleryItem {
  id: string;
  title: string;
  category?: 'daimler' | 'schorndorf' | 'fuehrungen' | 'historie' | string;
  description?: string;
  imageUrl: string;
  thumbUrl?: string;
  location?: string;
  year?: string;
  width?: number;
  height?: number;
  createdAt?: any;
}

export interface BookingFormState {
  name: string;
  email: string;
  phone: string;
  tourId: string;
  date: string;
  time: string;
  groupSize: string;
  occasion: string;
  message: string;
}
