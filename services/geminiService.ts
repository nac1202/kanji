import { GoogleGenAI, Type } from "@google/genai";
import { GRADE_1_KANJI, API_KEY } from "../constants";
import { QuizQuestion } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
あなたは日本の小学校1年生の先生です。
1年生で習う漢字を使った、読み方を問うクイズを作成してください。
子供向けなので、漢字以外の部分はできるだけ平仮名を使ってください。
`;

export const generateQuizQuestion = async (
  usedKanji: string[] = []
): Promise<QuizQuestion> => {
  // Pick a random kanji that hasn't been used recently if possible, otherwise random
  let availableKanji = GRADE_1_KANJI.filter((k) => !usedKanji.includes(k));
  if (availableKanji.length === 0) availableKanji = GRADE_1_KANJI;
  
  const target = availableKanji[Math.floor(Math.random() * availableKanji.length)];

  const prompt = `
    漢字「${target}」を使った簡単な短い例文を作ってください。
    その例文の中で、「${target}」の部分の正しい「読み仮名（ひらがな）」をクイズにします。
    
    以下のJSON形式で出力してください：
    - sentence_with_placeholder: 漢字の部分を [] で囲った文 (例: "あした [山] へ いきます")
    - correct_reading: 正しい読み仮名 (例: "やま")
    - distractors: 間違いの選択肢を3つ（ひらがなで、子供が間違えそうなものや、全く違う面白いもの）
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence_with_placeholder: { type: Type.STRING },
            correct_reading: { type: Type.STRING },
            distractors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["sentence_with_placeholder", "correct_reading", "distractors"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    const data = JSON.parse(jsonText);
    
    // Create options array and shuffle it
    const allOptions = [data.correct_reading, ...data.distractors];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    return {
      originalSentence: data.sentence_with_placeholder.replace('[', '').replace(']', ''),
      displaySentence: data.sentence_with_placeholder,
      targetKanji: target,
      correctReading: data.correct_reading,
      options: shuffledOptions,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback question in case of API failure
    return {
      originalSentence: "山へ いきます",
      displaySentence: "[山] へ いきます",
      targetKanji: "山",
      correctReading: "やま",
      options: ["やま", "かわ", "うみ", "そら"],
    };
  }
};
