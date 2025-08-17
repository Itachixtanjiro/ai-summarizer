import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

export async function sendEmailWithResend({ recipients, subject, body_markdown }) {
  if (!process.env.RESEND_API_KEY || !fromEmail) {
    throw new Error("Resend API key and 'From' email must be configured.");
  }

  // very simple markdown-safe wrapper
  const body_html = `<div style="font-family: Inter, system-ui, Arial; white-space: pre-wrap;">${
    String(body_markdown || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }</div>`;

  const { data, error } = await resend.emails.send({
    from: fromEmail,                                      // must be allowed by Resend
    to: Array.isArray(recipients) ? recipients : [recipients],
    subject: subject || 'Meeting Summary',
    html: body_html,
  });

  if (error) {
    // <<< this is what you were missing
    console.error('Resend error details:', error);
    throw new Error(error.message || JSON.stringify(error));
  }
  return data;
}

