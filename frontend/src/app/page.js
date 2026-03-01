'use client';

import { motion } from 'framer-motion';
import ChatSimulator from '@/components/ChatSimulator';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Hero Section (Home) */}
      <section id="home" className="section container" style={{ position: 'relative', textAlign: 'left', alignItems: 'center', paddingTop: '10rem', minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>

        {/* Abstract Video Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'grayscale(50%) contrast(120%)' }}>
            <source src="/hero_video.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 100%)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>

          {/* Left: Copywriting */}
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} style={{ display: 'inline-block', padding: '0.6rem 1.2rem', background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '100px', color: 'var(--cube-accent)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: '0.05em' }}>
              ULTRA WHATSAPP AI AUTOMATION
            </motion.div>
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: '1.1' }}>
              The future of <br /> Customer Service.
            </motion.h1>
            <motion.p variants={itemVariants} style={{ margin: '2rem 0', fontSize: '1.25rem', color: '#eaeaea', maxWidth: '600px' }}>
              Deploy a hyper-intelligent AI agent to your WhatsApp Business in 3 seconds. Stop losing sales while you sleep.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
              <a href="/agent" className="btn-ultra interactive-glow" style={{ padding: '1.25rem 3rem', fontSize: '1.125rem', position: 'relative', overflow: 'hidden' }}>
                <span style={{ position: 'relative', zIndex: 1 }}>Rent Agent For $100/mo</span>
                <div className="glow-effect" style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transition: 'all 0.5s ease' }} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Interactive Chat Simulator */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            style={{ perspective: '1000px' }}
          >
            <ChatSimulator />
          </motion.div>

        </div>
      </section>

      {/* Agent Section is at /agent */}

      {/* The Problem / Financial Reality Section */}
      <motion.section
        className="section container"
        style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '5rem 4rem', textAlign: 'center', background: 'rgba(255,0,128,0.03)', borderColor: 'rgba(255,0,128,0.1)' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem', letterSpacing: '-0.04em' }}>The Financial Reality.</h2>
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', maxWidth: '800px', margin: '0 auto 4rem auto', lineHeight: '1.6' }}>
            A human employee works 8 hours a day, takes weekends off, and costs thousands of dollars a month. They can only answer one customer at a time. This is not how modern businesses scale.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
            {/* Human Column */}
            <motion.div variants={itemVariants} style={{ padding: '3rem', background: 'rgba(0,0,0,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#a1a1aa', marginBottom: '2rem' }}>Human Employee</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#666' }}>
                <li>❌ $1,500+ / month salary</li>
                <li>❌ 8-hour daily shifts</li>
                <li>❌ 5-minute average response time</li>
                <li>❌ 1 conversation at a time</li>
                <li>❌ Needs training & management</li>
              </ul>
            </motion.div>

            {/* AI Column */}
            <motion.div variants={itemVariants} style={{ padding: '3rem', background: 'linear-gradient(135deg, rgba(0,240,255,0.05), rgba(0,136,255,0.05))', borderRadius: '16px', border: '1px solid rgba(0,240,255,0.2)', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,240,255,0.02)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '2rem' }}>Holacube AI Agent</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#eaeaea' }}>
                <li>✅ <strong style={{ color: 'var(--cube-accent)' }}>$100 / month flat</strong></li>
                <li>✅ 24/7/365 Uptime</li>
                <li>✅ 0.8-second response time</li>
                <li>✅ 10,000+ simultaneous chats</li>
                <li>✅ Mastered your business in 5 mins</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="section container"
        style={{ paddingTop: '4rem', paddingBottom: '4rem' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 variants={itemVariants} style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '5rem', letterSpacing: '-0.04em' }}>Deploy in 3 Steps.</motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
          {[
            { num: '01', title: 'Subscribe', desc: 'Secure your $100/mo Pro License via Stripe. No hidden fees.' },
            { num: '02', title: 'Scan QR Code', desc: 'Open WhatsApp on your business phone, scan the QR on our dashboard, and instantly connect the bridge.' },
            { num: '03', title: 'Inject Knowledge', desc: 'Paste your website link or write your FAQs. The AI instantly becomes the ultimate expert on your business.' }
          ].map((step, i) => (
            <motion.div variants={itemVariants} key={i} style={{ position: 'relative', padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.03)', position: 'absolute', top: '0.5rem', left: '1rem', zIndex: -1 }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '1rem', color: '#fff' }}>{step.title}</h3>
              <p style={{ color: '#a1a1aa', lineHeight: '1.6' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Target Audiences / Use Cases */}
      <motion.section
        className="section container"
        style={{ paddingTop: '4rem', paddingBottom: '8rem' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '4rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem', letterSpacing: '-0.04em' }}>Built for scale.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem' }}>
            <motion.div variants={itemVariants}>
              <h4 style={{ color: 'var(--cube-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>RESTAURANTS</h4>
              <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.6' }}>Automatic reservations, menu sending, and taking delivery orders straight from WhatsApp while your waiters focus on the floor.</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 style={{ color: 'var(--cube-accent)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>REAL ESTATE</h4>
              <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.6' }}>Prequalify leads instantly at 3 AM. Send property links, answer location FAQs, and schedule viewings automatically.</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 style={{ color: '#8a2be2', marginBottom: '0.5rem', fontSize: '1.1rem' }}>CLINICS & DENTISTS</h4>
              <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.6' }}>Book appointments, send pricing for treatments, and handle basic triage questions without tying up your receptionist.</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 style={{ color: '#ff0080', marginBottom: '0.5rem', fontSize: '1.1rem' }}>E-COMMERCE</h4>
              <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.6' }}>Recover abandoned carts, send shipping updates, and answer product availability questions instantly to drive sales.</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* About Section (Features) */}
      <section id="about" className="section container" style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8rem' }}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '3.5rem', marginBottom: '4rem', letterSpacing: '-0.03em' }}
        >
          Why we built it.
        </motion.h2>

        <motion.div
          className="about-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { title: 'Zero Commission', desc: 'Stop paying ridiculous per-message fees to Meta API. We bypass it entirely with local execution.', color: '#0088ff' },
            { title: 'Ultimate Privacy', desc: 'Your chats are processed by a localized bridge. No human will ever read your private business data.', color: '#ff0080' },
            { title: 'Hyper Localized', desc: 'Built for the small business owner who just wants to scan a QR code and forget about customer support.', color: '#00f0ff' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass-panel"
              style={{ padding: '3.5rem 2.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column' }}
              variants={itemVariants}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `linear-gradient(135deg, ${feature.color}, #000)`, marginBottom: '2rem' }}></div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#fff' }}>{feature.title}</h3>
              <p style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: '1.6' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final Massive CTA */}
      <section className="section container" style={{ padding: '12rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Stop missing sales. <br /> <span style={{ color: 'var(--cube-accent)' }}>Start automating.</span></h2>
        <p style={{ fontSize: '1.5rem', color: '#a1a1aa', marginBottom: '4rem' }}>Setup takes 3 minutes. The return on investment is infinite.</p>
        <a href="/agent" className="btn-ultra" style={{ padding: '1.5rem 4rem', fontSize: '1.5rem' }}>
          Get Your Pro License Now
        </a>
      </section>

      {/* Note: The Cube Manifesto was moved to /cube */}

      {/* Minimal Footer */}
      <footer style={{ borderTop: '1px solid var(--surface-border)', padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© 2026 HOLACUBEAGENTS. Engineered by CUBE.</p>
      </footer>
    </main>
  );
}
