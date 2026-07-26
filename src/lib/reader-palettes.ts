import type { ReaderBackground } from '@/types/reader';
export const READER_BACKGROUNDS: { id: ReaderBackground; label: string; darkLabel: string; light: string; dark: string }[] = [
  { id: 'paper', label: 'Paper', darkLabel: 'Soft charcoal', light: '#f7f4ed', dark: '#1d1c1a' },
  { id: 'white', label: 'White', darkLabel: 'Ink', light: '#ffffff', dark: '#111111' },
  { id: 'warm', label: 'Warm ivory', darkLabel: 'Warm brown', light: '#fbf1df', dark: '#211b14' },
  { id: 'sepia', label: 'Sepia', darkLabel: 'Deep sepia', light: '#efe0c8', dark: '#251d15' },
  { id: 'sage', label: 'Sage', darkLabel: 'Forest', light: '#eef3ea', dark: '#151d16' },
  { id: 'mist', label: 'Mist', darkLabel: 'Blue black', light: '#eef2f5', dark: '#14181c' },
  { id: 'charcoal', label: 'Light gray', darkLabel: 'Charcoal', light: '#e9e9e6', dark: '#202020' },
  { id: 'black', label: 'Soft white', darkLabel: 'Black', light: '#f4f4f4', dark: '#050505' },
];
