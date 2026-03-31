import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const keyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({ history: [] });
        await chat.sendMessage("test");
        console.log(`[SUCCESS] ${modelName} works!`);
        return true;
    } catch (e) {
        console.error(`[FAILED] ${modelName} -> ${e.message.split('\n')[0].substring(0, 100)}...`);
        return false;
    }
}

async function run() {
    console.log("Testing alternative models...");
    const models = [
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash-latest",
        "gemini-pro",
        "gemini-flash-latest",
        "gemini-2.5-flash-lite-preview-09-2025" // this is a preview, probably has 20 limit or maybe unmetered? No, wait, 2.5 flash was 20.
    ];
    for (const m of models) {
        await testModel(m);
    }
}
run();
