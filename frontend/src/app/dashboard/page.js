'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, CheckCircle, UploadCloud, Loader2 } from 'lucide-react';

const socket = io('http://localhost:3001', { autoConnect: false });

export default function Dashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isPaymentSuccess = searchParams.get('payment_success') === 'true';

    const [qrCode, setQrCode] = useState('');
    const [status, setStatus] = useState('waiting'); // waiting, connected, ready
    const [hasAccess, setHasAccess] = useState(null); // null = loading, true = paid, false = unpaid
    const [hasKnowledgeBase, setHasKnowledgeBase] = useState(null);
    const [showSuccessAnim, setShowSuccessAnim] = useState(isPaymentSuccess);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const verifyClearance = async () => {
            const token = localStorage.getItem('cube_token');
            if (!token) {
                window.location.href = '/auth/login';
                return;
            }

            try {
                // Check Global Subscription Status from local DB via JWT
                const res = await fetch('http://localhost:3001/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (data?.user?.hasActiveSubscription) {
                    setHasAccess(true);
                    if (data?.user?.knowledgeBase) {
                        setHasKnowledgeBase(true);
                        initSecureSocket();
                    } else {
                        setHasKnowledgeBase(false);
                    }
                } else {
                    setHasAccess(false);
                }
            } catch (err) {
                console.error("Auth Error", err);
                setHasAccess(false);
            }
        };

        verifyClearance();

        if (isPaymentSuccess) {
            // Remove the query param from the URL to prevent re-triggering on refresh
            router.replace('/dashboard', undefined, { shallow: true });

            // Auto-hide the success animation after 4 seconds to show the QR Code
            const timer = setTimeout(() => {
                setShowSuccessAnim(false);
            }, 4000);
            return () => clearTimeout(timer);
        }

        return () => {
            socket.off('initial_status');
            socket.off('qr');
            socket.off('authenticated');
            socket.off('ready');
        };
    }, []);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (!file) return;

        setUploading(true);
        const token = localStorage.getItem('cube_token');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:3001/api/knowledge/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setUploadSuccess(true);
                setTimeout(() => {
                    setHasKnowledgeBase(true);
                    initSecureSocket();
                }, 2500);
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed. Make sure it's a valid PDF, DOCX, or TXT.");
        } finally {
            setUploading(false);
        }
    };

    const initSecureSocket = () => {
        if (socket.connected) {
            socket.disconnect();
        }

        socket.off('initial_status');
        socket.off('qr');
        socket.off('authenticated');
        socket.off('ready');

        // Handle immediate connection state sync
        socket.on('initial_status', (data) => {
            console.log('Received initial status:', data);
            setStatus(data.status); // 'waiting', 'connected', or 'ready'
            if (data.qr && data.status === 'waiting') {
                setQrCode(data.qr);
            }
        });

        // Socket real-time events from backend
        socket.on('qr', (qr) => {
            console.log('QR Code received from server');
            setQrCode(qr);
            setStatus('waiting');
        });

        socket.on('authenticated', (msg) => {
            console.log(msg);
            setStatus('connected');
        });

        socket.on('ready', (msg) => {
            console.log(msg);
            setStatus('ready');
        });

    };

    const handleDisconnect = async () => {
        const token = localStorage.getItem('cube_token');
        if (!token) return;

        try {
            setStatus('waiting');
            setQrCode('');
            await fetch('http://localhost:3001/api/agent/disconnect', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // The socket will push the new QR code automatically
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (hasAccess === null) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f0ff', letterSpacing: '2px' }}>
                VERIFYING CUBE CLEARANCE...
            </div>
        );
    }

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background Gradients */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(0,240,255,0.05) 0%, transparent 60%)', zIndex: -1 }} />
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,0,128,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1 }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '4rem 3rem', textAlign: 'center', maxWidth: '600px', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
            >
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Agent Dashboard</h1>

                {showSuccessAnim ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        style={{ padding: '3rem', border: '1px solid rgba(0,255,136,0.5)', borderRadius: '16px', background: 'rgba(0,255,136,0.1)', textAlign: 'center', width: '100%', boxShadow: '0 0 40px rgba(0,255,136,0.2)' }}
                    >
                        <CheckCircle size={64} color="#00ff88" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.8))' }} />
                        <h2 style={{ color: '#00ff88', fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '1px' }}>PAYMENT SUCCESSFUL</h2>
                        <p style={{ color: '#eaeaea', fontSize: '1.2rem', marginBottom: '1rem' }}>Your CUBE limits have been removed.</p>
                        <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>Initializing secure AI Gateway...</p>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            style={{ width: '30px', height: '30px', border: '3px solid rgba(0,255,136,0.3)', borderTopColor: '#00ff88', borderRadius: '50%', margin: '2rem auto 0' }}
                        />
                    </motion.div>
                ) : hasAccess === false ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ padding: '3rem', border: '1px solid rgba(255,0,128,0.3)', borderRadius: '16px', background: 'rgba(255,0,128,0.05)', textAlign: 'center', width: '100%' }}>
                        <Lock size={48} color="#ff0080" style={{ margin: '0 auto 1rem' }} />
                        <h2 style={{ color: '#ff0080', fontSize: '2rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(255,0,128,0.5)' }}>Access Denied</h2>
                        <p style={{ color: '#ccc', fontSize: '1.1rem', marginBottom: '2rem' }}>You have no active CUBE Subscriptions. Please Upgrade to deploy your AI Bot.</p>
                        <Link href="/pricing" style={{ display: 'inline-block' }}>
                            <button className="btn-ultra" style={{ borderColor: '#ff0080', boxShadow: '0 0 20px rgba(255,0,128,0.3)' }}>View Plans</button>
                        </Link>
                    </motion.div>
                ) : hasKnowledgeBase === false ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00f0ff' }}>Train Your AI Agent</h2>
                        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Upload your business info (PDF/DOCX) so the AI knows your prices, location, and services.</p>

                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileUpload}
                            style={{ border: '2px dashed rgba(0,240,255,0.4)', borderRadius: '16px', padding: '3.5rem 2rem', background: 'rgba(0,240,255,0.02)', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' }}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} accept=".pdf,.docx,.txt" />

                            {uploadSuccess ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle size={48} color="#00ff88" style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ color: '#00ff88', fontWeight: 'bold' }}>Knowledge Base Ingested Successfully!</p>
                                    <p style={{ color: '#00ff88', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>Firing up WhatsApp Core...</p>
                                </motion.div>
                            ) : uploading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Loader2 size={48} color="#00f0ff" className="animate-spin" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                                    <p style={{ color: '#00f0ff', fontWeight: 'bold' }}>Extracting Data & Training AI Brain...</p>
                                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '0.5rem' }}>This may take a few seconds.</p>
                                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={48} color="#00f0ff" style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ color: '#e4e4e7', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Drag & Drop your document here</p>
                                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>or click to browse (.pdf, .docx, .txt)</p>
                                </>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {status === 'waiting' && (
                            <>
                                <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Link your WhatsApp Business to activate your agent.</p>
                                <div style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '4px solid var(--cube-primary)' }}>
                                    {qrCode ? (
                                        <QRCodeSVG value={qrCode} size={250} />
                                    ) : (
                                        <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                                            Generating secure QR...
                                        </div>
                                    )}
                                </div>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>Open WhatsApp on your phone &gt; Settings &gt; Linked Devices &gt; Link a Device</p>
                            </>
                        )}

                        {(status === 'connected' || status === 'ready') && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', padding: '2rem', background: 'rgba(0, 255, 136, 0.05)', borderRadius: '16px', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                                <CheckCircle size={64} color="#00ff88" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.6))' }} />
                                <h2 style={{ color: '#00ff88', fontSize: '1.8rem', marginBottom: '1rem' }}>Agent is Online & Active</h2>
                                <p style={{ color: '#eaeaea', marginBottom: '1rem' }}>Your WhatsApp number is successfully linked to CUBE.</p>

                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid #333', textAlign: 'left', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
                                        <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>AI Brain Status: <strong>Synced</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
                                        <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Business Knowledge: <strong>Loaded Permanently</strong></span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                                    <Link href="/dashboard/crm" style={{ flex: 1 }}>
                                        <button className="btn-ultra" style={{ width: '100%' }}>Open CRM Console</button>
                                    </Link>
                                    <button
                                        onClick={handleDisconnect}
                                        className="btn-ultra"
                                        style={{ flex: 1, borderColor: '#ff0033', boxShadow: '0 0 20px rgba(255,0,51,0.2)', color: '#ff0033', background: 'rgba(255,0,51,0.05)' }}
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>

        </main>
    );
}
