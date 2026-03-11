import { pc } from '../theme';

export default function LinkedListRenderer({ data }) {
  if (!data) return null;
  const {
    nodes = [],       // [{ value, id }]
    pointers = {},    // { 'current': nodeIndex, 'prev': nodeIndex }
    highlighted = [], // indices
    reversed = [],    // indices that have been reversed
    cycleAt = -1,     // index where cycle points back to
  } = data;

  if (nodes.length === 0) {
    return (
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#334155', padding: 8 }}>
        empty list
      </div>
    );
  }

  const hasCycle = cycleAt >= 0;
  const nodeW = 44;
  const gap = 24;
  const startX = 20;
  const nodeY = 36;                           // vertical centre of nodes
  const W = Math.min(nodes.length * (nodeW + gap) + 40, 560);
  const H = hasCycle ? 110 : 76;              // taller when cycle arc present

  const hlSet = new Set(highlighted);
  const revSet = new Set(reversed);

  // Pointer name to color
  const ptrColors = {
    current: '#fbbf24', curr: '#fbbf24', prev: '#f472b6',
    slow: '#6ee7b7', fast: '#60a5fa', head: '#a78bfa',
    tail: '#fb923c', next: '#38bdf8',
  };

  // Build pointer labels per node index
  const ptrLabels = {};
  Object.entries(pointers).forEach(([name, idx]) => {
    if (idx == null || idx < 0) return;
    if (!ptrLabels[idx]) ptrLabels[idx] = [];
    ptrLabels[idx].push(name);
  });

  // X helpers
  const nodeLeft  = i => startX + i * (nodeW + gap);
  const nodeRight = i => nodeLeft(i) + nodeW;
  const nodeMid   = i => nodeLeft(i) + nodeW / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: hasCycle ? 130 : 90 }}>
      <defs>
        {/* Forward arrow ‣  (orient follows line direction) */}
        <marker id="arrowFwd" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="none" stroke="#334155" strokeWidth="1.2" />
        </marker>
        {/* Reversed arrow ◂  (fixed orient — always points left) */}
        <marker id="arrowRev" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="0">
          <path d="M8,0 L0,4 L8,8" fill="none" stroke="#6ee7b7" strokeWidth="1.2" />
        </marker>
        {/* Cycle arrow (orient follows curve) */}
        <marker id="arrowCycle" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="none" stroke="#f472b6" strokeWidth="1.2" />
        </marker>
      </defs>

      {/* ── Arrows between adjacent nodes ── */}
      {nodes.map((_, i) => {
        if (i >= nodes.length - 1 && !hasCycle) return null;

        // Cycle arrow — dramatic arc below nodes
        if (i === nodes.length - 1 && hasCycle) {
          const sx  = nodeRight(i);           // start: right edge of last node
          const ex  = nodeMid(cycleAt);       // end: centre of cycle-target node
          const arcY = nodeY + 40;            // how far below nodes the arc dips
          // Use a cubic bezier for a smooth, wide arc
          const c1x = sx + 20;
          const c1y = arcY + 12;
          const c2x = ex - 20;
          const c2y = arcY + 12;
          return (
            <g key={`a${i}`}>
              {/* Glow */}
              <path
                d={`M ${sx} ${nodeY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${nodeY + 16}`}
                fill="none" stroke="#f472b655" strokeWidth={4}
              />
              {/* Main arc */}
              <path
                d={`M ${sx} ${nodeY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${nodeY + 16}`}
                fill="none" stroke="#f472b6" strokeWidth={1.8}
                strokeDasharray="6,3"
                markerEnd="url(#arrowCycle)"
              />
              {/* "cycle" label */}
              <text
                x={(sx + ex) / 2} y={arcY + 8}
                textAnchor="middle" fill="#f472b6" fontSize="8"
                fontFamily="monospace" fontWeight="600"
              >cycle</text>
            </g>
          );
        }

        // Normal / reversed arrow between node i and node i+1
        const isRev = revSet.has(i);
        const gapStart = nodeRight(i);        // right edge of node i
        const gapEnd   = nodeLeft(i + 1);     // left edge of node i+1
        const arrowPad = 4;

        if (isRev) {
          // Reversed: arrow goes RIGHT → LEFT  (from near node i+1 to near node i)
          return (
            <line key={`a${i}`}
              x1={gapEnd - arrowPad} y1={nodeY}
              x2={gapStart + arrowPad} y2={nodeY}
              stroke="#6ee7b7" strokeWidth={1.8}
              markerEnd="url(#arrowRev)"
            />
          );
        }

        // Forward: arrow goes LEFT → RIGHT
        return (
          <line key={`a${i}`}
            x1={gapStart + arrowPad} y1={nodeY}
            x2={gapEnd - arrowPad} y2={nodeY}
            stroke="#334155" strokeWidth={1.5}
            markerEnd="url(#arrowFwd)"
          />
        );
      })}

      {/* NULL at end */}
      {!hasCycle && (
        <text
          x={nodeRight(nodes.length - 1) + gap / 2 + 4}
          y={nodeY + 4}
          fill="#334155" fontSize="9" fontFamily="monospace"
        >null</text>
      )}

      {/* ── Nodes ── */}
      {nodes.map((node, i) => {
        const x = nodeLeft(i);
        const isHL = hlSet.has(i);
        const isRev = revSet.has(i);
        const c = isHL ? '#fbbf24' : isRev ? '#6ee7b7' : pc(i);

        return (
          <g key={`n${i}`}>
            {/* Glow for highlighted */}
            {isHL && (
              <rect
                x={x - 3} y={nodeY - 17} width={nodeW + 6} height={34} rx={9}
                fill={c + '10'} stroke="none"
              />
            )}
            <rect
              x={x} y={nodeY - 14} width={nodeW} height={28} rx={6}
              fill={isHL ? c + '22' : isRev ? '#0d1a14' : '#0a0a14'}
              stroke={c}
              strokeWidth={isHL ? 2.2 : isRev ? 1.8 : 1.2}
              style={{ transition: 'all 0.3s' }}
            />
            <text
              x={x + nodeW / 2} y={nodeY + 4}
              textAnchor="middle" fill={c}
              fontSize="12" fontWeight="700" fontFamily="'Courier New', monospace"
            >{node.value}</text>

            {/* Pointer labels above node */}
            {ptrLabels[i] && ptrLabels[i].map((name, j) => (
              <text key={`p${j}`}
                x={x + nodeW / 2} y={nodeY - 20 - j * 11}
                textAnchor="middle"
                fill={ptrColors[name] || '#94a3b8'}
                fontSize="8" fontWeight="600" fontFamily="monospace"
              >{name}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
