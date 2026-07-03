import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/openapi.json — machine-readable OpenAPI 3.1 spec for the headless API.
 * Public (describes the contract, no secrets). Server URL derived from the request.
 */
export async function GET(req: NextRequest) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
    const baseUrl = `${proto}://${host}`;

    const InvoiceResponse = {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            idempotent: { type: 'boolean', description: 'true when this invoiceId was already filed' },
            invoiceId: { type: 'string' },
            uuid: { type: 'string' },
            zatcaStatus: { type: 'string', enum: ['CLEARED', 'REPORTED', 'REJECTED', 'WARNING'] },
            validationMessages: { type: 'array', items: { type: 'object' } },
            qrCode: { type: 'string', description: 'data:image/png;base64,… (ZATCA QR)' },
            invoiceHash: { type: 'string' },
            signedXml: { type: 'string', description: 'Base64 UBL 2.1 XML' },
            timestamp: { type: 'string', format: 'date-time' },
        },
    };

    const spec = {
        openapi: '3.1.0',
        info: {
            title: 'ZATCA Middleware API',
            version: '1.0.0',
            description: 'Headless (Mode B) API: submit an invoice and get back its ZATCA status, QR, and signed XML. Auth via the `x-api-key` header. Handles B2B (standard→clearance) and B2C (simplified→reporting), each as invoice (388), credit note (381), or debit note (383).',
        },
        servers: [{ url: baseUrl }],
        security: [{ ApiKeyAuth: [] }],
        components: {
            securitySchemes: { ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' } },
            schemas: {
                Item: {
                    type: 'object',
                    required: ['name', 'quantity', 'unitPrice', 'vatRate'],
                    properties: {
                        name: { type: 'string' },
                        quantity: { type: 'number' },
                        unitPrice: { type: 'number' },
                        vatCategory: { type: 'string', enum: ['S', 'Z', 'E', 'O'], default: 'S' },
                        vatRate: { type: 'number', description: '15 for standard rate' },
                    },
                },
                Buyer: {
                    type: 'object',
                    required: ['postalAddress', 'partyLegalEntity'],
                    properties: {
                        partyIdentification: { type: 'object', properties: { id: { type: 'string' }, schemeID: { type: 'string' } } },
                        postalAddress: { type: 'object', properties: { streetName: { type: 'string' }, buildingNumber: { type: 'string' }, citySubdivisionName: { type: 'string' }, cityName: { type: 'string' }, postalZone: { type: 'string' }, country: { type: 'string' } } },
                        partyTaxScheme: { type: 'object', properties: { companyID: { type: 'string' } } },
                        partyLegalEntity: { type: 'object', properties: { registrationName: { type: 'string' } } },
                    },
                },
                InvoiceRequest: {
                    type: 'object',
                    required: ['type', 'documentType', 'invoiceId', 'items'],
                    properties: {
                        type: { type: 'string', enum: ['standard', 'simplified'], description: 'standard=B2B (clearance), simplified=B2C (reporting)' },
                        documentType: { type: 'string', enum: ['388', '381', '383'], description: '388 invoice, 381 credit note, 383 debit note' },
                        invoiceId: { type: 'string' },
                        buyer: { $ref: '#/components/schemas/Buyer', description: 'required when type=standard' },
                        items: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
                        originalInvoiceId: { type: 'string', description: 'required for 381/383' },
                        creditReason: { type: 'string', description: 'required for 381/383' },
                    },
                },
                InvoiceResponse,
            },
        },
        paths: {
            '/api/v1/zatca/invoices/submit': {
                post: {
                    summary: 'Sign + clear/report an invoice',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InvoiceRequest' } } } },
                    responses: {
                        '200': { description: 'Cleared/Reported', content: { 'application/json': { schema: { $ref: '#/components/schemas/InvoiceResponse' } } } },
                        '400': { description: 'Missing required fields' },
                        '401': { description: 'Missing/invalid API key' },
                        '422': { description: 'ZATCA rejected (see validationMessages)' },
                    },
                },
            },
            '/api/v1/zatca/invoices': { get: { summary: 'List invoices', responses: { '200': { description: 'OK' } } } },
            '/api/v1/zatca/invoices/{id}': { get: { summary: 'Retrieve one invoice', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } } },
            '/api/v1/zatca/invoices/{id}/pdf': { get: { summary: 'Compliance PDF', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'application/pdf' } } } },
            '/api/v1/zatca/summary': { get: { summary: 'KPIs', responses: { '200': { description: 'OK' } } } },
        },
    };

    return NextResponse.json(spec);
}
