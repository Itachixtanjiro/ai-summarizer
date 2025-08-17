import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import HistoryPanel from '../components/HistoryPanel';
import InputPanel from '../components/InputPanel';
import ResultPanel from '../components/ResultPanel';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [instruction, setInstruction] = useState('Bullet points for execs with actions first');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  async function fetchHistory() {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError('Could not load summary history.');
    else setHistory(data);
  }

  useEffect(() => { fetchHistory(); }, []);

  const onGenerate = async () => {
    if (!transcript.trim() || !instruction.trim()) {
      setError('Transcript and instruction cannot be empty.');
      return;
    }
    setIsLoading(true); setError('');
    try {
      const resp = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, instruction })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed');
      setCurrentSummary(data);
      fetchHistory();
    } catch (e) {
      setError(e.message);
    } finally { setIsLoading(false); }
  };

  const onUpdateSummary = async (summary_md) => {
    if (!currentSummary) return;
    setCurrentSummary({ ...currentSummary, summary_md });
    await fetch(`/api/summaries/${currentSummary.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary_md })
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="text-2xl">🟪</div>
          <h1 className="text-xl font-bold">AI Summarizer</h1>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-4 grid grid-cols-12 gap-6">
        {/* Left: History (sticky) */}
        <aside className="md:col-span-3 col-span-12 md:sticky md:top-4 self-start">
          <HistoryPanel
            history={history}
            onSelectSummary={setCurrentSummary}
            currentSummaryId={currentSummary?.id}
            onRefresh={fetchHistory}
          />
        </aside>

        {/* Middle: Input */}
        <main className="md:col-span-5 col-span-12">
          <InputPanel
            transcript={transcript}
            setTranscript={setTranscript}
            instruction={instruction}
            setInstruction={setInstruction}
            onGenerate={onGenerate}
            isLoading={isLoading}
          />
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </main>

        {/* Right: Result */}
        <aside className="md:col-span-4 col-span-12">
          <ResultPanel
            currentSummary={currentSummary}
            onUpdateSummary={onUpdateSummary}
          />
        </aside>
      </div>
    </div>
  );
}

