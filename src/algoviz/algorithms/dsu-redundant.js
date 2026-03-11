import { buildSteps } from '../core/buildSteps';
import { DSU } from '../core/dsu';

export default {
  id: 'redun',
  title: 'Redundant Connection',
  category: 'DSU',
  difficulty: 'Medium',
  description: 'Find the edge that creates a cycle in a tree+1-edge graph.',
  mnemonic: {
    steps: ['Process edges in order', 'Find roots of both nodes', 'Same root = redundant edge', 'Return that edge'],
    detail: [
      'A tree with n nodes has exactly n-1 edges. The extra one creates a cycle.',
      'Use DSU find for each endpoint.',
      'The first edge whose endpoints share a root is the culprit.',
      'That edge is the redundant connection.',
    ],
  },
  pseudocode: [
    'dsu = new DSU(n)',
    'for each edge (u, v):',
    '  rootU = find(u)',
    '  rootV = find(v)',
    '  if rootU == rootV:',
    '    return REDUNDANT (u, v)',
    '  union(u, v)',
  ],
  defaultInput: {
    edges: [[0, 1], [0, 2], [1, 2], [2, 3]],
    nodeCount: 4,
    pos: [{ x: 90, y: 50 }, { x: 210, y: 50 }, { x: 150, y: 140 }, { x: 270, y: 140 }],
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

      addLog('Find redundant edge');
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: {}, parent: [...d.p] },
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
          addLog(`REDUNDANT: [${u},${v}]`, 'active');
          snap({
            graph: { nodes: pos, edges, highlighted: [u, v], visited: [], activeEdge: i, edgeClasses: { [i]: 'cycle' }, parent: [...d.p] },
            edgeList: { edges, activeIdx: i, cycleIdx: i, safeIndices: [...safe] },
            dsu: { parent: [...d.p], rank: [...d.r], highlighted: [u, v] },
            codeLine: [4, 5],
            result: `Redundant: [${u},${v}]`,
          });
          return;
        }

        d.union(u, v);
        safe.push(i);
        addLog(`union(${u},${v})`);
        snap({
          graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: {}, parent: [...d.p] },
          edgeList: { edges, activeIdx: -1, cycleIdx: -1, safeIndices: [...safe] },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
          codeLine: 6,
        });
      }
    });
  },
};
