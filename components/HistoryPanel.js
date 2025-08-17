import React, { useMemo, useState } from 'react';

export default function HistoryPanel({ history = [], onSelectSummary, currentSummaryId, onRefresh }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return history;
    return history.filter(h =>
      (h.title || 'Untitled Summary').toLowerCase().includes(q.toLowerCase())
    );
  }, [q, history]);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📘</span>
          <span>History</span>
        </div>
        <button className="btn-ghost" onClick={onRefresh} title="Reload">⟲</button>
      </div>
      <div className="card-body">
        <input
          className="input mb-3"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <ul className="space-y-2 scrolly">
          {filtered.length === 0 && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>🗒️</span> No summaries found.
            </div>
          )}
          {filtered.map(item => (
            <li
              key={item.id}
              onClick={() => onSelectSummary(item)}
              className={`p-3 rounded-xl border cursor-pointer transition
                 ${currentSummaryId === item.id
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold truncate">{item.title || 'Untitled Summary'}</p>
                <span className="badge">MD</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

