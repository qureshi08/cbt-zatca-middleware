import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ZATCA Middleware — Phase 2 E-Invoicing Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
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
        <div
          style={{
            width: 108,
            height: 108,
            borderRadius: 24,
            background: 'rgba(255,255,255,0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 28,
          }}
        >
          Z
        </div>
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
