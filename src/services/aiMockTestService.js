import { db } from "@/Context/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Converts a pure base64 PDF string (without data URL prefix) into a structured Mock Test.
 * Saved globally to `global_mock_tests` so all students can access it.
 */
export const convertPdfToMockTest = async (base64Pdf, fileName) => {
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

    // Determine total length automatically matching 1 Minute = 1 Question exactly
    const calculatedDuration = Math.max(1, parsedQuestions.length);

    const mockTestObj = {
      title: fileName || "Custom PDF Mock Test",
      description: `AI-Generated Mock Test extracted from uploaded document. Contains ${parsedQuestions.length} Questions.`,
      subjectKey: "Custom",
      durationMinutes: calculatedDuration,
      questions: parsedQuestions,
      createdAt: serverTimestamp()
    };

    // Save strictly to global repository accessible by all
    const customTestsRef = collection(db, "global_mock_tests");
    const docRef = await addDoc(customTestsRef, mockTestObj);
    
    return { ...mockTestObj, docId: docRef.id };

  } catch (error) {
    console.error("PDF Parsing failed:", error);
    throw new Error("Failed to parse PDF and generate test. Ensure document is clear.");
  }
};

/**
 * Fetches all globally distributed admin-generated mock tests.
 */
export const fetchCustomMockTests = async () => {
  const testsRef = collection(db, "global_mock_tests");
  const q = query(testsRef, orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  const tests = [];
  querySnapshot.forEach((docSnap) => {
    tests.push({ docId: docSnap.id, ...docSnap.data() });
  });
  return tests;
};

/**
 * Deletes a globally distributed mock test (Admin only usage implied on frontend).
 */
export const deleteCustomMockTest = async (docId) => {
  const docRef = doc(db, "global_mock_tests", docId);
  await deleteDoc(docRef);
};
