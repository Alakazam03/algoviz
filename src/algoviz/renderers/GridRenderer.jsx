import { pc } from '../theme';

export default function GridRenderer({ data }) {
  if (!data) return null;

  // Generic mode: custom cells with content and colors
  if (data.cells) {
    const { cells, rows, cols, highlighted = [], cellColors = [] } = data;
    const hlSet = new Set(highlighted);

    return (
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 5, maxWidth: Math.max(cols * 56, 220),
      }}>
        {cells.map((cell, idx) => {
          const isHL = hlSet.has(idx);
          const customColor = cellColors[idx];
          const isEmpty = cell === 0 || cell === '' || cell === null;
          const isQueen = cell === 'Q';
          const c = isHL ? '#fbbf24'
            : customColor || (isQueen ? '#6ee7b7' : isEmpty ? null : '#60a5fa');

          return (
            <div key={idx} style={{
              height: 48, borderRadius: 8,
              background: isQueen ? '#6ee7b722'
                : isHL ? '#fbbf2422'
                : customColor ? customColor.replace(/[^#0-9a-fA-F]/g, '') + '15'
                : '#0c0c18',
              border: `1.5px solid ${c || '#1e293b'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: isQueen ? 18 : 12,
              fontWeight: isQueen || isHL ? 700 : 400,
              color: c || '#334155',
              boxShadow: isHL ? `0 0 12px ${c}55` : isQueen ? '0 0 8px #6ee7b744' : 'none',
              transition: 'all 0.3s',
            }}>
              {isQueen ? '♛' : isEmpty ? '·' : cell}
            </div>
          );
        })}
      </div>
    );
  }

  // Legacy DSU mode
  const { land = new Set(), parent = [], R = 3, C = 3, hlCell } = data;

  const fr = (i) => {
    let x = i;
    while (parent[x] !== x && parent[x] !== undefined) x = parent[x];
    return x;
  };

  const cells = [];
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const idx = r * C + c;
      const isL = land instanceof Set ? land.has(idx) : !!land[idx];
      const root = isL ? fr(idx) : idx;
      const col = isL ? pc(root) : null;
      cells.push(
        <div key={idx} style={{
          height: 48, borderRadius: 8,
          background: isL ? col + '2a' : '#0c0c18',
          border: `1.5px solid ${isL ? col : '#1e293b'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace', fontSize: 11, fontWeight: isL ? 700 : 400,
          color: isL ? col : '#334155',
          boxShadow: idx === hlCell ? `0 0 12px ${col}55` : 'none',
          transition: 'all 0.3s',
        }}>{idx}</div>
      );
    }
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${C}, 1fr)`,
      gap: 5, maxWidth: 220,
    }}>{cells}</div>
  );
}
