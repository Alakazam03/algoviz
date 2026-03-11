import { pc } from '../theme';

// Simple level-based binary tree layout
function layoutTree(nodes, root) {
  if (!nodes || !nodes.length) return { positioned: [], edges: [] };
  const map = {};
  nodes.forEach(n => { map[n.id] = n; });

  const positioned = [];
  const edges = [];
  const W = 320, H = 180;

  // BFS to assign positions
  const queue = [{ id: root, level: 0, pos: 0.5 }];
  while (queue.length > 0) {
    const { id, level, pos } = queue.shift();
    const node = map[id];
    if (!node) continue;

    const x = pos * W;
    const y = 30 + level * 50;
    positioned.push({ ...node, x, y });

    const spread = 0.25 / (level + 1);
    if (node.left != null) {
      edges.push({ from: id, to: node.left, fromX: x, fromY: y, toX: (pos - spread) * W, toY: y + 50 });
      queue.push({ id: node.left, level: level + 1, pos: pos - spread });
    }
    if (node.right != null) {
      edges.push({ from: id, to: node.right, fromX: x, fromY: y, toX: (pos + spread) * W, toY: y + 50 });
      queue.push({ id: node.right, level: level + 1, pos: pos + spread });
    }
  }

  return { positioned, edges };
}

export default function TreeRenderer({ data }) {
  if (!data) return null;
  const {
    nodes = [], root = 0, highlighted = [], visited = [], current = null,
  } = data;

  const { positioned, edges } = layoutTree(nodes, root);
  const hlSet = new Set(highlighted);
  const visitedSet = new Set(visited);
  const W = 320, H = 180;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 180 }}>
      {/* Edges */}
      {edges.map((e, i) => (
        <line key={i}
          x1={e.fromX} y1={e.fromY + 14} x2={e.toX} y2={e.toY - 14}
          stroke={visitedSet.has(e.to) ? '#6ee7b755' : '#1e293b'}
          strokeWidth={1.5}
        />
      ))}
      {/* Nodes */}
      {positioned.map((n) => {
        const isCur = n.id === current;
        const isHL = hlSet.has(n.id);
        const isVis = visitedSet.has(n.id);
        const c = isCur ? '#fbbf24' : isHL ? '#f472b6' : isVis ? '#6ee7b7' : '#60a5fa';

        return (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            <circle r={14} fill={isCur || isHL ? c + '33' : isVis ? c + '22' : '#12121f'}
              stroke={c} strokeWidth={isCur ? 2.5 : 1.5}
              style={{ transition: 'all 0.3s' }}
            />
            <text textAnchor="middle" dominantBaseline="central"
              fill={c} fontSize="11" fontWeight="700" fontFamily="'Courier New',monospace">
              {n.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
