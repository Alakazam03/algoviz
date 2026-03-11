import { useState, useEffect } from 'react';
import { CC } from '../theme';

export default function FlashcardMode({ items }) {
  const [deck, setDeck] = useState([]);
  const [cur, setCur] = useState(0);
  const [flip, setFlip] = useState(false);
  const [res, setRes] = useState({ ok: 0, bad: 0 });
  const [fin, setFin] = useState(false);

  useEffect(() => {
    setDeck([...items].sort(() => Math.random() - 0.5));
    setCur(0); setFlip(false); setRes({ ok: 0, bad: 0 }); setFin(false);
  }, [items.length]);

  const m = deck[cur];
  const tot = deck.length;

  const handleResult = (ok) => {
    setRes(r => ({ ...r, [ok ? 'ok' : 'bad']: r[ok ? 'ok' : 'bad'] + 1 }));
    if (cur >= tot - 1) setFin(true);
    else { setCur(c => c + 1); setFlip(false); }
  };

  const restart = () => {
    setDeck(d => [...d].sort(() => Math.random() - 0.5));
    setCur(0); setFlip(false); setRes({ ok: 0, bad: 0 }); setFin(false);
  };

  if (!m || fin) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40, gap: 14 }}>
      <div style={{ fontSize: 36 }}>Done!</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Session Complete!</div>
      <div style={{ fontFamily: 'monospace', fontSize: 14, display: 'flex', gap: 16 }}>
        <span style={{ color: '#22c55e' }}>OK {res.ok}</span>
        <span style={{ color: '#ef4444' }}>X {res.bad}</span>
        <span style={{ color: '#475569' }}>/ {tot}</span>
      </div>
      <button onClick={restart} style={{
        padding: '9px 22px', borderRadius: 8, border: 'none', background: '#6ee7b7',
        color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer',
      }}>Shuffle & Restart</button>
    </div>
  );

  const col = CC[m.cat] || '#6ee7b7';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '16px 0' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 520 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569' }}>{cur + 1}/{tot}</span>
        <div style={{ flex: 1, height: 4, background: '#12121f', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${(cur / tot) * 100}%`, height: '100%', background: '#6ee7b7', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#22c55e' }}>OK {res.ok}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#ef4444' }}>X {res.bad}</span>
      </div>
      {/* Card */}
      <div onClick={() => setFlip(f => !f)} style={{
        width: '100%', maxWidth: 520, minHeight: 260,
        background: '#0d0d1a', border: `1px solid ${flip ? col + '44' : '#1a1a2e'}`,
        borderRadius: 14, padding: 22, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        transition: 'all 0.25s', boxShadow: flip ? `0 0 30px ${col}08` : 'none',
      }}>
        {!flip ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: col, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{m.cat}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{m.name}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>What are the steps?</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#2a2a40', marginTop: 18 }}>tap to reveal</div>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: col, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{m.name}</div>
            {m.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '5px 10px', borderLeft: `2px solid ${col}44` }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: col, width: 14 }}>{i + 1}</span>
                <span style={{ fontSize: 13 }}>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {flip && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => handleResult(false)} style={{
            padding: '9px 24px', borderRadius: 8, border: '1px solid #ef444444',
            background: '#ef444410', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>X Wrong</button>
          <button onClick={() => handleResult(true)} style={{
            padding: '9px 24px', borderRadius: 8, border: 'none',
            background: '#22c55e', color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>OK Right</button>
        </div>
      )}
    </div>
  );
}
