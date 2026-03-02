const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'conversations_db.json');
const USERS_DB_PATH = path.join(__dirname, 'users_db.json');

// Initialize database files if they don't exist, safely catching read-only errors
function initDB() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify({}), 'utf8');
            console.log('📁 Local Conversations DB initialized.');
        }
        if (!fs.existsSync(USERS_DB_PATH)) {
            fs.writeFileSync(USERS_DB_PATH, JSON.stringify([]), 'utf8');
            console.log('👤 Local Users DB initialized.');
        }
    } catch (err) {
        console.error('🚨 COULD NOT INITIALIZE DB FILES (Likely read-only filesystem):', err.message);
    }
}

// Read all conversations
function getAllConversations() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return {};
    }
}

// Get conversation history for a specific user
function getConversation(userId) {
    const db = getAllConversations();
    return db[userId] || [];
}

// Save a message (incoming or outgoing) to a user's history
function saveMessage(userId, messageData) {
    const db = getAllConversations();

    if (!db[userId]) {
        db[userId] = [];
    }

    // Add new message
    db[userId].push(messageData);

    // Write back to file
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing to DB:', error);
        return false;
    }
}

// --- USER AUTHENTICATION LOGIC ---

function getAllUsers() {
    try {
        const data = fs.readFileSync(USERS_DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading Users DB:', error);
        return [];
    }
}

function getUserByEmail(email) {
    const users = getAllUsers();
    return users.find(u => u.email === email);
}

// Create a new user with hashed password
async function createUser(email, plainPassword) {
    const users = getAllUsers();

    if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = {
        id: 'usr_' + Date.now(),
        email: email,
        password: hashedPassword,
        hasActiveSubscription: false, // Default to unpaid
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    try {
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
        return newUser;
    } catch (error) {
        console.error('Error writing to Users DB:', error);
        throw new Error('Failed to save user');
    }
}

// Update the user's subscription status (called by Stripe Webhook)
function updateUserSubscription(email, status) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        throw new Error('User not found');
    }

    users[userIndex].hasActiveSubscription = status;

    try {
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
        return users[userIndex];
    } catch (error) {
        console.error('Error updating Subscription status in DB:', error);
        throw new Error('Failed to update subscription');
    }
}

// Update the user's knowledge base (called when they upload a PDF/DOCX)
function updateUserKnowledge(email, knowledgeText) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        throw new Error('User not found');
    }

    users[userIndex].knowledgeBase = knowledgeText;

    try {
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
        return users[userIndex];
    } catch (error) {
        console.error('Error updating Knowledge Base in DB:', error);
        throw new Error('Failed to save knowledge base');
    }
}

module.exports = {
    initDB,
    getAllConversations,
    getConversation,
    saveMessage,
    getUserByEmail,
    getAllUsers,
    createUser,
    updateUserSubscription,
    updateUserKnowledge
};
