import './globals.css'
import CustomCursor from './components/CustomCursor'
import ExtremeBackground from './components/ExtremeBackground'
import Link from 'next/link'
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast';
import FloatingAgent from './components/FloatingAgent';

export const metadata = {
  title: 'HOLACUBEAGENTS | Ultra AI Automation',
  description: 'The definitive WhatsApp AI automation for local business.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body>
        <ExtremeBackground />
        <CustomCursor />
        <Navbar />
        <GoogleOAuthProvider clientId="201826453926-kc0854dg7ougtns6hb5b9hhaa1sncaei.apps.googleusercontent.com">
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(10, 15, 20, 0.8)',
                color: '#fff',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                fontSize: '0.9rem'
              },
              success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
              error: { iconTheme: { primary: '#ff3366', secondary: '#000' } }
            }}
          />
          {children}
        </GoogleOAuthProvider>
        <FloatingAgent />
      </body>
    </html>
  )
}
