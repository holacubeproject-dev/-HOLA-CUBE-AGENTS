"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Check password strength
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/auth/register-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            // Success: OTP Sent. Move to Step 2
            setSuccess('Secure code sent to your email.');
            setStep(2);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (otp.length < 6) {
            setError('Please enter the 6-digit code');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Verification failed');

            // Store Token
            localStorage.setItem('cube_token', data.token);
            setSuccess('🎉 ¡Bienvenido a CUBE! Redirigiendo a tu Plan de Suscripción...');

            setTimeout(() => {
                window.location.href = '/pricing';
            }, 2000);

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
                setSuccess('🎉 ¡Bienvenido a CUBE! Redirigiendo a tu Plan de Suscripción...');
                setTimeout(() => {
                    window.location.href = '/pricing';
                }, 2000);

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
            <div className="bg-glow-cyan auth-orb orb-1" />
            <div className="bg-glow-pink auth-orb orb-2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="auth-box-wrapper glass-panel"
            >
                <div className="auth-header">
                    <Shield className="auth-icon icon-white" />
                    <h1 className="auth-title">{step === 1 ? 'INITIATE AGENT' : 'VERIFY IDENTITY'}</h1>
                    <p className="auth-subtitle">
                        {step === 1 ? 'Deploy your autonomous CUBE framework' : `A secure code was sent to ${email}`}
                    </p>
                </div>

                <form onSubmit={step === 1 ? handleRegister : handleVerifyOTP} className="auth-form">
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-error">
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-success">
                            {success}
                        </motion.div>
                    )}

                    {step === 1 ? (
                        <>
                            <div className="input-group">
                                <label>Business Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input input-white"
                                    placeholder="ceo@yourstartup.com"
                                />
                            </div>

                            <div className="input-group relative">
                                <label>Master Password</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input input-white pr-12"
                                        placeholder="Secure & Minimum 6 chars"
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

                            <div className="input-group relative">
                                <label>Confirm Password</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="auth-input input-white pr-12"
                                        placeholder="Repeat your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="password-toggle"
                                    >
                                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-submit submit-cyan mt-6"
                            >
                                {loading ? 'TRANSMITTING...' : (
                                    <>
                                        <span>DEPLOY WORKSPACE</span>
                                        <UserPlus className="w-5 h-5 ml-2 inline" />
                                    </>
                                )}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                                <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                                <span style={{ padding: '0 1rem', color: '#71717a', fontSize: '0.8rem' }}>OR EXPRESS DEPLOYMENT</span>
                                <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
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

                            <p className="auth-footer" style={{ marginTop: '2rem' }}>
                                Already deployed? <Link href="/auth/login" className="auth-link link-underline">Access Core</Link>
                            </p>
                        </>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="input-group" style={{ textAlign: 'center' }}>
                                <label style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'block' }}>Enter 6-Digit Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="auth-input input-white"
                                    placeholder="000000"
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '2rem',
                                        letterSpacing: '0.5rem',
                                        padding: '1rem',
                                        fontWeight: 'bold',
                                        color: 'var(--cube-accent)'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="auth-submit submit-cyan mt-6"
                            >
                                {loading ? 'VERIFYING...' : 'VERIFY & ENTER CRM'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep(1); setOtp(''); setError(''); }}
                                className="mt-4"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#71717a',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                GO BACK
                            </button>
                        </motion.div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
