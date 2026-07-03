import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/postman
 * Returns a ready-to-import Postman collection (v2.1) for the ZATCA Middleware
 * headless API, pre-filled with the live base URL. The caller sets {{apiKey}}.
 * Public (no auth) — it's just a template, no secrets.
 */
export async function GET(req: NextRequest) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
    const baseUrl = `${proto}://${host}`;

    const raw = (obj: unknown) => JSON.stringify(obj, null, 2);

    const B2B_BUYER = {
        partyIdentification: { id: '310175397400003', schemeID: 'TXID' },
        postalAddress: { streetName: 'King Fahd Road', buildingNumber: '1000', citySubdivisionName: 'Al Olaya', cityName: 'Riyadh', postalZone: '11564', country: 'SA' },
        partyTaxScheme: { companyID: '310175397400003' },
        partyLegalEntity: { registrationName: 'Al-Faisal Trading Co.' },
    };
    // Full 2×3 document matrix: {B2B standard | B2C simplified} × {invoice 388 | credit 381 | debit 383}
    const sample = (customer: 'b2b' | 'b2c', doc: '388' | '381' | '383') => {
        const type = customer === 'b2b' ? 'standard' : 'simplified';
        const tag = customer.toUpperCase();
        const body: Record<string, unknown> = {
            type, documentType: doc, invoiceId: `API-${tag}-${doc}-001`,
            ...(customer === 'b2b' ? { buyer: B2B_BUYER } : {}),
            items: [{ name: 'Consulting services', quantity: 1, unitPrice: 1000, vatCategory: 'S', vatRate: 15 }],
        };
        if (doc !== '388') { body.originalInvoiceId = `API-${tag}-388-001`; body.creditReason = doc === '381' ? 'Return of goods' : 'Additional charges'; }
        return body;
    };

    const jsonReq = (name: string, method: string, path: string, body?: unknown) => ({
        name,
        request: {
            method,
            header: [
                { key: 'x-api-key', value: '{{apiKey}}', type: 'text' },
                ...(body ? [{ key: 'Content-Type', value: 'application/json', type: 'text' }] : []),
            ],
            ...(body ? { body: { mode: 'raw', raw: raw(body), options: { raw: { language: 'json' } } } } : {}),
            url: { raw: `{{baseUrl}}${path}`, host: ['{{baseUrl}}'], path: path.replace(/^\//, '').split('/') },
        },
    });

    const collection = {
        info: {
            name: 'ZATCA Middleware API',
            description: 'Headless (Mode B) API for custom software. Set the `apiKey` variable to your integration key (Onboarding → Custom → Generate key). `baseUrl` is pre-filled. Submit an invoice and get back its ZATCA status, QR, and signed XML.',
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        variable: [
            { key: 'baseUrl', value: baseUrl },
            { key: 'apiKey', value: 'sk_zatca_live_REPLACE_ME' },
        ],
        item: [
            {
                name: 'B2B — Standard (clearance)',
                item: [
                    jsonReq('Invoice (388)', 'POST', '/api/v1/zatca/invoices/submit', sample('b2b', '388')),
                    jsonReq('Credit note (381)', 'POST', '/api/v1/zatca/invoices/submit', sample('b2b', '381')),
                    jsonReq('Debit note (383)', 'POST', '/api/v1/zatca/invoices/submit', sample('b2b', '383')),
                ],
            },
            {
                name: 'B2C — Simplified (reporting)',
                item: [
                    jsonReq('Invoice (388)', 'POST', '/api/v1/zatca/invoices/submit', sample('b2c', '388')),
                    jsonReq('Credit note (381)', 'POST', '/api/v1/zatca/invoices/submit', sample('b2c', '381')),
                    jsonReq('Debit note (383)', 'POST', '/api/v1/zatca/invoices/submit', sample('b2c', '383')),
                ],
            },
            jsonReq('List invoices', 'GET', '/api/v1/zatca/invoices'),
            jsonReq('Get one invoice', 'GET', '/api/v1/zatca/invoices/INV-1001'),
            jsonReq('Get compliance PDF', 'GET', '/api/v1/zatca/invoices/INV-1001/pdf'),
            jsonReq('Summary / KPIs', 'GET', '/api/v1/zatca/summary'),
        ],
    };

    return new NextResponse(raw(collection), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="ZATCA-Middleware.postman_collection.json"',
        },
    });
}
