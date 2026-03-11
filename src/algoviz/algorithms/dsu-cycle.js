import { buildSteps } from '../core/buildSteps';
import { DSU } from '../core/dsu';

export default {
  id: 'cycle',
  title: 'Find Cycle in Graph',
  category: 'DSU',
  difficulty: 'Easy',
  description: 'If two nodes of an edge already share a root, that edge creates a cycle.',
  mnemonic: {
    steps: ['For each edge', 'Find both roots', 'Same root? CYCLE', 'Else union them'],
    detail: [
      'Process edges one by one in order.',
      'Call find(u) and find(v) for the edge endpoints.',
      'If both nodes trace back to the same representative, they\'re already connected - adding this edge creates a loop.',
      'Different roots means different sets. Merge them safely and continue.',
    ],
  },
  pseudocode: [
    'dsu = new DSU(n)',
    'for each edge (u, v):',
    '  rootU = find(u)',
    '  rootV = find(v)',
    '  if rootU == rootV:',
    '    return CYCLE at (u, v)',
    '  else:',
    '    union(u, v)',
    'return NO CYCLE',
  ],
  defaultInput: {
    edges: [[0, 1], [1, 2], [2, 3], [3, 1]],
    nodeCount: 4,
    pos: [{ x: 80, y: 80 }, { x: 200, y: 40 }, { x: 280, y: 130 }, { x: 160, y: 160 }],
  },
  layout: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'edgeList', label: 'Edges', area: 'sidebar' },
      { renderer: 'dsu', label: 'Parent / Rank', area: 'bottom-left' },
    ],
  },
  build(input) {
    const { edges, nodeCount, pos } = input || this.defaultInput;
    return buildSteps(({ snap, addLog }) => {
      const d = new DSU(nodeCount);
      const safe = [];

      addLog('Init DSU: parent[i] = i');
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: {}, parent: d.p },
        edgeList: { edges, activeIdx: -1, cycleIdx: -1, safeIndices: [] },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: 0,
      });

      for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        const ru = d.find(u), rv = d.find(v);
        addLog(`Edge [${u},${v}]: find(${u})=${ru}, find(${v})=${rv}`, 'active');
        snap({
          graph: { nodes: pos, edges, highlighted: [u, v], visited: [], activeEdge: i, edgeClasses: {}, parent: [...d.p] },
          edgeList: { edges, activeIdx: i, cycleIdx: -1, safeIndices: [...safe] },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [u, v] },
          codeLine: [1, 2, 3],
        });

        if (ru === rv) {
          addLog(`Same root -> CYCLE!`, 'active');
          snap({
            graph: { nodes: pos, edges, highlighted: [u, v], visited: [], activeEdge: i, edgeClasses: { [i]: 'cycle' }, parent: [...d.p] },
            edgeList: { edges, activeIdx: i, cycleIdx: i, safeIndices: [...safe] },
            dsu: { parent: [...d.p], rank: [...d.r], highlighted: [u, v] },
            codeLine: [4, 5],
            result: `Cycle at [${u},${v}]`,
          });
          return;
        }

        d.union(u, v);
        safe.push(i);
        addLog(`union(${u},${v})`);
        const ec = {};
        safe.forEach(si => { ec[si] = 'safe'; });
        snap({
          graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: ec, parent: [...d.p] },
          edgeList: { edges, activeIdx: -1, cycleIdx: -1, safeIndices: [...safe] },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
          codeLine: [6, 7],
        });
      }

      addLog('No cycle found');
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: {}, parent: [...d.p] },
        edgeList: { edges, activeIdx: -1, cycleIdx: -1, safeIndices: [...safe] },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: 8,
        result: 'No cycle',
      });
    });
  },
};
