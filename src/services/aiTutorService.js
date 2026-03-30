import { db } from "@/Context/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API Key exists in the .env.local file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  // System Instructions explicitly limit the AI to MDCAT capabilities
  model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", 
    systemInstruction: "You are the primary elite MDCAT Tutor for the Med-Quest application. You must ONLY answer questions regarding Medical Sciences, Biology, Chemistry, and Physics. Be extremely concise, highly encouraging, and strictly accurate. Refuse to answer non-academic questions politely.",
  });
}

/**
 * Initializes a real-time listening connection to a user's Chat History on Firestore.
 */
export const subscribeToChatHistory = (userId, callback) => {
  if (!userId) return () => {};

  const messagesRef = collection(db, "users", userId, "chats");
  // Bypass native orderBy to prevent serverTimestamp 'null' exclusion during optimistic local writes
  const q = query(messagesRef);

  return onSnapshot(q, (snapshot) => {
    let msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort chronologically in memory (fallback to Date.now() if timestamp is still pending from server)
    msgs.sort((a, b) => {
      const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
      const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
      return timeA - timeB;
    });

    console.log("Firestore onSnapshot synced! Message Count:", msgs.length);
    callback(msgs);
  }, (error) => {
    console.error("FIRESTORE LISTENER ERROR:", error);
  });
};

/**
 * Appends a new message directly to Firestore.
 */
export const appendChatMessage = async (userId, role, text) => {
  if (!userId) return;
  const messagesRef = collection(db, "users", userId, "chats");
  
  await addDoc(messagesRef, {
    role, // 'user' or 'model'
    text,
    timestamp: serverTimestamp()
  });
};

/**
 * Interacts with the Gemini API to stream or fetch a complete response 
 * based on the student's prompt and past history.
 */
export const askAITutor = async (userId, userMessage, chatHistory = []) => {
  if (!apiKey || !model) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env.local file.");
  }

  try {
    // 1. Save student's query to Firestore
    await appendChatMessage(userId, 'user', userMessage);

    // 2. Format history into Gemini's specific 'contents' structure 
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Start a Chat Session keeping recent context
    console.log("Starting chat with formatted history length:", formattedHistory.length);
    const chatSession = model.startChat({
      history: formattedHistory,
    });

    // 3. Request completion from Gemini
    console.log("Sending message to Gemini API...");
    const result = await chatSession.sendMessage(userMessage);
    const aiResponseText = result.response.text();
    console.log("Received AI response successfully.");

    // 4. Save Gemini's answer to Firestore
    await appendChatMessage(userId, 'model', aiResponseText);
    
    return true;
  } catch (error) {
    console.error("Gemini AI API CRITICAL Error:", error);
    throw error;
  }
};
