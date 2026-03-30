import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// System prompt: locks the AI into MDCAT tutor mode
const buildSystemInstruction = (studentName, subject) => `
You are MedIQ, an elite AI tutor specializing exclusively in MDCAT (Medicine and Dentistry College Admission Test) preparation for Pakistani medical students.

Student Name: ${studentName || "Student"}
Current Subject Focus: ${subject || "General MDCAT"}

Your personality:
- Highly knowledgeable, warm, and encouraging
- You explain complex science concepts in simple, memorable ways
- You use real-world analogies to make abstract concepts stick
- You are concise — no unnecessary filler text

Your strict rules:
- Only answer questions related to MDCAT subjects: Biology, Chemistry, Physics, English, and Logical Reasoning
- If asked about anything unrelated to MDCAT, politely redirect the student
- When answering, structure your response clearly (use bullet points or numbered steps for complex topics)
- Always end with a brief motivating line to keep the student energized

Always remember the full conversation history and refer back to earlier messages when relevant.
`;

/**
 * Creates a fresh Gemini chat session with full conversation memory.
 * Call this once when the Tutor page mounts, then reuse the `chatSession` object.
 */
export function createChatSession(studentName, subject) {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing. Add it to your .env.local file.");
    return null;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: buildSystemInstruction(studentName, subject),
  });

  // `startChat` with empty history — Gemini will accumulate the full session turns automatically
  const chatSession = model.startChat({
    history: [],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  });

  return chatSession;
}

/**
 * Sends a message to an existing chat session and returns the AI response text.
 * Full conversation history is maintained inside the `chatSession` object by the SDK.
 */
export async function sendMessage(chatSession, userMessage) {
  if (!chatSession) throw new Error("No active chat session.");
  const result = await chatSession.sendMessage(userMessage);
  return result.response.text();
}
