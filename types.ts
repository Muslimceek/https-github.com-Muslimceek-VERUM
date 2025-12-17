export type ToneType = 'masculine' | 'female_appeal' | 'universal';
export type MoodType = 'hard' | 'soft' | 'philosophical';

export interface StyleOptions {
  tone: ToneType;
  mood: MoodType;
}

export interface GeneratedContent {
  id: string;
  text: string; // The full text
  blocks: string[]; // Split by stanza
  theme: string;
  timestamp: number;
  isFavorite: boolean;
  style: StyleOptions;
}

export interface CollectionItem extends GeneratedContent {}

export enum AppScreen {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  LIBRARY = 'LIBRARY',
  SETTINGS = 'SETTINGS'
}

export const EXAMPLE_PROMPTS = [
  "Верность",
  "Почему мужчины изменяют",
  "Молчание сильнее слов",
  "Женщина, которую хочется беречь",
  "Цена предательства",
  "Одиночество силы"
];