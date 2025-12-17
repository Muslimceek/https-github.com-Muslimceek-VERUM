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

// Helper to handle 503 Overloaded errors automatically for TEXT only
async function withRetry<T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isOverloaded = error.toString().includes('503') || error.toString().includes('Overloaded');
    if (isOverloaded && retries > 0) {
      console.log(`Server overloaded, retrying in ${delay}ms... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateVeraWord = async (situation: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  Ситуация девушки: "${situation}".
  Мне нужно короткое, глубокое слово поддержки.
  Напиши 3-4 коротких блока.
  `;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.9 },
    });
    return response.text?.trim() || "Тишина...";
  });
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

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 1.0 },
    });
    return response.text?.trim() || "Тишина...";
  });
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

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
    });
    return response.text?.trim() || "Я слышу тебя...";
  });
};

export const generateDailyMessage = async (): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    const fallbacks = [
      "Сегодня можно никуда не спешить.\nТы всё равно вовремя.",
      "Твоя усталость — это не слабость.\nЭто просьба о тишине.",
      "Позволь себе просто быть.\nЭтого достаточно.",
      "Слушай себя.\nТвое сердце знает дорогу."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  Придумай "Фразу дня" для девушки.
  ОЧЕНЬ КОРОТКО. Максимум 2 предложения.
  Без поучений. Только принятие и тепло.
  Пример: "Сегодня можно никуда не спешить. Ты всё равно вовремя."
  `;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 1.1 },
      });
      return response.text?.trim() || "Сегодня твой день.";
    });
  } catch (e) {
    console.error(e);
    return "Сегодня можно никуда не спешить.\nТы всё равно вовремя.";
  }
};

// SWITCHED TO POLLINATIONS AI (UNLIMITED, FREE)
export const generateVeraImage = async (userPrompt: string, stylePrompt: string): Promise<string | null> => {
  // We do NOT use Gemini API key here anymore.
  
  try {
    // Generate a random seed to ensure uniqueness even with same prompts
    const seed = Math.floor(Math.random() * 10000000);
    
    // Construct a rich artistic prompt
    const enhancedPrompt = encodeURIComponent(
      `artistic aesthetic illustration, ${userPrompt}, ${stylePrompt}, soft lighting, dreamy atmosphere, elegant, minimalist, high quality, 8k, detailed texture`
    );

    // Pollinations AI URL (Free, Unlimited, No Key required)
    // Using 'flux' model for better artistic quality, or default
    const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

    // We add a small artificial delay so the UI feels responsive (instant images sometimes feel like bugs)
    // and to allow the browser to start pre-fetching
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Pre-validate that the URL works (fetch head)
    const check = await fetch(url, { method: 'HEAD' });
    if (check.ok) {
        return url;
    } else {
        throw new Error("Image service unavailable");
    }

  } catch (e) {
    console.error("Image generation attempt failed", e);
    // Fallback or re-throw
    throw e;
  }
};