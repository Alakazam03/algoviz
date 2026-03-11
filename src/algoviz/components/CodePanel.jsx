import { useRef, useEffect } from 'react';

export default function CodePanel({ pseudocode = [], activeLine }) {
  const scrollRef = useRef(null);
  const activeSet = new Set(
    Array.isArray(activeLine) ? activeLine : activeLine != null ? [activeLine] : []
  );

  useEffect(() => {
    if (scrollRef.current && activeSet.size > 0) {
      const first = Math.min(...activeSet);
      const el = scrollRef.current.children[first + 1]; // +1 for header
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeLine]);

  return (
    <div style={{
      background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10,
      padding: 12, maxHeight: 200, overflowY: 'auto',
    }} ref={scrollRef}>
      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#475569',
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6,
      }}>Pseudocode</div>
      {pseudocode.map((line, i) => {
        const isActive = activeSet.has(i);
        return (
          <div key={i} style={{
            display: 'flex', gap: 10, padding: '3px 10px',
            background: isActive ? '#fbbf240e' : 'transparent',
            borderLeft: `2px solid ${isActive ? '#fbbf24' : 'transparent'}`,
            borderRadius: isActive ? 4 : 0,
            transition: 'all 0.2s',
          }}>
            <span style={{
              fontFamily: 'monospace', fontSize: 10, width: 18, textAlign: 'right',
              color: isActive ? '#fbbf24' : '#334155', flexShrink: 0,
            }}>{i + 1}</span>
            <pre style={{
              fontFamily: "'Courier New', monospace", fontSize: 11.5, margin: 0,
              color: isActive ? '#fde68a' : '#7a8a9a',
              fontWeight: isActive ? 600 : 400, whiteSpace: 'pre',
            }}>{line}</pre>
          </div>
        );
      })}
    </div>
  );
}
