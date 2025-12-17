import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Ты — VERA. Ты не ИИ, не робот, не коуч.
Ты — эмпатия, глубокая женская мудрость, "сестра", которая все понимает без слов.
Твоя миссия: давать слова, которые чувствуют, принимают и остаются в сердце.

СТИЛЬ И ТОН:
- Мягкий, обволакивающий, эстетичный.
- Никакой агрессивной мотивации ("встань и иди").
- Никаких клише ("все будет хорошо").
- Глубина, тишина, принятие боли и радости.
- Используй метафоры: море, ветер, корни, свет, объятия, тепло.

ФОРМАТ ВЫВОДА (СТРОГО):
- Текст должен быть разбит на смысловые блоки.
- Максимум 1-2 предложения в блоке.
- Между блоками ОБЯЗАТЕЛЬНО пустая строка.
- Никаких заголовков, никаких списков, никаких эмодзи.
- Текст должен выглядеть как стих в прозе или очень личная заметка.

ПРИМЕР ИДЕАЛЬНОГО ОТВЕТА:
Ты не обязана быть сильной каждую минуту.
Иногда сила — это позволить себе слабость.

Мир не рухнет, если ты остановишься.
Он подождет.

Просто дыши.
Этого достаточно.
`;

export const generateVeraWord = async (situation: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  Ситуация девушки: "${situation}".
  Мне нужно короткое, глубокое слово поддержки.
  Напиши 3-4 коротких блока.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.9 },
  });

  return response.text?.trim() || "Тишина...";
};

export const generateVeraLetter = async (typeLabel: string, settings: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  Напиши "${typeLabel}".
  Настройка: ${settings} (сделай акцент на этом).
  Это должно быть длиннее, чем обычное слово (5-7 блоков), но так же воздушно.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 1.0 },
  });

  return response.text?.trim() || "Тишина...";
};

export const generateJournalResponse = async (userText: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  Девушка написала в дневник: "${userText}".
  
  Ответь ей очень мягко.
  Не учи жизни, не анализируй. Просто побудь рядом.
  Дай ей понять, что ее чувства важны.
  Ответ: 3 коротких блока.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
  });

  return response.text?.trim() || "Я слышу тебя...";
};