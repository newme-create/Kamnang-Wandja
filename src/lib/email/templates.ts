import { QuoteRequestRow } from '../types/database';

/**
 * Generates an HTML email for Admin notification on new quote request.
 */
export function getAdminNewQuoteEmailTemplate(quote: QuoteRequestRow): { subject: string; html: string; text: string } {
  const subject = `[NOUVEAU DEVIS BÂTIR PRO] ${quote.project_type} - ${quote.client_name}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background-color: #090b0e; padding: 24px; text-align: center; border-bottom: 4px solid #f06a1d; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 28px; }
    .badge { display: inline-block; padding: 4px 12px; background-color: #fff7ed; color: #f06a1d; border: 1px solid #fed7aa; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
    .field-group { margin-bottom: 16px; }
    .field-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .description-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; }
    .button { display: inline-block; background-color: #f06a1d; color: #ffffff !important; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-top: 20px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BÂTIR PRO • NOUVELLE DEMANDE DE DEVIS</h1>
    </div>
    <div class="content">
      <div style="margin-bottom: 20px;">
        <span class="badge">${quote.project_type}</span>
      </div>
      <p style="font-size: 16px; margin-top: 0;">Une nouvelle demande de chiffrage vient d'être déposée sur la plateforme :</p>
      
      <div class="field-group">
        <div class="field-label">Nom du Client</div>
        <div class="field-value">${quote.client_name}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Téléphone</div>
        <div class="field-value"><a href="tel:${quote.client_phone}" style="color: #f06a1d; text-decoration: none;">${quote.client_phone}</a></div>
      </div>
      <div class="field-group">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${quote.client_email}" style="color: #f06a1d; text-decoration: none;">${quote.client_email}</a></div>
      </div>
      <div class="field-group">
        <div class="field-label">Date de soumission</div>
        <div class="field-value">${new Date(quote.created_at).toLocaleString('fr-FR')}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Description du projet</div>
        <div class="description-box">${quote.project_description.replace(/\n/g, '<br>')}</div>
      </div>

      <div style="text-align: center;">
        <a href="/admin/devis?id=${quote.id}" class="button">Traiter ce devis dans l'Espace Admin</a>
      </div>
    </div>
    <div class="footer">
      BÂTIR PRO SARL • Direction Technique & Chiffrage • ID Référence: ${quote.id}
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NOUVELLE DEMANDE DE DEVIS - BÂTIR PRO
------------------------------------------
Client: ${quote.client_name}
Téléphone: ${quote.client_phone}
Email: ${quote.client_email}
Type de projet: ${quote.project_type}
Date: ${new Date(quote.created_at).toLocaleString('fr-FR')}

Description:
${quote.project_description}

Traiter la demande: /admin/devis?id=${quote.id}
  `;

  return { subject, html, text };
}

/**
 * Generates an HTML email for Client acknowledgement upon quote submission.
 */
export function getClientAckEmailTemplate(quote: QuoteRequestRow): { subject: string; html: string; text: string } {
  const subject = `Confirmation de réception de votre demande de devis • BÂTIR PRO`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background-color: #090b0e; padding: 24px; text-align: center; border-bottom: 4px solid #f06a1d; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 28px; line-height: 1.6; }
    .highlight-card { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 18px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BÂTIR PRO</h1>
    </div>
    <div class="content">
      <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Bonjour ${quote.client_name},</h2>
      <p>Nous avons bien reçu votre demande de devis pour votre projet de type <strong>${quote.project_type}</strong>.</p>
      
      <div class="highlight-card">
        <div style="font-weight: bold; color: #f06a1d; margin-bottom: 8px; font-size: 13px; text-transform: uppercase;">Récapitulatif de votre demande :</div>
        <div style="font-size: 14px; color: #334155;"><strong>Référence :</strong> ${quote.id.substring(0, 8).toUpperCase()}</div>
        <div style="font-size: 14px; color: #334155;"><strong>Prestation :</strong> ${quote.project_type}</div>
        <div style="font-size: 14px; color: #334155; margin-top: 6px;"><strong>Délai d'étude :</strong> Nos ingénieurs et métreurs étudient votre dossier sous 24h à 48h ouvrées.</div>
      </div>

      <p>Un chargé d'affaires prendra contact avec vous par téléphone au <strong>${quote.client_phone}</strong> si des détails techniques ou une visite sur site sont nécessaires.</p>

      <p style="margin-top: 24px;">Cordialement,<br><strong>L'équipe technique BÂTIR PRO</strong><br><span style="font-size: 13px; color: #64748b;">Génie Civil • Construction • Rénovation</span></p>
    </div>
    <div class="footer">
      BÂTIR PRO SARL • Boulevard de la Liberté, Douala • contact@batir-pro.com
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Bonjour ${quote.client_name},

Nous accusons bonne réception de votre demande de devis concernant votre projet : ${quote.project_type}.
Référence : ${quote.id.substring(0, 8).toUpperCase()}

Nos équipes techniques analysent vos éléments sous 24h à 48h.
Contact : contact@batir-pro.com / +237 6 00 00 00 00

L'équipe BÂTIR PRO
  `;

  return { subject, html, text };
}

/**
 * Generates an HTML email for Client when quote status changes to 'quoted'.
 */
export function getClientQuoteReadyEmailTemplate(quote: QuoteRequestRow): { subject: string; html: string; text: string } {
  const subject = `Votre devis chiffré est prêt • BÂTIR PRO (${quote.project_type})`;
  const formattedAmount = quote.estimated_amount
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(quote.estimated_amount)
    : 'Chiffrage personnalisé';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background-color: #090b0e; padding: 24px; text-align: center; border-bottom: 4px solid #f06a1d; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 28px; line-height: 1.6; }
    .amount-box { background: #0f172a; color: #ffffff; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0; }
    .amount-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; }
    .amount-value { font-size: 28px; font-weight: 800; color: #f06a1d; margin-top: 6px; }
    .button { display: inline-block; background-color: #f06a1d; color: #ffffff !important; padding: 14px 28px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-top: 10px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BÂTIR PRO • DEVIS FINALISÉ</h1>
    </div>
    <div class="content">
      <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Bonjour ${quote.client_name},</h2>
      <p>Nos métreurs et ingénieurs ont finalisé l'étude quantitative et estimative pour votre projet de <strong>${quote.project_type}</strong>.</p>
      
      <div class="amount-box">
        <div class="amount-label">Estimation Globale des Travaux</div>
        <div class="amount-value">${formattedAmount}</div>
        ${quote.admin_notes ? `<div style="font-size: 13px; color: #cbd5e1; margin-top: 12px; border-top: 1px solid #334155; pt-2;">Note technique : ${quote.admin_notes}</div>` : ''}
      </div>

      ${
        quote.quote_file_url
          ? `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${quote.quote_file_url}" target="_blank" class="button">Télécharger le Devis Détaillé (PDF)</a>
      </div>
      `
          : ''
      }

      <p>Pour valider cette proposition ou planifier une réunion de cadrage sur site, vous pouvez répondre directement à cet email ou joindre votre chargé d'affaires.</p>

      <p style="margin-top: 24px;">Cordialement,<br><strong>Le Bureau d'Études BÂTIR PRO</strong></p>
    </div>
    <div class="footer">
      BÂTIR PRO SARL • Réf: ${quote.id} • Devis valable 30 jours
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Bonjour ${quote.client_name},

Votre devis chiffré BÂTIR PRO pour "${quote.project_type}" est disponible.
Montant estimé: ${formattedAmount}
${quote.quote_file_url ? `Télécharger le devis PDF: ${quote.quote_file_url}` : ''}
${quote.admin_notes ? `Notes techniques: ${quote.admin_notes}` : ''}

Contactez-nous pour toute question au +237 6 00 00 00 00.
  `;

  return { subject, html, text };
}
