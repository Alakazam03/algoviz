import { buildSteps } from '../core/buildSteps';
import { DSU } from '../core/dsu';

export default {
  id: 'comps',
  title: 'Connected Components',
  category: 'DSU',
  difficulty: 'Easy',
  description: 'Count distinct sets. Each successful union reduces component count by 1.',
  mnemonic: {
    steps: ['Start with n components', 'For each edge: find roots', 'Different? Union, count--', 'Return final count'],
    detail: [
      'Every node starts as its own component.',
      'Find the representative of both endpoints.',
      'If they\'re in different sets, merging reduces total components.',
      'After all edges, remaining count = answer.',
    ],
  },
  pseudocode: [
    'comps = n',
    'dsu = new DSU(n)',
    'for each edge (u, v):',
    '  rootU = find(u)',
    '  rootV = find(v)',
    '  if rootU != rootV:',
    '    union(u, v)',
    '    comps--',
    'return comps',
  ],
  defaultInput: {
    edges: [[0, 1], [1, 2], [3, 4]],
    nodeCount: 5,
    pos: [{ x: 60, y: 90 }, { x: 160, y: 40 }, { x: 240, y: 90 }, { x: 160, y: 150 }, { x: 290, y: 150 }],
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
      let comps = nodeCount;

      addLog(`Init: ${comps} components`);
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: {}, parent: [...d.p] },
        edgeList: { edges, activeIdx: -1, cycleIdx: -1, safeIndices: [] },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: [0, 1],
        metrics: { Components: { value: comps, color: '#60a5fa' } },
      });

      for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        const ru = d.find(u), rv = d.find(v);
        addLog(`Edge [${u},${v}]: find(${u})=${ru}, find(${v})=${rv}`, 'active');
        snap({
          graph: { nodes: pos, edges, highlighted: [u, v], visited: [], activeEdge: i, edgeClasses: {}, parent: [...d.p] },
          edgeList: { edges, activeIdx: i, cycleIdx: -1, safeIndices: [...safe] },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [u, v] },
          codeLine: [2, 3, 4],
          metrics: { Components: { value: comps, color: '#60a5fa' } },
        });

        if (ru !== rv) {
          d.union(u, v);
          comps--;
          safe.push(i);
          addLog(`union -> comps=${comps}`);
        } else {
          safe.push(i);
          addLog('Already connected');
        }

        const ec = {};
        safe.forEach(si => { ec[si] = 'safe'; });
        snap({
          graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: ec, parent: [...d.p] },
          edgeList: { edges, activeIdx: -1, cycleIdx: -1, safeIndices: [...safe] },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
          codeLine: ru !== rv ? [5, 6, 7] : [5],
          metrics: { Components: { value: comps, color: '#60a5fa' } },
        });
      }

      addLog(`Done! ${comps} components`);
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: [], activeEdge: -1, edgeClasses: {}, parent: [...d.p] },
        edgeList: { edges, activeIdx: -1, cycleIdx: -1, safeIndices: [...safe] },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: 8,
        result: `${comps} component(s)`,
      });
    });
  },
};
