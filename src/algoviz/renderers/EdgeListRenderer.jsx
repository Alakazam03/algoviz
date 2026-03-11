export default function EdgeListRenderer({ data, algorithm }) {
  if (!data) return null;
  const { edges = [], activeIdx = -1, cycleIdx = -1, safeIndices = [] } = data;
  const isWeighted = algorithm?.defaultInput?.isWeighted;
  const safeSet = new Set(safeIndices);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 3,
      maxHeight: 170, overflowY: 'auto',
    }}>
      {edges.map((e, i) => {
        const isCyc = i === cycleIdx;
        const isAct = i === activeIdx;
        const isSafe = safeSet.has(i);

        let bg = '#080810', bc = '#1e293b', badge = null;
        if (isCyc) {
          bg = '#f472b60e'; bc = '#f472b6';
          badge = <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: '#f472b622', color: '#f472b6', marginLeft: 'auto' }}>CYCLE</span>;
        } else if (isAct) {
          bg = '#fbbf240e'; bc = '#fbbf24';
          badge = <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: '#fbbf2422', color: '#fbbf24', marginLeft: 'auto' }}>checking</span>;
        } else if (isSafe) {
          badge = <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: '#6ee7b711', color: '#6ee7b766', marginLeft: 'auto' }}>~</span>;
        }

        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 6,
            fontFamily: 'monospace', fontSize: 11, background: bg,
            border: `1px solid ${bc}`, transition: 'all 0.2s',
          }}>
            [{e[0]}, {e[1]}]{isWeighted && e[2] != null ? ` w=${e[2]}` : ''}{badge}
          </div>
        );
      })}
    </div>
  );
}
