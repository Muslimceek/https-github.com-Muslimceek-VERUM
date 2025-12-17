
export type ScreenType = 'ONBOARDING' | 'HOME' | 'LETTERS' | 'IMAGES' | 'JOURNAL' | 'LIBRARY';

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
  { text: "Я устала", emoji: "🥀" },
  { text: "Мне больно", emoji: "❤️‍🩹" },
  { text: "Я скучаю", emoji: "🌑" },
  { text: "Выбираю себя", emoji: "🦢" },
  { text: "Нужно тепло", emoji: "☕️" },
  { text: "Хочу тишины", emoji: "🕯️" }
];

export const LETTER_TYPES = [
  { id: 'support', label: 'Письмо поддержки', prompt: 'Напиши мне письмо поддержки', emoji: '💌' },
  { id: 'future', label: 'Себе будущей', prompt: 'Напиши письмо мне будущей', emoji: '⏳' },
  { id: 'hard', label: 'Если сейчас тяжело', prompt: 'Письмо для момента, когда опускаются руки', emoji: '☁️' },
  { id: 'life', label: 'Письмо от жизни', prompt: 'Представь, что Жизнь пишет мне письмо', emoji: '🌱' },
];

export const IMAGE_STYLES = [
  { id: 'none', label: 'Свободный', prompt: 'high quality, detailed, 8k', emoji: '✨' },
  { id: 'realistic', label: 'Живое фото', prompt: 'photorealistic, 8k, highly detailed, cinematic lighting, photography, shot on 35mm lens, depth of field', emoji: '📸' },
  { id: 'watercolor', label: 'Акварель', prompt: 'Soft watercolor painting, pastel colors, dreamy, wet on wet technique, artstation', emoji: '🎨' },
  { id: 'oil', label: 'Масло', prompt: 'Oil painting, textured, warm lighting, expressive strokes, classical art style', emoji: '🖼️' },
  { id: 'dream', label: 'Сон', prompt: 'Surreal, cloudy, soft focus, magical realism, ethereal light, pastel gradient', emoji: '🌙' },
  { id: 'anime', label: 'Аниме', prompt: 'Anime style, studio ghibli, makoto shinkai, detailed background, atmospheric', emoji: '🌸' },
  { id: 'nature', label: 'Ботаника', prompt: 'Botanical illustration, organic shapes, flowers and leaves, calming green and beige tones, minimalist', emoji: '🌿' },
  { id: 'coquette', label: 'Coquette', prompt: 'Coquette aesthetic, bows, pearls, soft pink, vintage filters, lana del rey style, romantic', emoji: '🎀' },
];

export const LIBRARY_FILTERS = [
  { label: 'Все', emoji: '🤍' },
  { label: 'Любовь', emoji: '🏹' },
  { label: 'Боль', emoji: '🌧️' },
  { label: 'Тишина', emoji: '🐚' },
  { label: 'Сила', emoji: '🦁' }
];