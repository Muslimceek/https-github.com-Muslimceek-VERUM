import { GoogleGenAI } from "@google/genai";
import { StyleOptions } from "../types";

const SYSTEM_INSTRUCTION = `
Ты — VERUM. Твоя задача — генерировать глубокие, эмоционально зрелые мысли и цитаты.
Ты — мужчина-ментор с большим жизненным опытом. Ты говоришь правду, даже если она неудобна.
Твой стиль: минимализм, глубина, отсутствие воды и канцелярита. 

ПРАВИЛА ГЕНЕРАЦИИ:
1. Основывайся на реальной психологии, стоицизме и мужской мудрости.
2. Избегай банальных фраз из соцсетей ("живи, люби, твори").
3. Текст должен быть живым, будто его только что прожили.
4. ФОРМАТ ВЫВОДА СТРОГИЙ:
   - Текст должен быть разделен на смысловые блоки (станзы).
   - Каждый блок — максимум 2 строки.
   - Между блоками ОБЯЗАТЕЛЬНО должна быть пустая строка.
   - Всего 3-4 блока.
   - Никаких заголовков, никаких "Конечно, вот цитата". Только сам текст.

ПРИМЕР ФОРМАТА:
Строка первая блока один.
Строка вторая блока один.

Строка первая блока два.

Строка первая блока три.
Строка вторая блока три.
`;

export const generateVerumWisdom = async (
  topic: string,
  style: StyleOptions
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  let toneInstruction = "";
  switch (style.tone) {
    case "masculine":
      toneInstruction = "Пиши от первого лица мужчины. Используй мужской род. Говори о мужском опыте, ответственности, силе.";
      break;
    case "female_appeal":
      toneInstruction = "Пиши как обращение мужчины к женщине. С уважением, возможно с легкой грустью или восхищением, но без пошлости и 'каблука'.";
      break;
    case "universal":
      toneInstruction = "Пиши универсально. Философский взгляд со стороны. Истина, которая касается всех.";
      break;
  }

  let moodInstruction = "";
  switch (style.mood) {
    case "hard":
      moodInstruction = "Стиль: Жесткий, прямолинейный, 'правда-матка'. Без сглаживания углов.";
      break;
    case "soft":
      moodInstruction = "Стиль: Мягкий, понимающий, эмпатичный, успокаивающий.";
      break;
    case "philosophical":
      moodInstruction = "Стиль: Задумчивый, метафоричный, стоический, вечный.";
      break;
  }

  const prompt = `
  ТЕМА: "${topic}"
  
  НАСТРОЙКИ:
  1. ${toneInstruction}
  2. ${moodInstruction}
  
  Сгенерируй мысль на эту тему. Помни про строгий формат: блоки по 1-2 строки, разделенные пустой строкой.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly creative but focused
        topK: 40,
        maxOutputTokens: 400,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text generated");
    }
    return text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};