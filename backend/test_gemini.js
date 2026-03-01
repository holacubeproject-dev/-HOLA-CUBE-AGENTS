require('dotenv').config({ override: true });
const { GoogleGenAI } = require('@google/genai');

async function testGemini() {
    console.log("Testing with Key:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "MISSING");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const SYSTEM_PROMPT = `You are Agent CUBE. Reply with EXACTLY: "TEST SUCCESSFUL"`;
        const history = [{ role: 'user', parts: [{ text: "Hello AI" }] }];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            }
        });

        console.log("✅ Response:", response.text);
    } catch (err) {
        console.error("❌ Gemini Error Details:", err);
    }
}
testGemini();
