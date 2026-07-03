import { supabaseAdmin } from '@/lib/supabase';

/**
 * Idempotency guard: returns a prior CLEARED/REPORTED record for this
 * (organization, invoice number) if one exists, else null. Callers use it to
 * avoid re-filing the same invoice with ZATCA on a retry (the natural key is the
 * invoice number, which is unique per tenant).
 */
export async function priorFiled(orgId: string, invoiceNumber?: string | null) {
    if (!orgId || !invoiceNumber) return null;
    const { data } = await supabaseAdmin
        .from('invoices')
        .select('invoice_number, invoice_type, zatca_status, zatca_uuid, qr_code, xml')
        .eq('organization_id', orgId)
        .eq('invoice_number', invoiceNumber)
        .not('zatca_uuid', 'is', null)
        .maybeSingle();
    return data?.zatca_uuid ? data : null;
}
