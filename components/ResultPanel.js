import React, { useMemo, useState } from 'react';

export default function ResultPanel({ currentSummary, onUpdateSummary }) {
  const [recipients, setRecipients] = useState('');
  const [status, setStatus] = useState('');

  const counts = useMemo(() => {
    const text = currentSummary?.summary_md || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { words, chars: text.length };
  }, [currentSummary?.summary_md]);

  const chips = useMemo(() => {
    return recipients
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);
  }, [recipients]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentSummary.summary_md || '');
      setStatus('Copied to clipboard ✅');
      setTimeout(() => setStatus(''), 1500);
    } catch {
      setStatus('Copy failed');
    }
  };

  const downloadMD = () => {
    const blob = new Blob([currentSummary.summary_md || ''], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${currentSummary.title || 'summary'}.md`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!chips.length) { setStatus('Please enter at least one recipient'); return; }
    setStatus('Sending…');
    try {
      const resp = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary_id: currentSummary.id,
          recipients: chips,
          subject: `Meeting Summary: ${currentSummary.title || 'Untitled'}`,
          body_markdown: currentSummary.summary_md
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to send');
      setStatus(`Sent ✔️ (id: ${data.provider_message_id})`);
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
  };

  return (
    <div className="card">
      <div className="card-header">Result</div>
      <div className="card-body">
        {!currentSummary ? (
          <div className="text-center text-gray-500 py-10">
            <div className="text-4xl mb-2">✨</div>
            <p>Your summary will appear here</p>
            <p className="text-xs mt-1">Generate a summary to get started.</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="toolbar mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="badge">{counts.words} words</span>
                <span className="badge">{counts.chars} chars</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost" onClick={copyToClipboard}>📋 Copy</button>
                <button className="btn-ghost" onClick={downloadMD}>⬇️ Download .md</button>
              </div>
            </div>

            <textarea
              className="w-full h-72 p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
              value={currentSummary.summary_md}
              onChange={(e) => onUpdateSummary(e.target.value)}
            />

            <div className="hr" />

            <div>
              <div className="font-semibold mb-2">Share via Email</div>
              <input
                className="input"
                placeholder="a@x.com, b@y.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
              {/* recipient chips preview */}
              {!!chips.length && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {chips.map((c, i) => (
                    <span key={i} className="badge">{c}</span>
                  ))}
                </div>
              )}
              <button onClick={handleShare} className="btn-primary w-full mt-3">Share</button>
              {status && <p className="text-xs text-gray-600 mt-2">{status}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
