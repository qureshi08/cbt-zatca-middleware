'use server';

/**
 * ZATCA API Client
 * Optimized for 1:1 parity with ZATCA Simulation & Developer Portal (ISB 2.1.0).
 */
import fs from 'node:fs';
import path from 'node:path';
import { zatcaBaseUrl, type ZatcaEnv } from '../environments';

// ZATCA Gateway Selection — driven by the tenant's environment, NOT a guess:
//   demo → simulation (OTP 123456, not legally filed)
//   real → core       (real OTP, legally filed)
const getBaseUrl = (env: ZatcaEnv = 'demo') => zatcaBaseUrl(env);

const LOG_FILE = path.join(process.cwd(), 'zatca-api-logs.json');

export async function logToTrace(entry: any) {
    try {
        let logs = [];
        if (fs.existsSync(LOG_FILE)) {
            const content = fs.readFileSync(LOG_FILE, 'utf8');
            try {
                logs = JSON.parse(content);
            } catch (e) { logs = []; }
        }
        const logEntry = {
            ...entry,
            request: entry.request || {},
            timestamp: new Date().toISOString()
        };
        logs.unshift(logEntry);
        fs.writeFileSync(LOG_FILE, JSON.stringify(logs.slice(0, 100), null, 2));
    } catch (e) {
        console.error("LOG TO TRACE ERROR:", e);
    }
}

interface ZATCAResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Step 1: Request Compliance CSID
 */
export async function requestComplianceCSID(b64CSR: string, otp: string, env: ZatcaEnv = 'demo'): Promise<ZATCAResponse> {
    const baseUrl = getBaseUrl(env);
    const endpoint = `${baseUrl}/compliance`;
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'OTP': otp.toString(),
        'Accept-Version': 'V2',
        'Accept-Language': 'en'
    };
    const bodyData = { csr: b64CSR.trim() };
    const body = JSON.stringify(bodyData);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body
        });

        const rawText = await response.text();
        logToTrace({ endpoint: 'POST /compliance', request: bodyData, responseStatus: response.status, responseBody: rawText });

        let data;
        try { data = JSON.parse(rawText); } catch (e) { return { success: false, error: `Invalid JSON: ${rawText}` }; }

        if (!response.ok) return { success: false, error: data.message || rawText };
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Step 2: Perform Compliance Check
 */
export async function performComplianceCheck(
    b64Xml: string,
    invoiceHash: string,
    uuid: string,
    token: string,
    secret: string,
    env: ZatcaEnv = 'demo'
): Promise<ZATCAResponse> {
    const baseUrl = getBaseUrl(env);
    const auth = Buffer.from(`${token}:${secret}`).toString('base64');
    const endpoint = `${baseUrl}/compliance/invoices`;
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept-Version': 'V2',
        'Accept-Language': 'en'
    };
    const bodyData = { invoiceHash, uuid, invoice: b64Xml };
    const body = JSON.stringify(bodyData);

    try {
        const response = await fetch(endpoint, { method: 'POST', headers, body });
        const rawText = await response.text();

        logToTrace({
            endpoint: 'POST /compliance/invoices',
            request: bodyData,
            responseStatus: response.status,
            responseBody: rawText,
            headers: { ...headers, Authorization: 'Basic ******' }
        });

        let data;
        try { data = JSON.parse(rawText); } catch (e) { return { success: false, error: `Invalid JSON: ${rawText}` }; }

        if (!response.ok) {
            let errorMessage = data.message || rawText;
            if (data.validationResults?.errorMessages) {
                const combined = data.validationResults.errorMessages.map((e: any) => e.message || JSON.stringify(e)).join(' | ');
                errorMessage = `${errorMessage}: ${combined}`;
            }
            return { success: false, error: errorMessage, data };
        }
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Step 3: Request Production CSID
 */
export async function requestProductionCSID(
    complianceRequestID: string,
    token: string,
    secret: string,
    env: ZatcaEnv = 'demo'
): Promise<ZATCAResponse> {
    const baseUrl = getBaseUrl(env);
    const auth = Buffer.from(`${token}:${secret}`).toString('base64');
    const response = await fetch(`${baseUrl}/production/csids`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
            'Accept-Version': 'V2'
        },
        body: JSON.stringify({ compliance_request_id: complianceRequestID.toString() })
    });

    const rawText = await response.text();
    logToTrace({ endpoint: 'POST /production/csids', responseStatus: response.status, responseBody: rawText });

    let data;
    try { data = JSON.parse(rawText); } catch (e) { return { success: false, error: `Invalid JSON: ${rawText}` }; }
    if (!response.ok) return { success: false, error: data.message || rawText };
    return { success: true, data };
}

/**
 * Step 4/5: Submission Gateways
 */
export async function submitClearance(b64Xml: string, invoiceHash: string, uuid: string, token: string, secret: string, env: ZatcaEnv = 'demo'): Promise<ZATCAResponse> {
    const baseUrl = getBaseUrl(env);
    const auth = Buffer.from(`${token}:${secret}`).toString('base64');
    const response = await fetch(`${baseUrl}/invoices/clearance/single`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
            'Accept-Version': 'V2',
            'Clearance-Status': '1'
        },
        body: JSON.stringify({ invoiceHash, uuid, invoice: b64Xml })
    });
    const rawText = await response.text();
    logToTrace({ endpoint: 'POST /clearance', responseStatus: response.status, responseBody: rawText });
    return response.ok ? { success: true, data: JSON.parse(rawText) } : { success: false, error: rawText };
}

export async function submitReporting(b64Xml: string, invoiceHash: string, uuid: string, token: string, secret: string, env: ZatcaEnv = 'demo'): Promise<ZATCAResponse> {
    const baseUrl = getBaseUrl(env);
    const auth = Buffer.from(`${token}:${secret}`).toString('base64');
    const response = await fetch(`${baseUrl}/invoices/reporting/single`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
            'Accept-Version': 'V2'
        },
        body: JSON.stringify({ invoiceHash, uuid, invoice: b64Xml })
    });
    const rawText = await response.text();
    logToTrace({ endpoint: 'POST /reporting', responseStatus: response.status, responseBody: rawText });
    return response.ok ? { success: true, data: JSON.parse(rawText) } : { success: false, error: rawText };
}
