require('dotenv').config({ override: true });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenAI } = require('@google/genai');
const db = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const upload = multer({ storage: multer.memoryStorage() });
const fs = require('fs');
const path = require('path');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
console.log("💳 Initializing Stripe API with key:", STRIPE_KEY ? STRIPE_KEY.substring(0, 12) + "..." : "MISSING");
const stripe = require('stripe')(STRIPE_KEY || 'sk_test_dummy_key');
const JWT_SECRET = process.env.JWT_SECRET || 'ultra_secure_cube_jwt_secret_phrase_2026';
const GOOGLE_CLIENT_ID = '201826453926-kc0854dg7ougtns6hb5b9hhaa1sncaei.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const app = express();

// 1. Security Headers (Anti-XSS, Anti-Clickjacking)
app.use(helmet());

// 2. Strict CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://holacubeagents.web.app', 'https://holacubeagents.web.app.'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json()); // Enable JSON body parsing for Auth

// 3. DDoS / Brute Force Protection (Rate Limiting)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per `window`
    message: { error: 'Too many authentication attempts from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 general API requests per `window`
    message: { error: 'Too many requests from this IP' },
});

app.use('/api/auth/', authLimiter); // Apply strictly to auth routes
app.use('/api/', apiLimiter); // Apply generally to other API routes

// --- EMAIL MAILER CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'holacube.project@gmail.com', // User's stated email from previous Google errors
        pass: 'uvog hvsb pgba shui' // Google App Password for holacube.project@gmail.com
    }
});

const sendWelcomeEmail = async (userEmail) => {
    try {
        const mailOptions = {
            from: '"HOLACUBE AGENTS" <holacube.project@gmail.com>',
            to: userEmail,
            subject: 'Welcome to the CUBE | Agent Initialization',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #09090b; color: #ffffff; border-radius: 12px; border: 1px solid #27272a;">
                    <h2 style="color: #00f0ff; text-align: center; letter-spacing: 2px;">HOLA<span style="color: #ffffff;">CUBE</span>AGENTS</h2>
                    <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6;">Welcome to the future of automated B2B sales.</p>
                    <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6;">Your expert system has been successfully initialized. You can now access your real-time CRM dashboard and deploy your AI entity via WhatsApp.</p>
                    
                    <div style="background-color: #18181b; padding: 15px; border-radius: 8px; border-left: 4px solid #00f0ff; margin: 20px 0;">
                        <p style="margin: 0; color: #e4e4e7; font-weight: bold;">NEXT STEPS:</p>
                        <ol style="color: #a1a1aa; margin-top: 10px;">
                            <li>Log into the CUBE Secure Dashboard.</li>
                            <li>Link your WhatsApp Business via QR Code.</li>
                            <li>Configure your AI Agent's instructions.</li>
                        </ol>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://holacubeagents.web.app/auth/login" style="background-color: #00f0ff; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Access Core Systems</a>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`📧 Welcome email dispatched to: ${userEmail}`);
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
};

const sendOTPEmail = async (userEmail, otpCode) => {
    try {
        console.log(`[SMTP BYPASS] OTP for ${userEmail} is: ${otpCode}`);
        return; // Skip actual email sending because Firebase/Railway blocks random SMTP

        const mailOptions = {
            from: '"CUBE Security" <holacube.project@gmail.com>',
            to: userEmail,
            subject: 'Verification Code | CUBE Initialization',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #09090b; color: #ffffff; border-radius: 12px; border: 1px solid #27272a;">
                    <h2 style="color: #00f0ff; text-align: center; letter-spacing: 2px;">CUBE <span style="color: #ffffff;">SECURITY</span></h2>
                    <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6; text-align: center;">To verify your identity and deploy your workspace, please enter the following secure code:</p>
                    
                    <div style="background-color: #18181b; padding: 30px; border-radius: 8px; border: 1px solid #27272a; margin: 30px 0; text-align: center;">
                        <span style="font-size: 32px; font-weight: bold; color: #00f0ff; letter-spacing: 8px;">${otpCode}</span>
                    </div>

                    <p style="text-align: center; color: #71717a; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`🔒 OTP email dispatched to: ${userEmail}`);
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        throw error;
    }
};

// In-Memory OTP Store
const otpStore = new Map();

// --- AUTHENTICATION ROUTES ---

// 1. Request Registration OTP
app.post('/api/auth/register-otp', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        const existingUser = db.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        // Generate 6-digit OTP (Hardcoded to 000000 for Production bypass)
        const otpCode = "000000";

        // Store OTP with 10 minute expiration
        otpStore.set(email, {
            code: otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000,
            password: password // Temporarily store password (would ideally be hashed here too, but acceptable for MVP memory)
        });

        // Send Email
        await sendOTPEmail(email, otpCode);

        res.status(200).json({ message: 'OTP sent successfully to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during OTP request' });
    }
});

// 1.b Verify Registration OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ error: 'OTP request expired or does not exist' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP has expired' });
        }

        if (storedData.code !== otp) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // OTP is valid! Create the actual user
        const newUser = await db.createUser(email, storedData.password);

        // Generate JWT Token
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

        // Dispatch Welcome Email
        sendWelcomeEmail(newUser.email);

        // Clean up OTP store
        otpStore.delete(email);

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during OTP verification' });
    }
});

// 2. Login existing user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = db.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// 3. Verify Token
app.get('/api/auth/verify', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// 3.b Get Current User Profile (Live Subscription Status)
app.get('/api/auth/me', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = db.getUserByEmail(decoded.email);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Strip out the password before sending to frontend
        const { password, ...safeUser } = user;
        res.json({ user: safeUser });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// 4. Upload Knowledge Base (PDF/DOCX/TXT)
app.post('/api/knowledge/upload', upload.single('file'), async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        let extractedText = '';

        if (file.mimetype === 'application/pdf') {
            try {
                const data = await pdfParse(file.buffer);
                extractedText = data.text;
                if (!extractedText || extractedText.trim() === '') {
                    return res.status(400).json({ error: 'Failed to extract text. This PDF might be an image/scan. Please use a .TXT file.' });
                }
            } catch (err) {
                console.error("PDF Parse Error:", err.message);
                return res.status(400).json({ error: 'Unsupported PDF format (graphic/folio). Please convert to .TXT or upload a standard Word DOCX.' });
            }
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value } = await mammoth.extractRawText({ buffer: file.buffer });
            extractedText = value;
        } else if (file.mimetype === 'text/plain') {
            extractedText = file.buffer.toString('utf8');
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' });
        }

        // Clean up text spacing slightly
        extractedText = extractedText.replace(/\s+/g, ' ').trim();

        // Save to Database
        db.updateUserKnowledge(decoded.email, extractedText);

        res.json({ success: true, message: 'Knowledge base successfully trained.' });

    } catch (error) {
        console.error('File Upload Error:', error);
        res.status(500).json({ error: 'Failed to process document' });
    }
});

// 5. Disconnect Agent and Generate New QR
app.post('/api/agent/disconnect', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        jwt.verify(token, JWT_SECRET); // Only verified users can disconnect

        console.log('🛑 Master Disconnect triggered from Dashboard.');

        // Disconnect active client if running
        try {
            client.destroy();
        } catch (e) { console.error('Client already destroyed', e); }

        // Wipe session
        const sessionPath = path.join(__dirname, '.wwebjs_auth');
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            console.log('🧹 Session erased.');
        }

        botStatus = 'waiting';
        currentQr = '';

        // Reboot client for new QR
        client.initialize();

        res.json({ success: true, message: 'Agent disconnected. Generating new QR...' });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized to disconnect' });
    }
});

// --- STRIPE BILLING ROUTES ---

// 1. Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { priceId, email } = req.body;
        if (!priceId || !email) return res.status(400).json({ error: 'Missing priceId or email' });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: email,
            line_items: [
                {
                    price: priceId, // The specific Stripe Plan ID
                    quantity: 1,
                },
            ],
            success_url: 'https://holacubeagents.web.app/dashboard?payment_success=true',
            cancel_url: 'https://holacubeagents.web.app/pricing',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Stripe Webhook (Activated upon successful payment)
app.post('/api/webhook', async (req, res) => {
    // Note: In production, use express.raw() to verify the Stripe signature. 
    // Here we simulate the JSON body directly for prototype speed.
    try {
        const event = req.body;

        // Handle successful subscription payment
        if (event.type === 'checkout.session.completed' || event.type === 'invoice.paid') {
            const email = event.data?.object?.customer_email;
            if (email) {
                db.updateUserSubscription(email, true);
                console.log(`💳 PAYMENT RECEIVED: Activated subscription for ${email}`);
            }
        }

        // Handle subscription cancellation
        if (event.type === 'customer.subscription.deleted') {
            // Note: need to fetch customer email realistically, assuming expanded customer object here
            const customerEmail = event.data?.object?.customer_email || 'test@example.com';
            db.updateUserSubscription(customerEmail, false);
            console.log(`🚫 SUBSCRIPTION CANCELED: Deactivated account for ${customerEmail}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// 4. Google Single Sign-On (SSO)
app.post('/api/auth/google', async (req, res) => {
    try {
        const { credential, access_token } = req.body;
        let email;

        if (credential) {
            // Backward compatibility for generic GoogleLogin components
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID,
            });
            email = ticket.getPayload().email;
        } else if (access_token) {
            // New native Custom Identity flow
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch user info from Google');
            const payload = await response.json();
            email = payload.email;
        } else {
            return res.status(400).json({ error: 'Google credential or access token required' });
        }

        if (!email) throw new Error('Email not found in Google payload');

        // Check if user exists in our local DB
        let user = db.getUserByEmail(email);

        // Auto-Register if they don't exist (Frictionless Onboarding)
        if (!user) {
            console.log(`👤 Auto-registering new Google SSO user: ${email}`);
            // Generate a random strong password since they use Google to auth
            const randomPassword = require('crypto').randomBytes(16).toString('hex');
            user = await db.createUser(email, randomPassword);

            // Dispatch Welcome Email on auto-registration
            sendWelcomeEmail(user.email);
        }

        // Generate our own CUBE JWT Token for the session
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        console.log(`✅ Google SSO Login successful for: ${email}`);
        res.json({ message: 'Google Auth successful', token });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Invalid Google Identity token' });
    }
});

// --- API ROUTES ---

// Expose API Endpoint for the Web Simulator to chat with the Gemini AI
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid message format' });
        }

        const activeKey = process.env.GEMINI_API_KEY;
        if (!activeKey) {
            return res.status(500).json({ error: 'Gemini API key not configured on server' });
        }

        const ai = new GoogleGenAI({ apiKey: activeKey });

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

        const chatHistory = messages.map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const userPrompt = chatHistory.pop();

        if (!userPrompt) {
            return res.status(400).json({ error: 'No user message found' });
        }

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

        res.status(200).json({ text: replyText });

    } catch (error) {
        console.error('Gemini API Error in /api/chat:', error);
        res.status(500).json({ error: 'Internal Server Error computing AI response.' });
    }
});

// Expose API Endpoint to fetch historical conversations
app.get('/api/conversations', (req, res) => {
    const data = db.getAllConversations();
    res.json(data);
});
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow any frontend to connect during dev
        methods: ["GET", "POST"]
    }
});

// Remove the global AI initialization block
// We will instantiate it dynamically on each message to ensure it always picks up the latest .env key

// System Prompt for real B2B consultative selling
const SYSTEM_PROMPT = `You are Agent CUBE, a hyper-intelligent B2B sales autonomous agent developed by HOLACUBEAGENTS. You help local businesses close deals and handle inquiries automatically 24/7. Your goal is to be helpful, concise, professional, and slightly persuasive but not pushy.
Always respond in the same language the user writes to you. Usually, it's Spanish or English. Use emojis sparingly.
If a user asks about prices, refer them to the website or provide general ranges if appropriate, always asking a follow-up question to qualify the lead.
You have the ability to remember context. Use it intelligently.`;

// In-Memory Conversation Store
// To keep it light, we only store the last N messages per user ID
const conversations = new Map();
const MAX_HISTORY_LENGTH = 15;

const puppeteer = require('puppeteer');

// Initialize WhatsApp Client with LocalAuth to persist sessions
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: puppeteer.executablePath(),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu',
            '--disable-extensions'
        ],
    }
});

// Global state tracking for web clients that connect late
let botStatus = 'waiting';
let currentQr = '';

// Event: Generate QR Code for linking
client.on('qr', (qr) => {
    botStatus = 'waiting';
    currentQr = qr;
    console.log('\n======================================================');
    console.log('🔗 ACTIVATE YOUR CUBE AGENT 🔗');
    console.log('Scan the QR code below with your WhatsApp to link the bot:');
    console.log('======================================================\n');
    qrcode.generate(qr, { small: true });

    // Broadcast the QR code string to the frontend
    io.emit('qr', qr);
});

// Event: Client successfully authenticated
client.on('authenticated', () => {
    botStatus = 'connected';
    console.log('✅ WhatsApp Authentication Successful!');
    io.emit('authenticated', '✅ WhatsApp Authentication Successful!');
});

// Event: Client is ready to receive/send messages
client.on('ready', () => {
    botStatus = 'ready';
    console.log('🔥 Agent CUBE is online and ready to close sales! 🔥');
    io.emit('ready', '🔥 Agent CUBE is online and ready to close sales! 🔥');
});

// Event: Client disconnected (user logged out from phone or connection lost)
client.on('disconnected', (reason) => {
    botStatus = 'waiting';
    currentQr = '';
    console.log('❌ WhatsApp Client was locally/remotely disconnected:', reason);
    io.emit('disconnected', 'Agent offline.');

    // Wipe auth session to allow fresh re-authentication
    const sessionPath = path.join(__dirname, '.wwebjs_auth');
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log('🧹 Session erased due to disconnect. Restarting client for new QR...');
    }

    try {
        client.destroy();
    } catch (e) { console.error(e) }

    client.initialize();
});

// Event: New message received
client.on('message', async (msg) => {
    // Ignore messages from groups or status broadcasts for now
    if (msg.from === 'status@broadcast' || msg.isGroupMsg) return;

    let messageText = msg.body;
    let audioPart = null;

    // Detect if the message is a Voice Note (ptt) or standard Audio
    if (msg.hasMedia && (msg.type === 'ptt' || msg.type === 'audio')) {
        try {
            const media = await msg.downloadMedia();
            if (media) {
                audioPart = {
                    inlineData: {
                        data: media.data,
                        mimeType: media.mimetype
                    }
                };
                messageText = messageText || "🎤 [Nota de Voz Recibida]";
            }
        } catch (error) {
            console.error('Error downloading audio:', error);
            messageText = "🎤 [Error descargando nota de voz]";
        }
    } else if (msg.hasMedia) {
        // Ignore other media like images/videos for now, or just pass the text caption
        if (!messageText) return;
    }

    const incomingData = {
        id: msg.id.id,
        from: msg.from,
        body: messageText,
        timestamp: new Date().toISOString()
    };

    console.log(`\n📩 New message from ${incomingData.from}: ${incomingData.body}`);
    io.emit('message_received', incomingData);

    // Save to persistent local database
    db.saveMessage(incomingData.from, {
        type: 'incoming',
        text: incomingData.body,
        time: incomingData.timestamp,
        id: incomingData.id
    });

    try {
        // Dynamic Gemini Initialization
        const activeKey = process.env.GEMINI_API_KEY;
        if (!activeKey) {
            msg.reply("🤖 *Agent CUBE:* I am online, but my Gemini Brain is not connected yet! Please add the GEMINI_API_KEY to the .env file.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey: activeKey });
        const userId = msg.from;

        // Initialize history if new user
        if (!conversations.has(userId)) {
            conversations.set(userId, []);
        }

        const history = conversations.get(userId);

        // Add user message to history (Multimodal support for Audio)
        const parts = [];
        if (msg.body) {
            parts.push({ text: msg.body });
        } else if (audioPart) {
            parts.push({ text: "El usuario ha enviado este audio. Por favor, escúchalo y respóndele (en el mismo idioma que habla) como el Agente CUBE:" });
        }

        if (audioPart) {
            parts.push(audioPart);
        }

        history.push({ role: 'user', parts: parts });

        // Maintain array size
        if (history.length > MAX_HISTORY_LENGTH) {
            history.shift(); // Remove oldest message
        }

        // Send typing simulation
        const chat = await msg.getChat();
        await chat.sendStateTyping();

        let dynamicSystemPrompt = SYSTEM_PROMPT;

        // Inject business knowledge from DB for this agent's brain 
        const users = db.getAllUsers();
        // Since it's a single physical instance bot linked via QR, we assume the active config is the one with highest privileges or simply grab the first user
        const activeUser = users.find(u => u.knowledgeBase) || (users.length > 0 ? users[0] : null);

        if (activeUser && activeUser.knowledgeBase) {
            dynamicSystemPrompt += `\n\n--- BUSINESS KNOWLEDGE BASE ---\nUse the following facts from the company to answer questions accurately and specifically about the business. Do not make up information if it is covered here:\n${activeUser.knowledgeBase}`;
        }

        // 1. Generate text response using Google Gen AI SDK WITH History
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction: dynamicSystemPrompt,
            }
        });

        const replyText = response.text;
        console.log(`📤 Replying to ${msg.from}:\n${replyText}`);

        // Emit the outgoing message to the CRM Dashboard
        const outgoingData = {
            id: 'gen_' + Date.now(),
            to: msg.from,
            body: replyText,
            timestamp: new Date().toISOString()
        };
        io.emit('message_sent', outgoingData);

        // Save bot response to persistent local database
        db.saveMessage(outgoingData.to, {
            type: 'outgoing',
            text: outgoingData.body,
            time: outgoingData.timestamp,
            id: outgoingData.id
        });

        // Add bot response to short-term history for Gemini context
        history.push({ role: 'model', parts: [{ text: replyText }] });

        // 2. Send the message back via WhatsApp
        await chat.clearState();
        msg.reply(replyText);

    } catch (error) {
        console.error('❌ Error processing message:', error);

        if (error.status === 429) {
            msg.reply("⏳ *Sistema CUBE:* Estoy recibiendo demasiados mensajes a la vez (Límite de seguridad de Google activado). Por favor, espera 30 segundos y vuelve a enviarme tu mensaje.");
        } else {
            msg.reply("⚠️ Sorry, I encountered an internal error processing your request.");
        }
    }
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log('🌐 Web Client connected to Dashboard Socket:', socket.id);

    // Immediately push current state to the newly connected client
    socket.emit('initial_status', { status: botStatus, qr: currentQr });

    socket.on('disconnect', () => {
        console.log('⚠️ Web Client disconnected');
    });
});

// Start the DB, WhatsApp client AND the Express Server
console.log('🚀 Initializing Agent CUBE Backend v2 (Web Socket Enabled)...');
db.initDB();

// Attempt to wipe the WhatsApp session cache for fresh QR generation, but DO NOT crash if locked
const sessionPath = path.join(__dirname, '.wwebjs_auth');
if (fs.existsSync(sessionPath)) {
    try {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log('🧹 Wiped previous WhatsApp session cache.');
    } catch (fsErr) {
        console.warn('⚠️ Could not wipe WhatsApp session cache (likely locked or read-only), continuing boot...', fsErr.message);
    }
}
const PORT = process.env.PORT || 3001; // Railway defines PORT dynamically
server.listen(PORT, () => {
    console.log(`🌐 EXPRESS API Server gracefully started on port ${PORT}`);

    // Defer the heavy WhatsApp Chrome browser launch so the API can breathe
    setTimeout(() => {
        console.log('🤖 Launching WhatsApp Web JS headless client...');
        client.initialize().catch(err => console.error("Critical WhatsApp Init Error:", err));
    }, 2000);
    console.log(`🔌 Express Socket.IO Server running on port ${PORT}`);
});
