import { Artist, TattooStyle } from './types';

export const ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: "Cem 'Needle' Yılmaz",
    role: "Lead Artist",
    exp: "12 Yıl Deneyim",
    img: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=400&h=500&grayscale",
    specialties: [TattooStyle.REALISM, TattooStyle.BLACKWORK, TattooStyle.GOTHIC]
  },
  {
    id: 'artist-2',
    name: "Elif Kara",
    role: "Realism Queen",
    exp: "8 Yıl Deneyim",
    img: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=400&h=500&grayscale",
    specialties: [TattooStyle.REALISM, TattooStyle.WATERCOLOR, TattooStyle.BOTANICAL]
  },
  {
    id: 'artist-3',
    name: "Barış Öz",
    role: "Old School Master",
    exp: "6 Yıl Deneyim",
    img: "https://images.unsplash.com/photo-1504190149910-72120049a174?auto=format&fit=crop&q=80&w=400&h=500&grayscale",
    specialties: [TattooStyle.OLD_SCHOOL, TattooStyle.NEO_TRADITIONAL, TattooStyle.GEOMETRIC]
  }
];

export const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];
