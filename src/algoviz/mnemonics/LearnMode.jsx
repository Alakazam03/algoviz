import { useState, useEffect } from 'react';
import { CC } from '../theme';

export default function LearnMode({ m }) {
  const [rev, setRev] = useState(-1);
  const col = CC[m.cat] || '#6ee7b7';
  useEffect(() => setRev(-1), [m.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Flow chain */}
      <div style={{ background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10, padding: 14 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Mnemonic Pattern</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {m.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div onClick={() => setRev(rev === i ? -1 : i)} style={{
                padding: '7px 14px', borderRadius: 7, cursor: 'pointer',
                background: rev === i ? col + '18' : '#12121f',
                border: `1px solid ${rev === i ? col + '55' : '#1a1a2e'}`,
                color: rev === i ? col : '#e2e8f0', fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
              }}>{s}</div>
              {i < m.steps.length - 1 && <span style={{ color: '#2a2a40', fontSize: 14 }}>-></span>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Steps detail */}
        <div style={{ background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10, padding: 14 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Steps (click to expand)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {m.steps.map((s, i) => (
              <div key={i} onClick={() => setRev(rev === i ? -1 : i)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 11px',
                borderRadius: 7, cursor: 'pointer',
                borderLeft: `3px solid ${rev === i ? col + '66' : '#6ee7b733'}`,
                background: rev === i ? col + '0c' : 'transparent', transition: 'all 0.2s',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: rev === i ? col : '#6ee7b7', width: 14, flexShrink: 0 }}>
                  {rev === i ? '>' : '~'}
                </span>
                <span style={{ fontSize: 13, color: rev === i ? col : '#94a3b8' }}>{s}</span>
              </div>
            ))}
          </div>
          {rev >= 0 && m.detail?.[rev] && (
            <div style={{
              marginTop: 10, padding: '10px 14px', borderRadius: 7,
              background: col + '08', border: `1px solid ${col}22`,
              fontSize: 12, color: '#c0cfe0', lineHeight: 1.7,
            }}>
              <strong style={{ color: col }}>Step {rev + 1}:</strong> {m.detail[rev]}
            </div>
          )}
        </div>
        {/* Pseudocode */}
        <div style={{ background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10, padding: 14 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Pseudocode</div>
          <pre style={{
            fontFamily: 'monospace', fontSize: 11, lineHeight: 1.85, padding: 12, borderRadius: 8,
            background: '#080810', border: '1px solid #1a1a2e', color: '#a8b8c8',
            overflow: 'auto', whiteSpace: 'pre', margin: 0,
          }}>{m.code}</pre>
        </div>
      </div>
    </div>
  );
}
