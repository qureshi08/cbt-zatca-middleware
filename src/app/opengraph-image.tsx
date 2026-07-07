import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// nodejs (not edge) runtime so we can read the real CBT logo mark from disk.
export const runtime = 'nodejs';
export const alt = 'ZATCA Middleware — Phase 2 E-Invoicing Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const markBuffer = await readFile(join(process.cwd(), 'public', 'cbt-favicon-mark.png'));
  const markSrc = `data:image/png;base64,${markBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg,#007A3D 0%,#00994D 55%,#00C060 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={108} height={108} style={{ borderRadius: 24, marginBottom: 28 }} />
        <div style={{ fontSize: 60, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>
          ZATCA Middleware
        </div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.92)', marginTop: 14 }}>
          Phase 2 E-Invoicing · Connect Odoo, Zoho, or your own API
        </div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.75)', marginTop: 36 }}>
          Convergent Business Technologies
        </div>
      </div>
    ),
    { ...size },
  );
}
