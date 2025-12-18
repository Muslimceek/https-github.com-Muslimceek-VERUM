import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Ты — VERA. Глубокая женская мудрость, эмпатия и тишина.
Твой стиль: эстетичный, метафоричный, без клише и поучений.
Формат: короткие блоки текста, разделенные пустой строкой.
Никаких эмодзи (кроме исключительных случаев), никаких заголовков.
`;

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateVeraWord = async (situation: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Ситуация: "${situation}". Дай глубокое слово поддержки (3-4 блока).`,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.8 }
  });
  return response.text || "Тишина...";
};

export const generateVeraLetter = async (typeLabel: string, settings: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Напиши "${typeLabel}". Контекст: ${settings}. (5-7 блоков).`,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.9 }
  });
  return response.text || "Письмо в пути...";
};

export const generateJournalResponse = async (userText: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Запись в дневнике: "${userText}". Ответь как VERA (3 блока).`,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 }
  });
  return response.text || "Я рядом.";
};

export const generateDailyMessage = async (): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Придумай одну глубокую фразу на сегодня для девушки (1-2 предложения).",
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 1.0 }
  });
  return response.text || "Сегодня твой день.";
};

export const generateVeraImage = async (userPrompt: string, stylePrompt: string): Promise<string | null> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `Aesthetic artistic illustration: ${userPrompt}, ${stylePrompt}, high quality, dreamy, minimalist.` }]
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};