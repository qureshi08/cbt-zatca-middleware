import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/context/AppContext';
import { getCurrentUser } from '@/lib/supabase/server';
import { isPlatformAdmin } from '@/lib/admin';

const SITE_URL = 'https://zatca.convergentbt.com';
const TITLE = 'ZATCA Middleware – Phase 2 E-Invoicing Platform';
const DESCRIPTION = 'Become and stay ZATCA-compliant without leaving the software you already use. Connect Odoo, Zoho, or your own API and clear/report invoices automatically. By Convergent Business Technologies.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'ZATCA Middleware · Convergent Business Technologies',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Show the app shell (sidebar) only when signed in; auth pages render standalone.
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>
          {user ? (
            <div className="app-shell" style={{ display: "flex", minHeight: "100vh" }}>
              <Sidebar email={user.email ?? undefined} isAdmin={isPlatformAdmin(user.email)} />
              <div className="main-content" style={{ flex: 1, minWidth: 0 }}>{children}</div>
            </div>
          ) : (
            <div className="main-content">{children}</div>
          )}
        </AppProvider>
      </body>
    </html>
  );
}
