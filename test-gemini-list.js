import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKey = envFile.match(/VITE_GEMINI_API_KEY=(.*)/)[1].trim();
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        console.log("AVAILABLE MODELS FOR CHAT:");
        generateModels.forEach(m => console.log(m.name));
    } catch (e) {
        console.error("ERROR", e.message);
    }
}
run();
