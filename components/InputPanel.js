import React, { useRef, useState } from 'react';

export default function InputPanel({ transcript, setTranscript, instruction, setInstruction, onGenerate, isLoading }) {
  const fileRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const onFile = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (evt) => setTranscript(String(evt.target.result || ''));
    reader.readAsText(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    onFile(f);
  };

  return (
    <section className="space-y-4">
      <div className="card">
        <div className="card-header">1. Your Transcript</div>
        <div className="card-body">
          <div
            className={`border-2 border-dashed rounded-xl p-4 mb-3 text-center transition
              ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
          >
            <p className="text-sm text-gray-600 mb-2">Drag & drop a .txt/.md file here</p>
            <button onClick={() => fileRef.current?.click()} className="btn-ghost">⬆️ Upload Transcript (.txt)</button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.markdown"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>

          <textarea
            className="textarea"
            placeholder="Paste your transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>Characters: {transcript.length}</span>
            <span>Tip: longer meetings? We can add chunking later.</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">2. Custom Instruction</div>
        <div className="card-body">
          <input
            className="input"
            placeholder="e.g., Bullet points for execs with actions first"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
        </div>
      </div>

      <button onClick={onGenerate} disabled={isLoading} className="btn-primary w-full">
        {isLoading ? 'Generating…' : '✨ Generate Summary'}
      </button>
    </section>
  );
}
