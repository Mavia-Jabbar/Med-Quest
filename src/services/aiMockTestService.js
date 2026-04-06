import { db } from "@/Context/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Converts a pure base64 PDF string (without data URL prefix) into a structured Mock Test.
 */
export const convertPdfToMockTest = async (userId, base64Pdf, fileName) => {
  if (!genAI) throw new Error("Missing Gemini API Key");

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: `You are an expert exam parser. You will receive a PDF document that contains a mock test or exam paper. 
The PDF contains multiple choice questions (MCQs), some of which may have the correct answer visually ticked, marked, or indicated.
Your job is to extract all the questions, options, and identify the correct answer index.
Your output MUST be a strict, minified JSON array in exactly the following format (do NOT include markdown formatting like \`\`\`json):
[
  {
    "id": "q1",
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 2, 
    "explanation": "Optional explanation if inferred from document, else empty string."
  }
]

Note that correctAnswer is the 0-based index of the right option in the options array.`
  });

  try {
    const result = await model.generateContent([
      "Extract the test from this PDF.",
      {
        inlineData: {
          data: base64Pdf,
          mimeType: "application/pdf"
        }
      }
    ]);

    let text = result.response.text().trim();
    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsedQuestions = JSON.parse(text);

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error("Could not extract recognized questions from the PDF.");
    }

    // Determine total length automatically
    const mockTestObj = {
      title: fileName || "Custom PDF Mock Test",
      description: "AI-Generated Mock Test extracted from uploaded document.",
      subjectKey: "Custom",
      durationMinutes: Math.max(10, parsedQuestions.length * 1), // 1 minute per string
      questions: parsedQuestions,
      createdAt: serverTimestamp()
    };

    // Save to Firestore
    const customTestsRef = collection(db, "users", userId, "custom_mocktests");
    const docRef = await addDoc(customTestsRef, mockTestObj);
    
    return { ...mockTestObj, docId: docRef.id };

  } catch (error) {
    console.error("PDF Parsing failed:", error);
    throw new Error("Failed to parse PDF and generate test. Ensure document is clear.");
  }
};

/**
 * Fetches the user's custom PDF generated mock tests from Firestore.
 */
export const fetchCustomMockTests = async (userId) => {
  if (!userId) return [];
  const testsRef = collection(db, "users", userId, "custom_mocktests");
  const q = query(testsRef, orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  const tests = [];
  querySnapshot.forEach((doc) => {
    tests.push({ docId: doc.id, ...doc.data() });
  });
  return tests;
};
