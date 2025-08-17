import { supabase } from '../../lib/supabaseClient';
import { sendEmailWithResend } from '../../lib/resendService';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { summary_id, recipients, subject, body_markdown } = req.body || {};
  if (!summary_id || !recipients || !recipients.length) return res.status(400).json({ error: 'Missing required fields.' });

  try {
    const emailData = await sendEmailWithResend({ recipients, subject, body_markdown });
    await supabase.from('shares').insert([{ summary_id, recipients, status:'sent', provider_message_id: emailData.id }]);
    return res.status(200).json({ status:'sent', provider_message_id: emailData.id });
  } catch (e) {
    console.error('Error in /api/share:', e);
    await supabase.from('shares').insert([{ summary_id, recipients, status:'failed' }]);
    return res.status(500).json({ error: e.message || 'Failed to send email.' });
  }
}
