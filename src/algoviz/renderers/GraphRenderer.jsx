import { pc } from '../theme';

export default function GraphRenderer({ data, algorithm }) {
  if (!data) return null;

  const {
    nodes = [], edges = [], highlighted = [], visited = [],
    activeEdge = -1, edgeClasses = {}, nodeLabels = {},
  } = data;
  const pos = nodes.length ? nodes : algorithm.defaultInput?.pos || [];
  const edgeList = edges.length ? edges : algorithm.defaultInput?.edges || [];
  const nodeCount = algorithm.defaultInput?.nodeCount || pos.length;
  const isWeighted = algorithm.defaultInput?.isWeighted;

  const W = 340, H = 200;
  const sx = W / 360;

  const hlSet = new Set(highlighted);
  const visitedSet = new Set(visited);

  const edgeColor = (i) => {
    const cls = edgeClasses[i];
    if (cls === 'cycle') return '#f472b6';
    if (cls === 'mst' || cls === 'safe') return '#6ee7b7';
    if (cls === 'active' || i === activeEdge) return '#fbbf24';
    if (cls === 'explored') return '#60a5fa55';
    if (cls === 'relaxed') return '#6ee7b7';
    return '#1e293b';
  };

  const edgeWidth = (i) => {
    const cls = edgeClasses[i];
    if (cls === 'cycle' || cls === 'mst' || cls === 'active' || i === activeEdge) return 2.5;
    return 1.5;
  };

  const edgeDash = (i) => {
    return edgeClasses[i] === 'cycle' ? '6,3' : 'none';
  };

  // Determine node root for coloring (if DSU parent data available)
  const fr = (idx) => {
    if (!data.parent) return idx;
    let x = idx;
    while (data.parent[x] !== x && data.parent[x] !== undefined) x = data.parent[x];
    return x;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 180 }}>
      {/* Edges */}
      {edgeList.map((e, i) => {
        const a = pos[e[0]], b = pos[e[1]];
        if (!a || !b) return null;
        return (
          <g key={`e${i}`}>
            <line
              x1={a.x * sx + 20} y1={a.y} x2={b.x * sx + 20} y2={b.y}
              stroke={edgeColor(i)} strokeWidth={edgeWidth(i)}
              strokeDasharray={edgeDash(i)}
            />
            {isWeighted && e[2] != null && (
              <text
                x={(a.x + b.x) * sx / 2 + 20} y={(a.y + b.y) / 2 - 6}
                fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace"
              >{e[2]}</text>
            )}
          </g>
        );
      })}
      {/* Nodes */}
      {pos.map((p, i) => {
        if (i >= nodeCount) return null;
        const root = fr(i);
        const c = pc(root);
        const isHL = hlSet.has(i);
        const isVisited = visitedSet.has(i);
        const isRoot = data.parent ? data.parent[i] === i : true;

        let fill = c + '22';
        let stroke = c;
        if (isHL) { fill = '#fbbf24' + '44'; stroke = '#fbbf24'; }
        else if (isVisited) { fill = c + '44'; stroke = c; }

        return (
          <g key={`n${i}`} transform={`translate(${p.x * sx + 20},${p.y})`}>
            <circle r={18} fill={fill} stroke={stroke}
              strokeWidth={isRoot ? 2.5 : 1.5}
              style={{ transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
            <text textAnchor="middle" dominantBaseline="central"
              fill={isHL ? '#fbbf24' : isRoot ? c : '#e2e8f0'}
              fontSize="12" fontWeight="700" fontFamily="'Courier New',monospace">
              {nodeLabels[i] != null ? nodeLabels[i] : i}
            </text>
            {isRoot && !isHL && (
              <text x="11" y="-13" fontSize="8" fill={c} fontFamily="monospace">*</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
