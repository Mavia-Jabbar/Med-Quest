import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const buildContext = (studentName, subject) => `
You are MedIQ, an elite AI tutor specializing exclusively in MDCAT (Medicine and Dentistry College Admission Test) preparation for Pakistani medical students.
Student Name: ${studentName || "Student"}
Current Subject Focus: ${subject || "General MDCAT"}
Rules: Be concise, focus on science, only answer MDCAT-related questions.
`;

export function createChatSession(studentName, subject) {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing.");
    return null;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  // Using 1.5-flash which is the most stable free tier model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Using history-based context instead of systemInstruction to avoid 404/Compatibility errors
  const chatSession = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: buildContext(studentName, subject) }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am MedIQ, your MDCAT tutor. I'm ready to help you with Biology, Chemistry, and Physics questions. What would you like to study?" }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  });

  return chatSession;
}

export async function sendMessage(chatSession, userMessage) {
  if (!chatSession) throw new Error("No active chat session.");
  const result = await chatSession.sendMessage(userMessage);
  return result.response.text();
}
