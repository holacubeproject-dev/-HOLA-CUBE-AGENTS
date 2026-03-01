'use client';

import { motion } from 'framer-motion';

export default function CubeDefinition() {
    return (
        <main style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', paddingTop: '120px' }}>

            <section className="container" style={{ textAlign: 'center', paddingBottom: '12rem' }}>
                <motion.div
                    className="glass-panel"
                    style={{ padding: '8rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', overflow: 'hidden', position: 'relative' }}
                    initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 1.2, type: 'spring' }}
                >
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cube-primary), transparent)', boxShadow: '0 0 20px var(--cube-primary)' }} />

                    <div style={{ display: 'inline-block', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '0.2em' }}>
                        MANIFESTO V1
                    </div>

                    <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '2rem', position: 'relative', textShadow: '0 0 40px rgba(255,255,255,0.3)', background: 'linear-gradient(180deg, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Who is CUBE?
                    </h1>

                    <p style={{ fontSize: '1.35rem', maxWidth: '800px', margin: '0 auto 3rem auto', position: 'relative', color: '#eaeaea', lineHeight: '1.8' }}>
                        CUBE is not just a software brand. It is an elite standard of engineering. Born from the demand for hyper-minimalist, high-performance systems, CUBE delivers architectural perfection wrapped in dark neon aesthetics. We build software that feels like an artifact from the year 2030.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
                        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--cube-accent)' }}>01. Absolute Minimalism</h3>
                            <p style={{ fontSize: '1rem', color: '#a1a1aa' }}>We strip away the unnecessary. If a feature doesn't serve a critical business function with maximum efficiency, it doesn't ship.</p>
                        </div>
                        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--cube-primary)' }}>02. Brutal Performance</h3>
                            <p style={{ fontSize: '1rem', color: '#a1a1aa' }}>Our systems are designed to operate at the edge of physics. Zero latency, infinite scalability, and bulletproof reliability.</p>
                        </div>
                    </div>

                </motion.div>
            </section>

            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem', marginBottom: '8rem', paddingTop: '4rem' }}>

                {/* Concept 1: Digital Poetry */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ borderLeft: '2px solid rgba(138, 43, 226, 0.3)', paddingLeft: '2rem' }}>
                        <p style={{ fontSize: '1.75rem', fontWeight: 300, color: '#fff', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                            "CUBE is Digital Poetry."
                        </p>
                        <p style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            We are not just building a company; we are defining a new <strong>Epoch</strong>. CUBE represents the dawn of a Digital Renaissance—a time where technology transcends code and becomes art.
                        </p>
                        <p style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: '1.8' }}>
                            We do not simply predict the future; <strong style={{ color: '#fff' }}>We are Tomorrow.</strong>
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <p style={{ fontSize: '1.15rem', color: '#a1a1aa', lineHeight: '1.8' }}>
                            HOLACUBEAGENTS is just one verse of this new reality. It is a building block of a world where logic meets emotion, and innovation meets soul. CUBE is the manifestation of the next great leap in human history.
                        </p>
                    </motion.div>
                </div>

                {/* Concept 2: The Galactic Manifesto */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center', paddingTop: '6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <p style={{ fontSize: '1.15rem', color: '#a1a1aa', lineHeight: '1.8' }}>
                            "Earth is just the beginning."
                        </p>
                        <p style={{ fontSize: '1.15rem', color: '#a1a1aa', lineHeight: '1.8', marginTop: '1.5rem' }}>
                            SpaceCube is our interstellar promise. We are architecting the <strong style={{ color: '#fff' }}>Digital Twin of the Universe</strong>. It is not merely a platform; it is a vehicle for consciousness to travel beyond the physical realm.
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} style={{ borderLeft: '2px solid rgba(0, 136, 255, 0.3)', paddingLeft: '2rem' }}>
                        <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#0088ff', marginBottom: '1.5rem' }}>The Galactic Manifesto</h2>
                        <p style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: '1.8' }}>
                            We start with the Moon—<strong style={{ color: '#fff' }}>The Lunar Gateway</strong>. SpaceCube will act as the bridge between terrestrial data and cosmic exploration, democratizing access to the stars through digital immersion. HOLACUBEAGENTS powers the autonomous communications required for this scale.
                        </p>
                    </motion.div>
                </div>

            </div>

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left', marginBottom: '8rem', padding: '0 2rem' }}
            >
                <h2 style={{ fontSize: '3.5rem', marginBottom: '3rem', textAlign: 'center' }}>Frequently Asked Questions.</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        { q: "Is the infrastructure compliant with Meta API terms?", a: "Our architecture utilizes localized WhatsApp emulation protocol. This deployment model bypasses the official Meta Business API, directly eliminating per-message latency and per-conversation commission structures while operating within standard web environment boundaries." },
                        { q: "How is data isolation and customer privacy ensured?", a: "HOLACUBEAGENTS operates on a strict tenant-isolation framework. Data ingestion is limited exclusively to live threads interacting with the computational agent. Your underlying business history and private contacts remain completely inaccessible to the algorithmic core." },
                        { q: "What is the timeline for knowledge base ingestion?", a: "Deployment is virtually instantaneous. By providing raw business context (URLs, PDFs, or structured text), the neural network synthesizes your operational logic and executes customer interactions with absolute brand alignment in under 180 seconds." },
                        { q: "Does the system support a human override protocol?", a: "Yes. The architecture includes an automated threshold-failure protocol. If a customer query exceeds the mathematical scope of the provided knowledge base, the computational node enters a suspended state for that specific thread and issues an interrupt signal for a human operator." },
                        { q: "What is the financial commitment and scalability limit?", a: "The licensing model is a flat $100 USD monthly subscription. This guarantees infinite query processing, continuous 24/7 localized uptime, and zero volumetric scaling fees. Operational contracts run on a month-to-month basis with zero cancellation latency." }
                    ].map((faq, i) => (
                        <motion.div
                            key={i}
                            className="glass-panel"
                            style={{ padding: '2rem', borderLeft: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 16px 16px 0' }}
                            whileHover={{ borderLeftColor: 'var(--cube-primary)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                        >
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>{faq.q}</h4>
                            <p style={{ color: '#a1a1aa', lineHeight: '1.6', fontSize: '1.05rem' }}>{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </main>
    );
}
