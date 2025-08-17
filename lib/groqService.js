import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an assistant that produces structured, concise, business-ready meeting notes.
Always return valid markdown with sections in this order:
# Title
## TL;DR
## Key Decisions
## Action Items (who/what/when)
## Risks/Dependencies
## Open Questions
Be faithful to the transcript; avoid hallucination. The title must be a '# ' H1.`;

export async function generateSummaryWithGroq(transcript, instruction) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined');
  }
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `TRANSCRIPT:\n"""${transcript}"""\n\nINSTRUCTION: ${instruction}` },
  ];
  const resp = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant', // cheap+fast, adjust as you like
    temperature: 0.2,
    messages,
  });
  const content = resp.choices?.[0]?.message?.content || '';
  if (!content) throw new Error('LLM returned an empty summary');
  return content;
}
