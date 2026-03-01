"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if token exists in localStorage (Client-side only)
        const token = localStorage.getItem('cube_token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [pathname]); // Re-run when route changes

    const handleLogout = () => {
        localStorage.removeItem('cube_token');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    return (
        <nav className="glass-nav" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100, padding: '1rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff', textDecoration: 'none' }}>
                    HOLA<span style={{ color: 'var(--cube-primary)' }}>CUBE</span>AGENTS
                </Link>
                <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <Link href="/" className="nav-link">Home</Link>
                    <Link href="/agent" className="nav-link">The Agent</Link>
                    <Link href="/cube" className="nav-link">CUBE</Link>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard/crm" className="btn-ultra" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                                Agent Admin Console
                            </Link>
                            <button onClick={handleLogout} style={{ color: '#71717a', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                                Disconnect
                            </button>
                        </>
                    ) : (
                        <Link href="/auth/login" className="btn-ultra" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                            Login / Dashboard
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
