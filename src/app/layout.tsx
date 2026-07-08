import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/context/AppContext';
import { getCurrentUser } from '@/lib/supabase/server';
import { isPlatformAdmin } from '@/lib/admin';
import { SITE_URL, SITE_NAME, ORG_NAME } from '@/lib/site';

const TITLE = `${SITE_NAME} – Phase 2 E-Invoicing Platform`;
const DESCRIPTION = `Become and stay ZATCA-compliant without leaving the software you already use. Connect Odoo, Zoho, or your own API and clear/report invoices automatically. By ${ORG_NAME}.`;

// App-wide default metadata. The public landing page (src/app/page.tsx) overrides
// title/description/openGraph/twitter with more specific, keyword-rich copy.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Favicon is auto-detected from src/app/icon.png (the real CBT icon mark) — no manual icons field needed.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: `${SITE_NAME} · ${ORG_NAME}`,
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
        {/* Exact Google Fonts URL from the CBT brand kit — includes italic Playfair for the .italic-accent signature. */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
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
