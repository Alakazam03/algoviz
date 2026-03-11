import { buildSteps } from '../core/buildSteps';
import { DSU } from '../core/dsu';

export default {
  id: 'kruskal',
  title: "Kruskal's MST",
  category: 'DSU',
  difficulty: 'Medium',
  description: "Sort edges by weight. Greedily add edges that don't create a cycle.",
  mnemonic: {
    steps: ['Sort all edges by weight', 'Pick smallest unused edge', 'Same component? Skip (cycle)', 'Different? Add to MST, union'],
    detail: [
      'Greedy: cheapest edges considered first.',
      'Process from lightest to heaviest.',
      'Use DSU find - if both nodes share a root, adding this edge would create a loop.',
      'Safe edge: add to MST and merge the two components.',
    ],
  },
  pseudocode: [
    'sort edges by weight',
    'dsu = new DSU(n)',
    'mst = [], totalWeight = 0',
    'for each edge (u, v, w) in sorted:',
    '  rootU = find(u)',
    '  rootV = find(v)',
    '  if rootU == rootV: skip',
    '  mst.add(edge)',
    '  totalWeight += w',
    '  union(u, v)',
    'return mst',
  ],
  defaultInput: {
    edges: [[0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], [1, 4, 5], [2, 4, 7], [3, 4, 9]],
    nodeCount: 5,
    isWeighted: true,
    pos: [{ x: 60, y: 60 }, { x: 180, y: 30 }, { x: 280, y: 80 }, { x: 80, y: 170 }, { x: 240, y: 170 }],
  },
  layout: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'edgeList', label: 'Edges (sorted)', area: 'sidebar' },
      { renderer: 'dsu', label: 'Parent / Rank', area: 'bottom-left' },
    ],
  },
  build(input) {
    const { edges, nodeCount, pos } = input || this.defaultInput;
    const sorted = [...edges].sort((a, b) => a[2] - b[2]);

    return buildSteps(({ snap, addLog }) => {
      const d = new DSU(nodeCount);
      const mst = [];
      let w = 0;

      addLog(`Sort ${sorted.length} edges`);
      snap({
        graph: { nodes: pos, edges: sorted, highlighted: [], visited: [], activeEdge: -1, edgeClasses: {}, parent: [...d.p] },
        edgeList: { edges: sorted, activeIdx: -1, cycleIdx: -1, safeIndices: [] },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: [0, 1, 2],
        metrics: { 'MST Weight': { value: 0, color: '#fbbf24' } },
      });

      for (let i = 0; i < sorted.length; i++) {
        const [u, v, wt] = sorted[i];
        const ru = d.find(u), rv = d.find(v);
        addLog(`[${u}-${v}] w=${wt}: find(${u})=${ru}, find(${v})=${rv}`, 'active');
        snap({
          graph: { nodes: pos, edges: sorted, highlighted: [u, v], visited: [], activeEdge: i, edgeClasses: buildMSTClasses(sorted, mst), parent: [...d.p] },
          edgeList: { edges: sorted, activeIdx: i, cycleIdx: -1, safeIndices: mst.map((_, mi) => sorted.indexOf(mst[mi])).filter(x => x >= 0) },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [u, v] },
          codeLine: [3, 4, 5],
          metrics: { 'MST Weight': { value: w, color: '#fbbf24' } },
        });

        if (ru !== rv) {
          d.union(u, v);
          mst.push(sorted[i]);
          w += wt;
          addLog(`Added! Total=${w}`);
        } else {
          addLog('Skip (cycle)');
        }

        snap({
          graph: { nodes: pos, edges: sorted, highlighted: [], visited: [], activeEdge: -1, edgeClasses: buildMSTClasses(sorted, mst), parent: [...d.p] },
          edgeList: { edges: sorted, activeIdx: -1, cycleIdx: -1, safeIndices: [] },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
          codeLine: ru !== rv ? [7, 8, 9] : [6],
          metrics: { 'MST Weight': { value: w, color: '#fbbf24' } },
        });
      }

      addLog(`MST complete! Weight=${w}`);
      snap({
        graph: { nodes: pos, edges: sorted, highlighted: [], visited: [], activeEdge: -1, edgeClasses: buildMSTClasses(sorted, mst), parent: [...d.p] },
        edgeList: { edges: sorted, activeIdx: -1, cycleIdx: -1, safeIndices: [] },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: 10,
        result: `MST weight: ${w}`,
      });
    });
  },
};

function buildMSTClasses(sorted, mst) {
  const ec = {};
  const mstSet = new Set(mst.map(e => `${e[0]}-${e[1]}`));
  sorted.forEach((e, i) => {
    if (mstSet.has(`${e[0]}-${e[1]}`)) ec[i] = 'mst';
  });
  return ec;
}
