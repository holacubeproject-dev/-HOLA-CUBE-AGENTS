'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FloatingAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chat, setChat] = useState([
        { role: 'bot', text: 'Hi! I am the CUBE AI. I was built using this exact platform. How can I help you automate your business today?' }
    ]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const newChat = [...chat, { role: 'user', text: message }];
        setChat(newChat);
        setMessage('');
        setIsTyping(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newChat }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            setChat(prev => [...prev, {
                role: 'bot',
                text: data.text || 'Sorry, I encountered an error. Please try again later.'
            }]);
            toast.success('Agent responded instantly.', { icon: '🤖' });
        } catch (error) {
            console.error('Chat error:', error);
            setChat(prev => [...prev, { role: 'bot', text: 'Connection to AI core lost. Reconnecting...' }]);
            toast.error('AI Core offline', { icon: '🔌' });
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{
                            width: '350px',
                            height: '500px',
                            background: 'rgba(10, 15, 20, 0.85)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            borderRadius: '24px',
                            marginBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 10px 40px rgba(0, 240, 255, 0.15)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.2rem', background: 'linear-gradient(135deg, rgba(0,240,255,0.1), transparent)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,240,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f0ff' }}>
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>CUBE Support</h3>
                                    <div style={{ fontSize: '0.75rem', color: '#00ffaa', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div className="pulse-indicator status-online" style={{ width: '6px', height: '6px' }} /> Online
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {chat.map((msg, i) => (
                                <div key={i} style={{ alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                                    <div style={{
                                        background: msg.role === 'bot' ? 'rgba(0, 240, 255, 0.1)' : 'var(--cube-gradient)',
                                        border: msg.role === 'bot' ? '1px solid rgba(0, 240, 255, 0.2)' : 'none',
                                        padding: '0.8rem 1.2rem',
                                        borderRadius: msg.role === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5',
                                        boxShadow: msg.role === 'user' ? '0 4px 15px rgba(0, 240, 255, 0.3)' : 'none'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <p style={{ fontSize: '0.65rem', color: '#666', marginTop: '0.4rem', textAlign: msg.role === 'bot' ? 'left' : 'right' }}>
                                        {msg.role === 'bot' ? 'AI Agent' : 'You'} • Just now
                                    </p>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                                    <div style={{
                                        background: 'rgba(0, 240, 255, 0.1)',
                                        border: '1px solid rgba(0, 240, 255, 0.2)',
                                        padding: '0.8rem 1.2rem',
                                        borderRadius: '4px 16px 16px 16px',
                                        color: '#00f0ff',
                                        fontSize: '0.9rem',
                                    }}>
                                        <div className="typing-dots">
                                            <span>.</span><span>.</span><span>.</span>
                                        </div>
                                    </div>
                                    <style>{`
                                        .typing-dots span { animation: blink 1.4s infinite both; }
                                        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                                        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                                        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
                                    `}</style>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)' }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask me anything..."
                                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '0.8rem 1.2rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                            />
                            <button type="submit" style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--cube-gradient)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)' }}>
                                <Send size={16} style={{ marginLeft: '2px' }} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--cube-gradient)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(0, 240, 255, 0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Bot size={28} />
                    <div className="glow-effect" style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transition: 'all 0.5s ease', animation: 'sweep 3s infinite' }} />
                    <style>{`@keyframes sweep { 0% { left: -100% } 50% { left: 100% } 100% { left: 100% } }`}</style>
                </motion.button>
            )}
        </div>
    );
}
