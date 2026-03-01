"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Crown, Rocket, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    const plans = [
        {
            name: "STARTER",
            duration: "2 Weeks",
            price: "$50",
            icon: <Zap className="w-8 h-8 text-cyan-400" />,
            features: [
                "1 AI WhatsApp Agent",
                "Advanced B2B Prompting",
                "Real-time CRM Access",
                "14 Days of Full Autonomy"
            ],
            color: "#00f0ff",
            glow: "bg-glow-cyan",
            priceId: "price_1T60szFtZRmjlJORWq2K4OId"
        },
        {
            name: "PROFESSIONAL",
            duration: "1 Month",
            price: "$100",
            icon: <Shield className="w-8 h-8 text-pink-400" />,
            features: [
                "1 AI WhatsApp Agent",
                "Unlimited Context Memory",
                "Real-time CRM Console",
                "30 Days of Elite Sales",
                "Priority Email Support"
            ],
            color: "#ff007f",
            glow: "bg-glow-pink",
            popular: true,
            priceId: "price_1T60szFtZRmjlJOR71L4i9b1"
        },
        {
            name: "BUSINESS",
            duration: "2 Months",
            price: "$150",
            icon: <Rocket className="w-8 h-8 text-purple-400" />,
            features: [
                "Everything in Professional",
                "Extended Operating Time",
                "60 Days Content History",
                "Save $50 instantly",
                "24/7 Priority Support"
            ],
            color: "#a855f7",
            glow: "bg-glow-purple",
            priceId: "price_1T60t0FtZRmjlJORke60pScf"
        },
        {
            name: "ENTERPRISE",
            duration: "6 Months",
            price: "$400",
            icon: <Crown className="w-8 h-8 text-yellow-400" />,
            features: [
                "Everything in Business",
                "Half-Year of Zero Friction",
                "Save $200 instantly",
                "VIP Custom Prompts Setup",
                "Direct Developer Access"
            ],
            color: "#fbbf24",
            glow: "bg-glow-yellow",
            priceId: "price_1T60t1FtZRmjlJORAgPmEt2A"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
    };

    const handleCheckout = async (priceId) => {
        try {
            const token = localStorage.getItem('cube_token');
            if (!token) {
                window.location.href = '/auth/login';
                return;
            }

            // Fetch authenticated user's email
            const res = await fetch('http://localhost:3001/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!data.user) {
                alert("Session expired. Please log in again.");
                window.location.href = '/auth/login';
                return;
            }

            // Create secure Stripe Checkout Session
            const checkoutRes = await fetch('http://localhost:3001/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, email: data.user.email })
            });

            const checkoutData = await checkoutRes.json();

            if (checkoutData.url) {
                window.location.href = checkoutData.url; // Redirect to Apple Pay / Card form
            } else {
                console.error(checkoutData.error);
                alert("Checkout initialization failed. Check console or API Keys.");
            }
        } catch (error) {
            console.error("Payment gateway error:", error);
            alert("Payment gateway error. Ensure backend is running.");
        }
    };

    return (
        <>
            {/* Background Ambience */}
            <div className="bg-glow-cyan" style={{ top: '10%', left: '20%' }} />
            <div className="bg-glow-pink" style={{ bottom: '10%', right: '20%' }} />

            <div className="pricing-container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="pricing-title-area"
                >
                    <h1 className="pricing-title">
                        SELECT YOUR <span style={{ color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>POWER</span>
                    </h1>
                    <p className="pricing-subtitle">
                        Your account is verified. To deploy your AI WhatsApp Agent, initialize a processing plan.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="pricing-grid"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            variants={itemVariants}
                            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                            style={{ '--card-color': plan.color }}
                        >
                            <div className="card-bg-glow" />

                            {plan.popular && (
                                <div className="popular-badge">MOST POPULAR</div>
                            )}

                            <div className="pricing-header">
                                {plan.icon}
                                <span className="pricing-name">{plan.name}</span>
                            </div>

                            <div className="pricing-price-area">
                                <span className="pricing-price">{plan.price}</span>
                                <span className="pricing-duration">/ {plan.duration.toLowerCase()}</span>
                                <p className="pricing-desc">
                                    Direct AI integration to WhatsApp API via ultra-fast local socket architecture.
                                </p>
                            </div>

                            <ul className="pricing-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <CheckCircle2 size={18} style={{ color: plan.color }} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`pricing-btn ${plan.popular ? 'popular' : ''}`}
                                onClick={() => handleCheckout(plan.priceId)}
                            >
                                INITIALIZE {plan.duration.toUpperCase()}
                            </button>
                        </motion.div>
                    ))}
                </motion.div>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button
                        onClick={() => window.location.href = '/dashboard/welcome'}
                        style={{ color: '#71717a', fontSize: '0.9rem', backgroundColor: 'transparent', border: 'none' }}
                        className="link-underline"
                    >
                        Skip for now, explore Dashboard
                    </button>
                </div>
            </div>
        </>
    );
}
