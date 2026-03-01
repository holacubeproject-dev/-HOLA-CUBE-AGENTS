'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon } from 'lucide-react';

const SCENARIOS = [
    {
        industry: "E-Commerce",
        messages: [
            { sender: 'user', text: "Hi! Do you still have the Alpha Jacket in size M?" },
            { sender: 'bot', text: "Hello Sarah! Yes, we have 3 units left in Size M.", product: { name: "Alpha Jacket (M)", price: "$120.00" } },
            { sender: 'user', text: "Yes please! Do you also have the matching gloves?" },
            { sender: 'bot', text: "Absolutely! If you add the Tactical Gloves now, I can apply a 15% bundle discount. I've created your secure checkout link:", link: "Pay via Stripe ➔" }
        ]
    },
    {
        industry: "Private Dental Clinic",
        messages: [
            { sender: 'user', text: "Hi, I need an urgent appointment for a toothache." },
            { sender: 'bot', text: "Hello David. I'm sorry to hear that. I checked our calendar and Dr. Miller has an emergency slot today at 4:30 PM." },
            { sender: 'bot', text: "Does your MetLife insurance cover emergency extractions?" },
            { sender: 'user', text: "Yes, it should. Can you book that 4:30 slot?" },
            { sender: 'bot', text: "Your appointment is confirmed for today at 4:30 PM. I've sent the intake forms to your email so you don't have to wait in the lobby. See you soon!" }
        ]
    },
    {
        industry: "Luxury Real Estate",
        messages: [
            { sender: 'user', text: "Is the penthouse on 5th Ave still available?" },
            { sender: 'bot', text: "Good evening! Yes, the 5th Ave Penthouse is currently accepting viewings for pre-qualified buyers. Asking price is $4.5M." },
            { sender: 'user', text: "Can I schedule a viewing for this Saturday morning?" },
            { sender: 'bot', text: "I have Saturday at 10:00 AM available. Before I lock it in, could you upload your proof of funds document here in the chat?" }
        ]
    }
];

export default function ChatSimulator() {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [displayedMessages, setDisplayedMessages] = useState([]);
    const scrollRef = useRef(null);

    const currentScenario = SCENARIOS[scenarioIndex];

    useEffect(() => {
        // Reset conversation when scenario changes
        setDisplayedMessages([]);
        setMessageIndex(0);
    }, [scenarioIndex]);

    useEffect(() => {
        if (messageIndex < currentScenario.messages.length) {
            const nextMessage = currentScenario.messages[messageIndex];
            const isBot = nextMessage.sender === 'bot';

            const typingDelay = isBot ? 1500 + Math.random() * 1000 : 800; // Fake typing time
            const readDelay = isBot ? 500 : 1500; // Time before start typing

            const sequence = setTimeout(() => {
                setIsTyping(isBot);

                setTimeout(() => {
                    setIsTyping(false);
                    setDisplayedMessages(prev => [...prev, nextMessage]);
                    setMessageIndex(prev => prev + 1);
                }, typingDelay);

            }, readDelay);

            return () => clearTimeout(sequence);
        } else {
            // Scenario finished, wait a bit then loop to next
            const loopTimeout = setTimeout(() => {
                setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
            }, 5000); // Wait 5 seconds before switching
            return () => clearTimeout(loopTimeout);
        }
    }, [messageIndex, currentScenario]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayedMessages, isTyping]);


    return (
        <div style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '1rem', width: '100%', maxWidth: '400px', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(0, 240, 255, 0.25)', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>

            {/* Phone Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', right: 0, background: 'rgba(0, 240, 255, 0.1)', color: 'var(--cube-accent)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                    Simulation: {currentScenario.industry}
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cube-primary), var(--cube-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hexagon size={20} color="#fff" />
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>Agent CUBE</div>
                    <div style={{ fontSize: '0.8rem', color: '#00ff88' }}>● Online instantly</div>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div ref={scrollRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '420px', overflowY: 'auto', position: 'relative', paddingRight: '0.5rem', scrollbarWidth: 'none', scrollBehavior: 'smooth' }}>

                <AnimatePresence initial={false}>
                    {displayedMessages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            style={{
                                alignSelf: msg.sender === 'bot' ? 'flex-end' : 'flex-start',
                                background: msg.sender === 'bot' ? 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,0,0,0))' : 'rgba(255,255,255,0.05)',
                                padding: '1rem',
                                borderRadius: msg.sender === 'bot' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                border: msg.sender === 'bot' ? '1px solid rgba(0,240,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                maxWidth: '90%'
                            }}
                        >
                            <p style={{ fontSize: '0.9rem', color: msg.sender === 'bot' ? '#fff' : '#eaeaea' }}>
                                {msg.text}
                            </p>

                            {/* Special Payload: Product */}
                            {msg.product && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{msg.product.name}</span>
                                    <span style={{ color: 'var(--cube-accent)' }}>{msg.product.price}</span>
                                </div>
                            )}

                            {/* Special Payload: Link */}
                            {msg.link && (
                                <a href="#" style={{ display: 'block', marginTop: '0.8rem', padding: '0.8rem', background: 'var(--cube-primary)', color: '#fff', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    {msg.link}
                                </a>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center', paddingLeft: '0.5rem', paddingTop: '0.5rem' }}
                    >
                        <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cube-primary)' }} />
                        <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cube-primary)', animationDelay: '0.2s' }} />
                        <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cube-primary)', animationDelay: '0.4s' }} />
                    </motion.div>
                )}

            </div>

            {/* Chat Input Faker */}
            <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Type a message...</span>
                <span style={{ color: 'var(--cube-primary)', fontSize: '1.2rem' }}>➤</span>
            </div>
        </div>
    );
}
