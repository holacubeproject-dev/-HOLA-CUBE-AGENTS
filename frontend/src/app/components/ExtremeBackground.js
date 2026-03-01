'use client';

import { useEffect, useState } from 'react';

export default function ExtremeBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // PERFORMANCE FIX: 
    // 1. Reduced from 7 to 3 elements.
    // 2. Removed framer-motion React reconciliation loops.
    // 3. Removed `filter: blur()`, `mix-blend-mode: screen`, and SVG noise which absolutely destroy GPU performance and cause lag.
    // 4. Using simple optimized CSS radial gradients that emulate the effect cleanly.

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, overflow: 'hidden', pointerEvents: 'none', background: '#000' }}>

            {/* AI Generated Hyper-Minimalist Apple BG */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'url("/bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.6,
                zIndex: -2,
            }} />
            {/* Cyan/Blue Orb Floor */}
            <div style={{
                position: 'absolute',
                bottom: '-30%', left: '-10%',
                width: '120vw', height: '80vh',
                background: 'radial-gradient(ellipse at center, rgba(0, 136, 255, 0.15) 0%, rgba(0, 240, 255, 0.05) 40%, transparent 70%)',
                animation: 'float-slow 20s ease-in-out infinite alternate'
            }} />

            {/* Purple/Pink Orb Right */}
            <div style={{
                position: 'absolute',
                top: '-10%', right: '-20%',
                width: '100vw', height: '100vh',
                background: 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.15) 0%, rgba(255, 0, 128, 0.05) 30%, transparent 60%)',
                animation: 'float-slow 25s ease-in-out infinite alternate-reverse'
            }} />

            {/* Central Orange Accent Orb */}
            <div style={{
                position: 'absolute',
                top: '20%', left: '30%',
                width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(255, 128, 0, 0.08) 0%, transparent 50%)',
                animation: 'float-fast 15s ease-in-out infinite alternate'
            }} />
        </div>
    );
}
