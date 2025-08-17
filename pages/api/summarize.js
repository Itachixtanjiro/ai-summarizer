import { supabase } from '../../lib/supabaseClient';
import { generateSummaryWithGroq } from '../../lib/groqService';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow',['POST']); return res.status(405).json({ error:`Method ${req.method} Not Allowed`}); }
  const { transcript, instruction } = req.body || {};
  if (!transcript || !instruction) return res.status(400).json({ error: 'Transcript and instruction are required.' });

  try {
    const summary_md = await generateSummaryWithGroq(transcript, instruction);
    const titleMatch = summary_md.match(/^#\s*(.*)/);
    const title = titleMatch ? titleMatch[1] : 'Untitled Summary';
    const { data, error } = await supabase.from('summaries').insert([{ instruction, summary_md, title, transcript_text: transcript, llm_model: 'llama-3.1-8b-instant' }]).select().single();
    if (error) throw new Error(error.message);
    return res.status(200).json(data);
  } catch (e) {
    console.error('Error in /api/summarize:', e);
    return res.status(500).json({ error: e.message || 'Failed to generate summary.' });
  }
}
