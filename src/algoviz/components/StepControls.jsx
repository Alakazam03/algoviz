import { useState, useEffect, useRef } from 'react';

const SPEEDS = [
  { label: '0.5x', ms: 2000 },
  { label: '1x', ms: 1000 },
  { label: '2x', ms: 500 },
  { label: '4x', ms: 250 },
];

const btn = (active, disabled) => ({
  padding: '6px 13px', borderRadius: 6, fontSize: 12, fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer',
  border: active ? 'none' : '1px solid #1e293b',
  background: active ? '#6ee7b7' : '#0d0d1a',
  color: disabled ? '#1e293b' : active ? '#000' : '#94a3b8',
  transition: 'all 0.15s',
});

export default function StepControls({ stepIdx, totalSteps, onPrev, onNext, onReset, onJump }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);
  const atEnd = stepIdx >= totalSteps - 1;
  const atStart = stepIdx <= 0;

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (playing && !atEnd) {
      intervalRef.current = setInterval(onNext, SPEEDS[speed].ms);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, atEnd]);

  useEffect(() => { if (atEnd) setPlaying(false); }, [atEnd]);

  const handlePrev = () => { setPlaying(false); onPrev(); };
  const handleNext = () => { setPlaying(false); onNext(); };
  const handleReset = () => { setPlaying(false); onReset(); };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
      <button onClick={handlePrev} disabled={atStart} style={btn(false, atStart)}>Prev</button>
      <button onClick={() => setPlaying(p => !p)} style={btn(playing, false)}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <button onClick={handleNext} disabled={atEnd} style={btn(false, atEnd)}>Next</button>
      <button onClick={handleReset} style={{
        padding: '6px 13px', borderRadius: 6, border: '1px solid #1e293b',
        background: 'transparent', color: '#475569', fontSize: 12, cursor: 'pointer',
      }}>Reset</button>

      {/* Speed */}
      <div style={{ display: 'flex', gap: 2, marginLeft: 4 }}>
        {SPEEDS.map((s, i) => (
          <button key={i} onClick={() => setSpeed(i)} style={{
            padding: '4px 8px', borderRadius: 4, fontSize: 9, fontFamily: 'monospace',
            cursor: 'pointer', border: `1px solid ${i === speed ? '#6ee7b744' : '#1a1a2e'}`,
            background: i === speed ? '#6ee7b70e' : 'transparent',
            color: i === speed ? '#6ee7b7' : '#475569', transition: 'all 0.15s',
          }}>{s.label}</button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        flex: 1, height: 4, background: '#12121f', borderRadius: 2, marginLeft: 6,
        cursor: 'pointer', minWidth: 60,
      }} onClick={(e) => {
        const pct = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
        onJump(Math.round(pct * (totalSteps - 1)));
      }}>
        <div style={{
          width: `${totalSteps > 1 ? (stepIdx / (totalSteps - 1)) * 100 : 0}%`,
          height: '100%', background: '#6ee7b7', borderRadius: 2, transition: 'width 0.2s',
        }} />
      </div>

      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#334155' }}>
        {stepIdx}/{totalSteps - 1}
      </span>
    </div>
  );
}
