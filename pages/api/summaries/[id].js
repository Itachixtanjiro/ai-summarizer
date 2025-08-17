import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('summaries').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: error.message });
    return res.status(200).json(data);
  }
  if (req.method === 'PUT') {
    const { summary_md, title } = req.body || {};
    const updates = {};
    if (summary_md !== undefined) updates.summary_md = summary_md;
    if (title !== undefined) updates.title = title;
    const { data, error } = await supabase.from('summaries').update(updates).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }
  res.setHeader('Allow', ['GET','PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
