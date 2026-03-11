import { useState, useEffect, useRef } from 'react';

export default function QuizMode({ m }) {
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState([]);
  const refs = useRef({});

  useEffect(() => {
    const ct = Math.max(1, Math.ceil(m.steps.length * 0.6));
    const idx = [...Array(m.steps.length).keys()].sort(() => Math.random() - 0.5);
    setHidden(idx.slice(0, ct).sort((a, b) => a - b));
    setAns({});
    setDone(false);
  }, [m.id]);

  const check = (i, inp) => {
    const tw = m.steps[i].toLowerCase().split(/\s+/);
    const aw = (inp || '').toLowerCase().split(/\s+/);
    let mt = 0;
    tw.forEach(t => { if (aw.some(a => t.includes(a) || a.includes(t))) mt++; });
    return mt / tw.length > 0.5;
  };

  const score = done ? hidden.filter(i => check(i, ans[i])).length : 0;

  return (
    <div style={{ background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 2 }}>Fill in the missing steps</div>
        {done && (
          <div style={{
            fontFamily: 'monospace', fontSize: 12, padding: '3px 10px', borderRadius: 6,
            background: score === hidden.length ? '#22c55e12' : '#fbbf2412',
            color: score === hidden.length ? '#22c55e' : '#fbbf24',
            border: `1px solid ${score === hidden.length ? '#22c55e44' : '#fbbf2444'}`,
          }}>{score}/{hidden.length}</div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {m.steps.map((s, i) => {
          const isH = hidden.includes(i);
          const ok = done && isH && check(i, ans[i]);
          const bad = done && isH && !ok;
          if (!isH) return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 11px', borderLeft: '3px solid #6ee7b733' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6ee7b7', width: 14 }}>~</span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{s}</span>
            </div>
          );
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '5px 11px', borderRadius: 7,
              borderLeft: `3px solid ${ok ? '#22c55e55' : bad ? '#ef444455' : '#fbbf2444'}`,
              background: ok ? '#22c55e08' : bad ? '#ef444408' : '#fbbf2406',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#fbbf24', width: 14 }}>{i + 1}</span>
              <input ref={el => refs.current[i] = el} placeholder={`Step ${i + 1}...`}
                value={ans[i] || ''} disabled={done}
                onChange={e => setAns(a => ({ ...a, [i]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { const nx = hidden.find(h => h > i); if (nx !== undefined) refs.current[nx]?.focus(); } }}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: ok ? '#22c55e' : bad ? '#ef4444' : '#e2e8f0', fontSize: 13, padding: '4px 0',
                }} />
              {bad && <span style={{ fontSize: 11, color: '#ef444488' }}>-> {s}</span>}
              {ok && <span style={{ fontSize: 11, color: '#22c55e' }}>~</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {!done ? (
          <button onClick={() => setDone(true)} style={{
            padding: '7px 18px', borderRadius: 7, border: 'none', background: '#6ee7b7',
            color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>Check</button>
        ) : (
          <button onClick={() => {
            const ct = Math.max(1, Math.ceil(m.steps.length * 0.6));
            const idx = [...Array(m.steps.length).keys()].sort(() => Math.random() - 0.5);
            setHidden(idx.slice(0, ct).sort((a, b) => a - b));
            setAns({});
            setDone(false);
          }} style={{
            padding: '7px 18px', borderRadius: 7, border: '1px solid #1a1a2e',
            background: 'transparent', color: '#e2e8f0', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Retry</button>
        )}
      </div>
    </div>
  );
}
