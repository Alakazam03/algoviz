export default function ArrayBarRenderer({ data }) {
  if (!data) return null;
  const {
    values = [], comparing = [], swapping = [], sorted = [],
    highlighted = [], labels = {}, auxiliary,
  } = data;

  const max = Math.max(...values, 1);
  const compSet = new Set(comparing);
  const swapSet = new Set(swapping);
  const sortSet = new Set(sorted);
  const hlSet = new Set(highlighted);

  const barColor = (i) => {
    if (swapSet.has(i)) return '#f472b6';
    if (compSet.has(i)) return '#fbbf24';
    if (hlSet.has(i)) return '#60a5fa';
    if (sortSet.has(i)) return '#6ee7b766';
    return '#6ee7b744';
  };

  const borderColor = (i) => {
    if (swapSet.has(i)) return '#f472b6';
    if (compSet.has(i)) return '#fbbf24';
    if (hlSet.has(i)) return '#60a5fa';
    if (sortSet.has(i)) return '#6ee7b744';
    return '#6ee7b733';
  };

  return (
    <div>
      {/* Bars */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 3,
        height: 140, padding: '0 4px',
      }}>
        {values.map((v, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end', height: '100%',
          }}>
            <span style={{
              fontFamily: 'monospace', fontSize: 10, color: barColor(i),
              marginBottom: 3, fontWeight: 600,
            }}>{v}</span>
            <div style={{
              width: '100%', borderRadius: '4px 4px 0 0',
              height: `${(v / max) * 100}%`, minHeight: 4,
              background: barColor(i), border: `1px solid ${borderColor(i)}`,
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
        ))}
      </div>
      {/* Index labels */}
      <div style={{ display: 'flex', gap: 3, padding: '0 4px', marginTop: 3 }}>
        {values.map((_, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: 8,
            color: labels[i] ? '#fbbf24' : '#334155',
          }}>{labels[i] || i}</div>
        ))}
      </div>
      {/* Auxiliary array (for merge sort subarrays etc) */}
      {auxiliary && (
        <div style={{
          display: 'flex', gap: 3, marginTop: 8, padding: '0 4px',
        }}>
          {auxiliary.map((v, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: 10,
              padding: '4px 2px', borderRadius: 4,
              background: v != null ? '#60a5fa0a' : 'transparent',
              border: `1px solid ${v != null ? '#60a5fa22' : 'transparent'}`,
              color: '#60a5fa',
            }}>{v ?? ''}</div>
          ))}
        </div>
      )}
    </div>
  );
}
