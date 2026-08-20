import { Resend } from 'resend';
import { QuoteRequestRow } from '../types/database';
import {
  getAdminNewQuoteEmailTemplate,
  getClientAckEmailTemplate,
  getClientQuoteReadyEmailTemplate,
} from './templates';

// Initialize Resend lazily to prevent runtime startup issues if API key is not yet set
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_123456789') {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'BÂTIR PRO <devis@batir-pro.com>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@batir-pro.com';

/**
 * Sends notification emails when a new quote request is submitted.
 * Dispatches 2 emails:
 * 1. Admin alert with full client details & project description.
 * 2. Client acknowledgment with reference ID and SLA notice.
 */
export async function sendNewQuoteEmails(quote: QuoteRequestRow): Promise<{
  adminSent: boolean;
  clientSent: boolean;
  error?: string;
}> {
  const resend = getResendClient();
  const adminTemplate = getAdminNewQuoteEmailTemplate(quote);
  const clientTemplate = getClientAckEmailTemplate(quote);

  if (!resend) {
    console.info('[Email Notification] Resend API Key is not configured. Email logged in console (Dev mode):', {
      adminEmailTo: ADMIN_EMAIL,
      adminSubject: adminTemplate.subject,
      clientEmailTo: quote.client_email,
      clientSubject: clientTemplate.subject,
    });
    return { adminSent: true, clientSent: true };
  }

  try {
    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: quote.client_email,
        subject: clientTemplate.subject,
        html: clientTemplate.html,
        text: clientTemplate.text,
      }),
    ]);

    const adminSent = adminResult.status === 'fulfilled' && !adminResult.value.error;
    const clientSent = clientResult.status === 'fulfilled' && !clientResult.value.error;

    return { adminSent, clientSent };
  } catch (err: any) {
    console.error('[Email Notification Error]', err);
    return { adminSent: false, clientSent: false, error: err.message };
  }
}

/**
 * Sends notification email to client when quote status is updated to 'quoted'.
 */
export async function sendQuoteReadyEmail(quote: QuoteRequestRow): Promise<{
  sent: boolean;
  error?: string;
}> {
  const resend = getResendClient();
  const template = getClientQuoteReadyEmailTemplate(quote);

  if (!resend) {
    console.info('[Email Notification] Resend not configured. Quote ready email simulated for:', quote.client_email);
    return { sent: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: quote.client_email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('[Email Quote Ready Error]', error);
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err: any) {
    console.error('[Email Quote Ready Exception]', err);
    return { sent: false, error: err.message };
  }
}
