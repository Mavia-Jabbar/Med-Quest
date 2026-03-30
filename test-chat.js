import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const keyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a pirate."
        });
        
        // Simulating the user's flawed history array scenario:
        const brokenHistory = [
            { role: 'user', parts: [{ text: "Hello" }] },
            { role: 'user', parts: [{ text: "Are you there?" }] } // TWO USERS IN A ROW
        ];

        console.log("Starting chat with broken history...");
        const chat = model.startChat({ history: brokenHistory });
        await chat.sendMessage("Ahoy!");
        console.log("Success!");
    } catch (e) {
        console.error("SDK ERROR:", e.message);
    }
}
run();
