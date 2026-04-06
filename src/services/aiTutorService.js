import { db } from "@/Context/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API Key exists in the .env.local file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  // System Instructions explicitly limit the AI to MDCAT capabilities and formatting rules
  model = genAI.getGenerativeModel({
    model: "gemini-flash-latest", 
    systemInstruction: "You are the primary elite MDCAT Tutor for the MedQuest application. You must ONLY answer questions regarding Medical Sciences, Biology, Chemistry, and Physics. Be highly encouraging and strictly accurate. Please format your responses using markdown, including headings, bold text, and bullet points to break down complex topics clearly. Refuse to answer non-academic questions politely.",
  });
}

/**
 * Initializes a real-time listening connection to a user's Chat Sessions.
 */
export const subscribeToChatSessions = (userId, callback) => {
  if (!userId) return () => {};

  const sessionsRef = collection(db, "users", userId, "chatSessions");
  const q = query(sessionsRef, orderBy("updatedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    let sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Firestore Sessions synced! Count:", sessions.length);
    callback(sessions);
  }, (error) => {
    console.error("FIRESTORE SESSIONS LISTENER ERROR:", error);
  });
};

/**
 * Creates a new Chat Session for the user.
 */
export const createChatSession = async (userId, initialMessage) => {
  if (!userId) return null;
  const sessionsRef = collection(db, "users", userId, "chatSessions");
  const title = initialMessage.length > 30 ? initialMessage.substring(0, 30) + '...' : initialMessage;
  
  const docRef = await addDoc(sessionsRef, {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
};

/**
 * Initializes a real-time listening connection to a specific session's messages.
 */
export const subscribeToSessionMessages = (userId, sessionId, callback) => {
  if (!userId || !sessionId) return () => {};

  const messagesRef = collection(db, "users", userId, "chatSessions", sessionId, "messages");
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

    callback(msgs);
  }, (error) => {
    console.error("FIRESTORE MESSAGES LISTENER ERROR:", error);
  });
};

/**
 * Appends a new message directly to a specific chat session and updates the session's updatedAt timestamp.
 */
export const appendChatMessage = async (userId, sessionId, role, text) => {
  if (!userId || !sessionId) return;
  
  const messagesRef = collection(db, "users", userId, "chatSessions", sessionId, "messages");
  await addDoc(messagesRef, {
    role, // 'user' or 'model'
    text,
    timestamp: serverTimestamp()
  });

  // Update session's updatedAt
  const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
  await updateDoc(sessionRef, {
    updatedAt: serverTimestamp()
  });
};

/**
 * Interacts with the Gemini API to stream or fetch a complete response 
 * based on the student's prompt and past history.
 */
export const askAITutor = async (userId, sessionId, userMessage, chatHistory = []) => {
  if (!apiKey || !model) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env.local file.");
  }
  
  let currentSessionId = sessionId;
  if (!currentSessionId) {
    currentSessionId = await createChatSession(userId, userMessage);
  }

  try {
    // 1. Save student's query to Firestore
    await appendChatMessage(userId, currentSessionId, 'user', userMessage);

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
    await appendChatMessage(userId, currentSessionId, 'model', aiResponseText);
    
    return currentSessionId;
  } catch (error) {
    console.error("Gemini AI API CRITICAL Error:", error);
    throw error;
  }
};

/**
 * Ephemeral chat without saving to Firestore.
 */
export const askAITutorEphemeral = async (userMessage, chatHistory = []) => {
  if (!apiKey || !model) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env.local file.");
  }

  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const chatSession = model.startChat({
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI API CRITICAL Error:", error);
    throw error;
  }
};
