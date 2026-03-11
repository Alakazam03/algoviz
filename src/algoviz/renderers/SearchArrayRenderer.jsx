export default function SearchArrayRenderer({ data }) {
  if (!data) return null;
  const {
    values = [], lo = 0, mid = -1, hi = values.length - 1,
    target, found = null, eliminated = [],
  } = data;

  const elimSet = new Set(eliminated);

  const pointerColor = (i) => {
    if (i === found) return '#22c55e';
    if (i === mid) return '#fbbf24';
    if (i === lo || i === hi) return '#60a5fa';
    return null;
  };

  const pointerLabel = (i) => {
    const labels = [];
    if (i === lo) labels.push('lo');
    if (i === hi) labels.push('hi');
    if (i === mid) labels.push('mid');
    if (i === found) labels.push('FOUND');
    return labels.join('/');
  };

  return (
    <div>
      {target != null && (
        <div style={{
          fontFamily: 'monospace', fontSize: 11, color: '#fbbf24',
          marginBottom: 8, padding: '4px 10px', borderRadius: 5,
          background: '#fbbf240a', border: '1px solid #fbbf2422',
          display: 'inline-block',
        }}>target = {target}</div>
      )}

      <div style={{ display: 'flex', gap: 3 }}>
        {values.map((v, i) => {
          const isElim = elimSet.has(i);
          const pc = pointerColor(i);
          const isActive = i >= lo && i <= hi && !isElim;

          let bg = '#080810', bc = '#1e293b', color = '#334155';
          if (i === found) { bg = '#22c55e15'; bc = '#22c55e'; color = '#22c55e'; }
          else if (i === mid) { bg = '#fbbf2415'; bc = '#fbbf24'; color = '#fde68a'; }
          else if (isActive) { bg = '#60a5fa0a'; bc = '#60a5fa44'; color = '#60a5fa'; }
          else if (isElim) { bg = '#080810'; bc = '#0e0e1a'; color = '#1e293b'; }

          return (
            <div key={i} style={{
              flex: 1, textAlign: 'center', fontFamily: 'monospace',
              transition: 'all 0.25s',
            }}>
              {/* Pointer labels above */}
              <div style={{
                fontSize: 8, height: 14, color: pc || 'transparent',
                fontWeight: 700,
              }}>{pointerLabel(i)}</div>
              {/* Cell */}
              <div style={{
                fontSize: 12, padding: '8px 2px', borderRadius: 5,
                background: bg, border: `1px solid ${bc}`, color,
                fontWeight: pc ? 700 : 400,
              }}>{v}</div>
              {/* Index below */}
              <div style={{ fontSize: 8, color: '#1e293b', marginTop: 2 }}>[{i}]</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
