import { db } from "@/Context/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const CACHE_DURATION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

/**
 * Gets cached flashcards from Firestore or generates new ones if expired/missing.
 */
export const getOrGenerateFlashcards = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const docRef = doc(db, "users", userId, "flashcards", "data");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const now = Date.now();
    // If cache is less than 2 days old, return cached cards
    if (data.createdAt && (now - data.createdAt) < CACHE_DURATION_MS && data.cards && data.cards.length > 0) {
      console.log("Returning cached flashcards");
      return data.cards;
    }
  }

  console.log("Cache expired or missing. Synthesizing new flashcards via AI...");
  if (!genAI) {
    throw new Error("Missing Gemini API Key in .env.local");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: `You are an expert Medical Exam (MDCAT) Flashcard Generator.
You must generate exactly 45 flashcards: 15 for Biology, 15 for Physics, and 15 for Chemistry.
Your output MUST be a valid, minified JSON array of objects. 
Do not include markdown blocks like \`\`\`json. Output ONLY the raw JSON string.
Format:
[
  { "subject": "Biology", "front": "Question...", "back": "Answer..." },
  ...
]`,
  });

  try {
    const result = await model.generateContent("Please generate the 45 fresh MDCAT flashcards now.");
    let text = result.response.text().trim();
    
    // Clean up potential markdown formatting from AI
    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const cards = JSON.parse(text);

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error("AI returned invalid JSON structure");
    }

    // Save to Firestore
    await setDoc(docRef, {
      cards: cards,
      createdAt: Date.now()
    });

    console.log("Successfully generated and cached 45 flashcards!");
    return cards;
  } catch (error) {
    console.error("Failed to generate flashcards:", error);
    throw new Error("Failed to generate flashcards. Please try again later.");
  }
};
