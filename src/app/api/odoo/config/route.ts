import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { supabaseAdmin } from '@/lib/supabase';
import { OdooClient } from '@/lib/odoo/client';
import { encryptSecret, decryptSecret } from '@/lib/secrets';

/**
 * GET /api/odoo/config
 * Retrieves Odoo configuration for the authenticated tenant.
 */
export async function GET(req: NextRequest) {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
        return NextResponse.json({ error: 'Missing API Key' }, { status: 401 });
    }

    const org = await AuthService.validateAPIKey(apiKey) as any;
    if (!org) {
        return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('odoo_config')
            .select('odoo_url, odoo_db, odoo_username, auto_submit, status, last_sync')
            .eq('organization_id', org.id)
            .maybeSingle();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            config: data || {
                odoo_url: '',
                odoo_db: '',
                odoo_username: '',
                auto_submit: true,
                status: 'disconnected',
            }
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

/**
 * POST /api/odoo/config
 * Handles saving config, testing connection, and auto-provisioning custom fields.
 */
export async function POST(req: NextRequest) {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
        return NextResponse.json({ error: 'Missing API Key' }, { status: 401 });
    }

    const org = await AuthService.validateAPIKey(apiKey) as any;
    if (!org) {
        return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { 
            odooUrl, 
            odooDb, 
            odooUsername, 
            odooPassword, 
            autoSubmit = true,
            action = 'save' // 'save' | 'test' | 'provision'
        } = body;

        if (!odooUrl || !odooDb || !odooUsername) {
            return NextResponse.json({ error: 'Odoo URL, Database, and Username are required' }, { status: 400 });
        }

        // Initialize Odoo client
        // If password is not provided for 'test' or 'provision', we'll look up the existing one in the DB
        let finalPassword = odooPassword;
        if (!finalPassword) {
            const { data: existing } = await supabaseAdmin
                .from('odoo_config')
                .select('odoo_password')
                .eq('organization_id', org.id)
                .maybeSingle();
            // Stored password is encrypted at rest — decrypt before use.
            finalPassword = decryptSecret(existing?.odoo_password) || existing?.odoo_password;
        }

        if (!finalPassword && (action === 'test' || action === 'provision' || action === 'save')) {
            return NextResponse.json({ error: 'Odoo Password/API Key is required' }, { status: 400 });
        }

        const odoo = new OdooClient({
            odooUrl,
            odooDb,
            odooUsername,
            odooPassword: finalPassword
        });

        // ------------------------------------------
        // ACTION A: TEST CONNECTION
        // ------------------------------------------
        if (action === 'test') {
            const testResult = await odoo.testConnection();
            if (!testResult.success) {
                return NextResponse.json({ success: false, error: testResult.error }, { status: 422 });
            }
            return NextResponse.json({ success: true, message: 'Odoo Connection Verified Successfully!' });
        }

        // ------------------------------------------
        // ACTION B: PROVISION FIELDS
        // ------------------------------------------
        if (action === 'provision') {
            const provResult = await odoo.provisionCustomFields();
            if (!provResult.success) {
                return NextResponse.json({ 
                    success: false, 
                    error: 'Some fields failed to create', 
                    created: provResult.created,
                    errors: provResult.errors 
                }, { status: 422 });
            }
            return NextResponse.json({ 
                success: true, 
                message: 'Custom fields verified and provisioned successfully!',
                created: provResult.created 
            });
        }

        // ------------------------------------------
        // ACTION C: SAVE CONFIG
        // ------------------------------------------
        if (action === 'save') {
            // First verify connection before saving
            const testResult = await odoo.testConnection();
            const configStatus = testResult.success ? 'connected' : 'disconnected';

            const dbData: Record<string, any> = {
                organization_id: org.id,
                odoo_url: odooUrl,
                odoo_db: odooDb,
                odoo_username: odooUsername,
                auto_submit: autoSubmit,
                status: configStatus,
                updated_at: new Date().toISOString()
            };

            // Only update password if a new one is typed/sent — encrypted at rest,
            // matching the saveOdooConnection server action so both write paths agree.
            if (odooPassword) {
                dbData.odoo_password = encryptSecret(odooPassword);
            }

            const { error: upsertError } = await supabaseAdmin
                .from('odoo_config')
                .upsert(dbData, { onConflict: 'organization_id' });

            if (upsertError) throw upsertError;

            if (!testResult.success) {
                return NextResponse.json({
                    success: true,
                    status: 'saved_disconnected',
                    message: `Settings saved but connection check failed: ${testResult.error}`
                });
            }

            return NextResponse.json({
                success: true,
                status: 'saved_connected',
                message: 'Odoo configuration saved and connection verified successfully!'
            });
        }

        return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
