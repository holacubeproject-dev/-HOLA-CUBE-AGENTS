"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('cube_token');

            if (!token) {
                console.warn('⛔ NO JWT TOKEN FOUND. Redirecting to Login.');
                router.push('/auth/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:3001/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    console.warn('⛔ JWT TOKEN INVALID OR EXPIRED. Redirecting to Login.');
                    localStorage.removeItem('cube_token');
                    router.push('/auth/login');
                }
            } catch (err) {
                console.error('Auth verification failed:', err);
                router.push('/auth/login');
            }
        };

        verifySession();
    }, [pathname, router]);

    // Loading Screen while verifying
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-t-2 border-[#00E5FF] border-r-2 border-transparent rounded-full mb-4"
                />
                <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase animate-pulse">
                    Verifying Core Clearance...
                </p>
            </div>
        );
    }

    // Render Dashboard
    return <>{children}</>;
}
