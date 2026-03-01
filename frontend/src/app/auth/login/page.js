"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Store token
            localStorage.setItem('cube_token', data.token);

            // Redirect to Dashboard
            window.location.href = '/dashboard/welcome';

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch('http://localhost:3001/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Google Authentication failed');

                // Setup CUBE Authentication
                localStorage.setItem('cube_token', data.token);
                window.location.href = '/dashboard/welcome';

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError('Google Sign-In was cancelled or failed.')
    });

    return (
        <div className="auth-container">
            {/* Background Orbs */}
            <div className="bg-glow-blue auth-orb orb-1" />
            <div className="bg-glow-purple auth-orb orb-2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="auth-box-wrapper glass-panel"
            >
                <div className="auth-header">
                    <Shield className="auth-icon" />
                    <h1 className="auth-title">CUBE SECURE</h1>
                    <p className="auth-subtitle">Enter your credentials to access the CRM</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input"
                            placeholder="agent@holacube.com"
                        />
                    </div>

                    <div className="input-group relative">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                        <button type="button" onClick={() => loginWithGoogle()} className="btn-google-ultra">
                            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                        <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                        <span style={{ padding: '0 1rem', color: '#71717a', fontSize: '0.8rem' }}>OR EXPERT ACCESS</span>
                        <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-ultra auth-submit mt-6"
                        style={{ width: '100%', display: 'flex', gap: '8px' }}
                    >
                        <span>{loading ? 'AUTHENTICATING...' : 'ACCESS CRM'}</span>
                        {!loading && <ArrowRight />}
                    </button>

                    <p className="auth-footer">
                        New agent? <Link href="/auth/register" className="auth-link">Request access</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
