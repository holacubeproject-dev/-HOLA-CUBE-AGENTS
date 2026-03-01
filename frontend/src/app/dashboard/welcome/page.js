"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Database, BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WelcomeDashboardPage() {

    useEffect(() => {
        // Enforce Authentication
        const token = localStorage.getItem('cube_token');
        if (!token) {
            window.location.href = '/auth/login';
        }
    }, []);

    const features = [
        {
            icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />,
            title: "The Agent Admin",
            description: "Your AI WhatsApp bot is ready to be deployed. In the dashboard, you will link your business number via QR Code and the bot will take over."
        },
        {
            icon: <Database className="w-8 h-8 text-pink-400" />,
            title: "CRM Storage Expanded",
            description: "A secure live database has been provisioned to store your customer chats. You can monitor the AI's conversations in real-time."
        },
        {
            icon: <Shield className="w-8 h-8 text-purple-400" />,
            title: "Military-Grade Security",
            description: "Your session is protected with 2FA and JWT architecture. No Meta API fees, completely sovereign local environment."
        }
    ];

    return (
        <div className="welcome-container">
            {/* Background Ambience */}
            <div className="bg-glow-cyan" style={{ top: '25%', left: '25%', width: '600px', height: '600px' }} />
            <div className="bg-glow-purple" style={{ bottom: '25%', right: '25%', width: '600px', height: '600px' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="welcome-panel"
            >
                <div className="welcome-header">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <div className="welcome-icon-wrap">
                            <Sparkles size={48} />
                        </div>
                        <h1 className="welcome-title">
                            WORKSPACE <span style={{ color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>INITIALIZED</span>
                        </h1>
                        <p className="welcome-subtitle">
                            Welcome to your CUBE Agent Administration Sandbox. Your account has successfully been verified and provisioned.
                        </p>
                    </motion.div>
                </div>

                <div className="welcome-grid">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1), duration: 0.6 }}
                            className="welcome-feature"
                        >
                            <div className="welcome-feature-icon">{item.icon}</div>
                            <h3 className="welcome-feature-title">{item.title}</h3>
                            <p className="welcome-feature-desc">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="welcome-actions"
                >
                    <Link href="/dashboard/crm" className="btn-welcome-primary">
                        ENTER AGENT CONSOLE <ArrowRight size={20} />
                    </Link>
                    <Link href="/pricing" className="btn-welcome-secondary">
                        UPGRADE PLAN
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
