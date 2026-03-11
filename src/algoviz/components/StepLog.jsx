import { useRef, useEffect } from 'react';

export default function StepLog({ log = [] }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [log]);

  return (
    <div ref={ref} style={{
      display: 'flex', flexDirection: 'column', gap: 3,
      maxHeight: 150, overflowY: 'auto',
    }}>
      {log.map((e, i) => {
        const last = i === log.length - 1;
        const s = last ? e.status : 'done';
        return (
          <div key={i} style={{
            display: 'flex', gap: 8, padding: '4px 10px', borderRadius: 5, fontSize: 11.5,
            borderLeft: `2px solid ${s === 'active' ? '#fbbf2444' : '#6ee7b733'}`,
            background: s === 'active' ? '#fbbf240a' : 'transparent',
            color: s === 'active' ? '#fde68a' : '#7a8a9a',
          }}>
            <span style={{
              fontFamily: 'monospace', fontSize: 10, width: 14, flexShrink: 0,
              color: s === 'active' ? '#fbbf24' : '#6ee7b7',
            }}>{s === 'active' ? '>' : '~'}</span>
            <span>{e.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
