export type ScreenType = 'ONBOARDING' | 'HOME' | 'LETTERS' | 'JOURNAL' | 'LIBRARY';

export interface VERAContent {
  id: string;
  text: string;
  blocks: string[]; // For specific formatting
  type: 'word' | 'letter' | 'journal_response';
  tag: string; // emotion or topic
  timestamp: number;
  isFavorite: boolean;
}

export interface JournalEntry {
  id: string;
  userText: string;
  veraResponse: VERAContent | null;
  timestamp: number;
}

export const SITUATIONS = [
  "Я устала",
  "Мне больно",
  "Я скучаю",
  "Я выбираю себя",
  "Нужно тепло",
  "Хочу тишины"
];

export const LETTER_TYPES = [
  { id: 'support', label: 'Письмо поддержки', prompt: 'Напиши мне письмо поддержки' },
  { id: 'future', label: 'Себе будущей', prompt: 'Напиши письмо мне будущей' },
  { id: 'hard', label: 'Если сейчас тяжело', prompt: 'Письмо для момента, когда опускаются руки' },
  { id: 'life', label: 'Письмо от жизни', prompt: 'Представь, что Жизнь пишет мне письмо' },
];

export const LIBRARY_FILTERS = ['Все', 'Любовь', 'Боль', 'Тишина', 'Сила'];