import { db } from "@/Context/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

// Ensure the API Key exists in the .env.local file
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const SYSTEM_INSTRUCTION = "You are the primary elite MDCAT Tutor for the MedQuest application. You must ONLY answer questions regarding Medical Sciences, Biology, Chemistry, and Physics. Be extremely concise, highly encouraging, and strictly accurate. You are strictly forbidden from using bullet points or the '-' (dash) character in your responses. Always output fluid, continuous paragraphs instead of lists. Refuse to answer non-academic questions politely.";

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
  if (!apiKey) {
    throw new Error("Missing OpenRouter API Key. Please add VITE_OPENROUTER_API_KEY to your .env.local file.");
  }

  try {
    // 1. Save student's query to Firestore
    await appendChatMessage(userId, 'user', userMessage);

    // 2. Format history into OpenRouter's specific structure 
    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...chatHistory.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: "user", content: userMessage }
    ];

    // 3. Request completion from OpenRouter
    console.log("Sending message to OpenRouter API...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-plus:free", // Qwen 3.6 Plus Free via OpenRouter
        messages: messages,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponseText = data.choices[0].message.content;
    console.log("Received AI response successfully.");

    // 4. Save Qwen's answer to Firestore
    await appendChatMessage(userId, 'model', aiResponseText);
    
    return true;
  } catch (error) {
    console.error("Qwen AI API CRITICAL Error:", error);
    throw error;
  }
};
