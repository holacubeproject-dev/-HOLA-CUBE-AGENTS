'use client';

import { motion } from 'framer-motion';

export default function AgentRental() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <main style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', paddingTop: '120px' }}>
            {/* Hero Section */}
            <section className="container" style={{ paddingBottom: '4rem' }}>
                <motion.div
                    initial="hidden" animate="visible" variants={containerVariants}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}
                >
                    <motion.div variants={itemVariants} style={{ display: 'inline-block', padding: '0.6rem 1.2rem', background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '100px', color: 'var(--cube-accent)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: '0.05em' }}>
                        ENTERPRISE AI RENTAL
                    </motion.div>
                    <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', marginBottom: '1.5rem', lineHeight: '1', letterSpacing: '-0.03em' }}>
                        The Ultimate <br /> <span style={{ color: 'var(--cube-primary)' }}>Digital Autonomous Employee.</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', color: '#a1a1aa', lineHeight: '1.6' }}>
                        Engineered to eliminate human latency in customer service. Deploy an algorithmic worker that processes infinite WhatsApp streams, recalls historical client data, and drives automated sales 24/7/365 without commission.
                    </motion.p>
                </motion.div>
            </section>

            {/* Deep Technical Capabilities */}
            <section className="container" style={{ paddingBottom: '8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <motion.div className="glass-panel" style={{ padding: '4rem' }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div style={{ color: 'var(--cube-primary)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em' }}>01 / ARCHITECTURE</div>
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Direct WhatsApp Emulation Core.</h3>
                        <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            We bypass the restrictive Meta Business API. Our system utilizes a localized QR-bridge protocol (whatsapp-web.js), meaning your AI operates directly from your hardware instance. Zero per-message fees. Zero Meta intervention. Complete autonomy.
                        </p>
                    </motion.div>

                    <motion.div className="glass-panel" style={{ padding: '4rem' }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <div style={{ color: 'var(--cube-accent)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em' }}>02 / INGESTION</div>
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Neural Brand Synthetization.</h3>
                        <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            The AI is not a generic chatbot. Within 3 minutes of uploading your URLs, PDF menus, or CRM data, our Large Language Model maps your entire business logic. It learns your pricing, tone of voice, and exact policies to respond like a senior sales director.
                        </p>
                    </motion.div>

                    <motion.div className="glass-panel" style={{ padding: '4rem', gridColumn: '1 / -1', display: 'flex', gap: '4rem', alignItems: 'center' }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: '#8a2be2', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em' }}>03 / MEMORY</div>
                            <h3 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Persistent Contextual Threading.</h3>
                            <p style={{ color: '#ccc', fontSize: '1.15rem', lineHeight: '1.8' }}>
                                A standard bot forgets everything after 5 minutes. The HOLACUBE Agent utilizes persistent vector databases to track conversational history. If a client asks a question today, the AI will remember their name, problem, and order constraints next week. It is indistinguishable from a hyper-competent human.
                            </p>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '3rem', border: '1px solid rgba(138,43,226,0.2)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px 12px 12px 0', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ color: '#fff', fontSize: '0.9rem' }}>"Hi, I was here last month asking about the enterprise plan. Do you still have the discount?"</p>
                                </div>
                                <div style={{ background: 'rgba(138,43,226,0.15)', padding: '1.5rem', borderRadius: '12px 12px 0 12px', border: '1px solid rgba(138,43,226,0.3)', alignSelf: 'flex-end', textAlign: 'right' }}>
                                    <p style={{ color: '#fff', fontSize: '0.9rem' }}>"Welcome back, David. Yes, I have the record of our conversation from October 12th. I can apply the 15% discount to your new invoice immediately."</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Case Studies / Proven Impact */}
                    <motion.div className="glass-panel" style={{ padding: '4rem', gridColumn: '1 / -1', marginTop: '2rem' }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div style={{ color: '#00ff88', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em' }}>04 / PROVEN IMPACT</div>
                        <h3 style={{ fontSize: '3rem', marginBottom: '3rem', lineHeight: '1.2' }}>Enterprise Deployment Architectures.</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* Case Study 1 */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2.5rem' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--cube-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Industry: Automotive Dealership</div>
                                <h4 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>High-Ticket Lead Qualification</h4>
                                <p style={{ color: '#a1a1aa', lineHeight: '1.6', fontSize: '1rem' }}>
                                    A luxury auto group in Miami deployed the Agent to handle inbound WhatsApp inventory inquiries. The AI instantly references live stock APIs, negotiates absolute minimums based on integrated sales PDFs, and seamlessly books test drives directly into the CRM calendar. Human sales staff now only speak to pre-qualified buyers sitting in the showroom.
                                </p>
                            </div>

                            {/* Case Study 2 */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2.5rem' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--cube-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Industry: Private Healthcare Network</div>
                                <h4 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Autonomous Patient Triage</h4>
                                <p style={{ color: '#a1a1aa', lineHeight: '1.6', fontSize: '1rem' }}>
                                    A dental clinic with 4 locations eliminated their front-desk bottleneck. The HOLACUBE Agent ingests their operational handbook, answers complex questions regarding insurance co-pays and recovery times, and coordinates agenda scheduling. It processes over 400 specialized patient inquiries daily with a 0-second latency.
                                </p>
                            </div>

                            {/* Case Study 3 */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2.5rem' }}>
                                <div style={{ fontSize: '0.85rem', color: '#8a2be2', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Industry: D2C E-Commerce Brand</div>
                                <h4 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Flash Sale Infrastructure</h4>
                                <p style={{ color: '#a1a1aa', lineHeight: '1.6', fontSize: '1rem' }}>
                                    During aggressive Black Friday campaigns, this apparel brand experiences a 1000% spike in "Where is my order?" requests. By linking the Agent to their Shopify tracking endpoints, the AI resolves thousands of simultaneous customer state inquiries autonomously, allowing the logistics team to focus purely on fulfillment.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section (The Terminal Checkout) */}
            <section className="container" style={{ paddingBottom: '12rem' }}>
                <motion.div
                    className="glass-panel"
                    style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    whileHover={{ boxShadow: '0 0 60px rgba(0, 240, 255, 0.15)', borderColor: 'rgba(0, 240, 255, 0.3)' }}
                >
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />

                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>Deploy The Agent.</h2>
                    <p style={{ color: '#a1a1aa', fontSize: '1.25rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>Acquire the Pro License and transform your customer support machinery today.</p>

                    <div style={{ marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
                        <span style={{ fontSize: '6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.05em' }}>$100</span>
                        <span style={{ fontSize: '1.5rem', color: '#a1a1aa' }}> / month flat</span>
                    </div>

                    <div style={{ width: '100%', maxWidth: '500px', textAlign: 'left', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#eaeaea', fontSize: '1.1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}><span style={{ color: 'var(--cube-accent)' }}>✓</span> 1 WhatsApp Business Node</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}><span style={{ color: 'var(--cube-accent)' }}>✓</span> Infinite AI Tokens & Processing</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}><span style={{ color: 'var(--cube-accent)' }}>✓</span> Custom RAG Neural Knowledge Base</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}><span style={{ color: 'var(--cube-accent)' }}>✓</span> Unrestricted Dashboard Access</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span style={{ color: 'var(--cube-accent)' }}>✓</span> Cancel Anytime. No long-term lock-in.</li>
                        </ul>
                    </div>

                    <button className="btn-ultra interactive-glow" style={{ width: '100%', maxWidth: '500px', padding: '1.5rem', fontSize: '1.25rem', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                        <span style={{ position: 'relative', zIndex: 1 }}>Initiate Secure Checkout</span>
                        <div className="glow-effect" style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transition: 'all 0.5s ease' }} />
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666', position: 'relative', zIndex: 1 }}>Encryption & Ledger processing handled by Stripe Inc.</p>
                </motion.div>
            </section>
        </main>
    );
}
