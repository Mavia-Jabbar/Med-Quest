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
        });
        console.log("Model requested, sending chat...");
        
        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage("Hello there!");
        console.log("RESPONSE RECEIVED:");
        console.log(result.response.text());
        
    } catch (e) {
        console.error("FAILED! ERROR:");
        console.error(e.message);
    }
}

run();
