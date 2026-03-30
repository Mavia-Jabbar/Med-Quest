// src/services/tutorService.js
// Handles all communication with the Google Gemini API

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// The master system prompt that keeps the AI locked on MDCAT topics
const SYSTEM_PROMPT = `You are MedAI, an elite MDCAT preparation tutor for Pakistani students. 
You have deep expertise in the following MDCAT subjects:
- Biology (Cell Biology, Genetics, Human Physiology, Ecology, Biochemistry)
- Chemistry (Organic, Inorganic, Physical Chemistry, Thermodynamics, Electrochemistry)
- Physics (Mechanics, Waves, Thermodynamics, Electromagnetism, Optics, Modern Physics)
- English (Grammar, Comprehension, Vocabulary as tested in MDCAT)

Rules you MUST follow:
1. Answer questions ONLY about MDCAT preparation, science subjects, or study strategies.
2. If asked about unrelated topics (sports, politics, etc.), politely decline and redirect.
3. Keep answers concise but comprehensive — ideal for students who need to learn fast.
4. Use numbered lists, bullet points, and bold text to structure your responses clearly.
5. When explaining concepts, always include: a simple definition, the key mechanism, and an MDCAT exam tip.
6. Speak in an encouraging, confident, motivating tone. You believe in every student.`;

/**
 * Sends a message to the Gemini API with full conversation context.
 * @param {Array} messageHistory - array of { role: 'user'|'model', text: string }
 * @param {string} activeSubject - The subject tab currently selected by the student
 */
export async function sendMessageToAI(messageHistory, activeSubject) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file.");
  }

  // Build the Gemini `contents` array from our message history
  // The first entry is the system prompt injected as a model turn
  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT + `\n\nThe student is currently focused on: ${activeSubject}. Prioritize responses related to this subject.` }]
    },
    {
      role: "model",
      parts: [{ text: `Understood! I'm MedAI, your dedicated MDCAT tutor. I'm ready to help you master ${activeSubject}. What would you like to explore today?` }]
    },
    // Inject all real message history after the system context
    ...messageHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }))
  ];

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ]
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData?.error?.message || "Gemini API request failed.");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) throw new Error("No response received from AI.");
  return text;
}
