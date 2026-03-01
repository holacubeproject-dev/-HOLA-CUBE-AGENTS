import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
// We initialize it inside the route to ensure it picks up the latest ENV variables
let ai = null;

export async function POST(req) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid message format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize here so it uses process.env.GEMINI_API_KEY
        if (!ai) {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return new Response(JSON.stringify({ error: 'Gemini API key not configured on server' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            ai = new GoogleGenAI({ apiKey: apiKey });
        }

        const systemInstruction = `You are the official Customer Support AI for HOLACUBEAGENTS. 
Your goal is to converse with potential clients visiting our SaaS website, answer their questions, and persuade them to buy the $100/month CUBE subscription.

Key Selling Points of CUBE:
- It connects directly to their WhatsApp Business via a simple QR code (No Meta Official API fees).
- It costs a flat $100/month (Cheaper than a human employee).
- It handles 10,000+ chats simultaneously.
- Response time under 0.8 seconds.
- They can train it by dragging and dropping PDFs or DOCX files into the dashboard.

Rules:
- Be exceedingly professional, concise, and helpful. 
- Use formatting (bolding, bullet points) sparingly for emphasis.
- If they ask for pricing, tell them it's $100/mo and urge them to click "Pricing" in the menu.
- Keep your answers short (1-3 sentences max) to simulate a fast live chat.
- Frame CUBE as the absolute elite solution for AI automation.`;

        // Format history for Gemini (excluding system prompt which we pass as an option)
        // We only pass the most recent history to keep it fast
        const chatHistory = messages.map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        // The user's newest message is the last one in the array
        const userPrompt = chatHistory.pop();

        if (!userPrompt) {
            return new Response(JSON.stringify({ error: 'No user message found' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Using standard non-streaming generation for simplicity in the Floating Agent
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [...chatHistory, userPrompt],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                maxOutputTokens: 250,
            }
        });

        const replyText = response.text || "I apologize, but my core processors are currently updating. Please try again in a moment.";

        return new Response(JSON.stringify({ text: replyText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Gemini API Error in /api/chat:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error computing AI response.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
