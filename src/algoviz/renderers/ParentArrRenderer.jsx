export default function ParentArrRenderer({ data }) {
  if (!data) return null;
  const { parent = [], rank, highlighted = [] } = data;
  if (!parent.length) return null;

  const hlSet = new Set(highlighted);

  return (
    <div>
      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#475569',
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 5,
      }}>parent[]</div>
      <div style={{ display: 'flex', gap: 3 }}>
        {parent.map((v, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: 11,
            padding: '6px 2px', borderRadius: 5,
            border: `1px solid ${v === i ? '#6ee7b744' : hlSet.has(i) ? '#f472b644' : '#1e293b'}`,
            color: v === i ? '#6ee7b7' : hlSet.has(i) ? '#f472b6' : '#94a3b8',
            background: hlSet.has(i) ? '#f472b60a' : '#080810',
            transition: 'all 0.2s',
          }}>{v}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 1 }}>
        {parent.map((_, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: 8, color: '#1e293b',
          }}>[{i}]</div>
        ))}
      </div>
      {rank && (
        <>
          <div style={{
            fontFamily: 'monospace', fontSize: 9, color: '#475569',
            textTransform: 'uppercase', letterSpacing: 2, margin: '8px 0 5px',
          }}>rank[]</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {rank.map((v, i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: 11,
                padding: '4px 2px', borderRadius: 4, background: '#60a5fa0a',
                border: '1px solid #60a5fa22', color: '#60a5fa',
              }}>{v}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
