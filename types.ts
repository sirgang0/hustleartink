export enum TattooStyle {
  REALISM = 'Realism',
  OLD_SCHOOL = 'Old School',
  TRIBAL = 'Tribal',
  GOTHIC = 'Gothic',
  MINIMALISM = 'Minimalism',
  GEOMETRIC = 'Geometric',
  BOTANICAL = 'Botanical',
  ORIENTAL = 'Oriental',
  WATERCOLOR = 'Watercolor',
  NEO_TRADITIONAL = 'Neo Traditional',
  TRASH_POLKA = 'Trash Polka',
  CYBERPUNK = 'Cyberpunk',
  SKETCH = 'Sketch',
  BLACKWORK = 'Blackwork'
}

export enum BodyPart {
  ARM = 'Kol',
  LEG = 'Bacak',
  BACK = 'Sırt',
  CHEST = 'Göğüs',
  NECK = 'Boyun',
  HAND = 'El'
}

export interface TattooItem {
  id: number;
  imageUrl: string;
  title: string;
  price: number;
  bodyPart: BodyPart;
  style: TattooStyle;
}

export interface GeminiError {
  message: string;
}

// New Types for AI Generator Visual Cards
export interface VisualOption {
  id: string;
  name: string;
  imageUrl: string; // Placeholder or asset URL
  promptFragment: string; // The specific English prompt text
  description?: string;
  features?: string;
  commonFigures?: string;
  artisticAspect?: string;
}

export interface Draft {
  id: string;
  userId: string; // Added for security relation
  imageUrl: string;
  prompt: string;
  originalSubject?: string;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: number;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  exp: string;
  img: string;
  specialties: TattooStyle[];
}

export interface Appointment {
  id?: string;
  artistId: string;
  artistName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO string (YYYY-MM-DD)
  timeSlot: string; // e.g., "10:00", "14:00"
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: number;
}
