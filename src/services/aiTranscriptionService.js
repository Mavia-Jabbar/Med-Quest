import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Converts a base64 PDF string into beautifully formatted Markdown using Gemini API.
 */
export const transcribePdfToMarkdown = async (base64Pdf) => {
  if (!genAI) throw new Error("Missing Gemini API Key");

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: `You are an expert academic transcription AI. You are taking raw PDF documents (notes, textbooks, syllabus pages) and explicitly converting them into beautifully readable Markdown. Ensure you:
1. Maintain all headings and structurally organize the document perfectly.
2. Maintain all bullet points and numbered lists.
3. Apply bold text to important key terms.
4. If there is a table, convert it into a Markdown table.
5. Do NOT include generic conversational fillers. Only return the final raw Markdown transcription.`
  });

  try {
    const result = await model.generateContent([
      "Convert this PDF completely into properly formatted beautiful Markdown text.",
      {
        inlineData: {
          data: base64Pdf,
          mimeType: "application/pdf"
        }
      }
    ]);

    let markdown = result.response.text().trim();
    if (markdown.startsWith("```markdown")) {
        markdown = markdown.replace(/^```markdown/, "").replace(/```$/, "").trim();
    }
    return markdown;
  } catch (error) {
    console.error("Transcription failed:", error);
    throw new Error("Failed to transcribe PDF. Try keeping file sizes reasonable.");
  }
};
