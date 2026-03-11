export default function QueueStackRenderer({ data }) {
  if (!data) return null;
  const { items = [], type = 'queue', highlighted = null, label } = data;

  const isQueue = type === 'queue';
  const typeLabel = label || (isQueue ? 'Queue (FIFO)' : 'Stack (LIFO)');

  return (
    <div>
      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#475569',
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6,
      }}>{typeLabel}</div>

      {items.length === 0 ? (
        <div style={{
          fontFamily: 'monospace', fontSize: 11, color: '#334155',
          padding: '8px 12px', textAlign: 'center',
        }}>empty</div>
      ) : (
        <div style={{
          display: 'flex', flexDirection: isQueue ? 'row' : 'column-reverse',
          gap: 4, flexWrap: 'wrap',
        }}>
          {items.map((item, i) => {
            const isHL = i === highlighted || (Array.isArray(highlighted) && highlighted.includes(i));
            const isHead = isQueue ? i === 0 : i === items.length - 1;
            const c = isHL ? '#fbbf24' : isHead ? '#6ee7b7' : '#60a5fa';

            return (
              <div key={i} style={{
                padding: '6px 12px', borderRadius: 6, fontFamily: 'monospace', fontSize: 12,
                background: isHL ? c + '15' : '#080810',
                border: `1px solid ${isHL ? c : isHead ? c + '44' : '#1e293b'}`,
                color: c, fontWeight: isHead ? 700 : 400,
                transition: 'all 0.2s', textAlign: 'center', minWidth: 32,
              }}>
                {item}
                {isHead && (
                  <div style={{
                    fontSize: 7, color: c + '88', marginTop: 2,
                  }}>{isQueue ? 'front' : 'top'}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#334155', marginTop: 6,
      }}>size: {items.length}</div>
    </div>
  );
}
