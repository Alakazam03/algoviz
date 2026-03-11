export default function DPTableRenderer({ data }) {
  if (!data) return null;
  const {
    values = [], highlighted = [], computed = [],
    labels = [], arrows = [], title = 'dp[]',
  } = data;

  const hlSet = new Set(highlighted);
  const compSet = new Set(computed);

  return (
    <div>
      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#475569',
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6,
      }}>{title}</div>

      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {values.map((v, i) => {
          const isHL = hlSet.has(i);
          const isComp = compSet.has(i);

          let bg = '#080810', bc = '#1e293b', color = '#334155';
          if (isHL) { bg = '#fbbf2415'; bc = '#fbbf24'; color = '#fde68a'; }
          else if (isComp) { bg = '#6ee7b70a'; bc = '#6ee7b744'; color = '#6ee7b7'; }

          return (
            <div key={i} style={{
              minWidth: 38, textAlign: 'center', fontFamily: 'monospace', fontSize: 12,
              padding: '8px 4px', borderRadius: 6,
              background: bg, border: `1px solid ${bc}`, color,
              fontWeight: isHL ? 700 : 400, transition: 'all 0.25s',
            }}>
              {v != null ? v : '-'}
              <div style={{
                fontSize: 8, color: isHL ? '#fbbf2488' : '#334155', marginTop: 3,
              }}>{labels[i] ?? `[${i}]`}</div>
            </div>
          );
        })}
      </div>

      {/* Arrows showing recurrence */}
      {arrows && arrows.length > 0 && (
        <div style={{
          display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap',
        }}>
          {arrows.map((a, i) => (
            <span key={i} style={{
              fontFamily: 'monospace', fontSize: 10, color: '#fbbf2488',
            }}>{a}</span>
          ))}
        </div>
      )}
    </div>
  );
}
