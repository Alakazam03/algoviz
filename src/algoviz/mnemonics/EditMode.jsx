import { useState, useEffect } from 'react';

export default function EditMode({ m, onSave }) {
  const [steps, setSteps] = useState([...m.steps]);
  const [detail, setDetail] = useState([...(m.detail || [])]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSteps([...m.steps]);
    setDetail([...(m.detail || [])]);
    setSaved(false);
  }, [m.id]);

  return (
    <div style={{ background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10, padding: 16 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
        Edit - {m.name}
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{
          display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 10px',
          background: '#12121f', border: '1px solid #1a1a2e', borderRadius: 7, marginBottom: 6,
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6ee7b7', width: 18, marginTop: 7 }}>{i + 1}</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <input value={s} onChange={e => { const n = [...steps]; n[i] = e.target.value; setSteps(n); setSaved(false); }}
              style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a2e', borderRadius: 5, color: '#e2e8f0', fontSize: 13, padding: '5px 8px', outline: 'none' }} />
            <input value={detail[i] || ''} onChange={e => { const n = [...detail]; n[i] = e.target.value; setDetail(n); setSaved(false); }}
              placeholder="Explanation..."
              style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a2e', borderRadius: 5, color: '#64748b', fontSize: 11, padding: '3px 8px', outline: 'none' }} />
          </div>
          <button onClick={() => { setSteps(steps.filter((_, j) => j !== i)); setDetail(detail.filter((_, j) => j !== i)); setSaved(false); }}
            style={{ background: 'transparent', border: 'none', color: '#ef444488', cursor: 'pointer', fontSize: 16, marginTop: 4 }}>x</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => { setSteps([...steps, '']); setDetail([...detail, '']); setSaved(false); }}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #1a1a2e', background: 'transparent', color: '#64748b', fontSize: 11, cursor: 'pointer' }}>+ Step</button>
        <button onClick={() => { onSave(m.id, steps.filter(s => s.trim()), detail); setSaved(true); }}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: '#6ee7b7', color: '#000', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Save</button>
        {saved && <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6ee7b7', alignSelf: 'center' }}>~ Saved</span>}
      </div>
    </div>
  );
}
