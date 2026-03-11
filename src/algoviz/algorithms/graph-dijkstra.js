import { buildSteps } from '../core/buildSteps';

export default {
  id: 'dijkstra',
  title: "Dijkstra's Shortest Path",
  category: 'Graph',
  difficulty: 'Medium',
  description: 'Find shortest paths from source using a priority queue. Greedily relaxes edges.',
  mnemonic: {
    steps: ['Extract min-dist from PQ', 'Skip if finalized', 'Relax each neighbor edge', 'Update PQ if shorter path'],
    detail: [
      'Pull node with smallest tentative distance.',
      'Already processed? Skip.',
      'Check if dist[curr]+weight < dist[neighbor].',
      'If shorter, update and push to PQ.',
    ],
  },
  pseudocode: [
    'dist = [INF, ...]; dist[src] = 0',
    'pq = [(0, src)]',
    'while pq is not empty:',
    '  (d, u) = pq.extractMin()',
    '  if finalized[u]: continue',
    '  finalize u',
    '  for (v, w) in adj[u]:',
    '    if d + w < dist[v]:',
    '      dist[v] = d + w',
    '      pq.add((dist[v], v))',
  ],
  defaultInput: {
    nodeCount: 5,
    edges: [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5], [3, 4, 3]],
    isWeighted: true,
    pos: [
      { x: 40, y: 100 }, { x: 150, y: 30 }, { x: 150, y: 170 },
      { x: 260, y: 100 }, { x: 340, y: 100 },
    ],
    source: 0,
  },
  layout: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'dpTable', label: 'Distances', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodeCount, edges, pos, source } = input || this.defaultInput;
    const adj = Array.from({ length: nodeCount }, () => []);
    edges.forEach(([u, v, w]) => { adj[u].push([v, w]); adj[v].push([u, w]); });

    return buildSteps(({ snap, addLog }) => {
      const dist = new Array(nodeCount).fill(Infinity);
      const finalized = new Array(nodeCount).fill(false);
      dist[source] = 0;

      // Simple PQ as array (adequate for small demo graphs)
      let pq = [[0, source]];
      const finalizedList = [];

      addLog(`Init: dist[${source}] = 0, rest = INF`);
      snap({
        graph: { nodes: pos, edges, highlighted: [source], visited: [], activeEdge: -1, edgeClasses: {}, nodeLabels: dist.reduce((a, d, i) => { a[i] = d === Infinity ? 'INF' : d; return a; }, {}) },
        dpTable: { values: dist.map(d => d === Infinity ? 'INF' : d), highlighted: [source], computed: [], title: 'dist[]' },
        codeLine: [0, 1],
      });

      while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, u] = pq.shift();

        if (finalized[u]) {
          addLog(`Skip node ${u} (finalized)`);
          snap({
            graph: { nodes: pos, edges, highlighted: [u], visited: [...finalizedList], activeEdge: -1, edgeClasses: {}, nodeLabels: dist.reduce((a, d, i) => { a[i] = d === Infinity ? 'INF' : d; return a; }, {}) },
            dpTable: { values: dist.map(d => d === Infinity ? 'INF' : d), highlighted: [], computed: [...finalizedList], title: 'dist[]' },
            codeLine: [2, 3, 4],
          });
          continue;
        }

        finalized[u] = true;
        finalizedList.push(u);
        addLog(`Finalize node ${u}, dist=${d}`, 'active');
        snap({
          graph: { nodes: pos, edges, highlighted: [u], visited: [...finalizedList], activeEdge: -1, edgeClasses: {}, nodeLabels: dist.reduce((a, d, i) => { a[i] = d === Infinity ? 'INF' : d; return a; }, {}) },
          dpTable: { values: dist.map(d => d === Infinity ? 'INF' : d), highlighted: [u], computed: [...finalizedList], title: 'dist[]' },
          codeLine: [2, 3, 5],
        });

        for (const [v, w] of adj[u]) {
          if (finalized[v]) continue;
          const ei = edges.findIndex(e => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u));
          const newDist = d + w;

          if (newDist < dist[v]) {
            dist[v] = newDist;
            pq.push([newDist, v]);
            addLog(`  Relax ${u}->${v}: ${newDist} < ${dist[v] === newDist ? 'INF' : dist[v]}`);
            snap({
              graph: {
                nodes: pos, edges, highlighted: [u, v], visited: [...finalizedList],
                activeEdge: ei, edgeClasses: { ...(ei >= 0 ? { [ei]: 'relaxed' } : {}) },
                nodeLabels: dist.reduce((a, d, i) => { a[i] = d === Infinity ? 'INF' : d; return a; }, {}),
              },
              dpTable: { values: dist.map(d => d === Infinity ? 'INF' : d), highlighted: [v], computed: [...finalizedList], title: 'dist[]' },
              codeLine: [6, 7, 8, 9],
            });
          }
        }
      }

      addLog('Dijkstra complete!');
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: finalizedList, activeEdge: -1, edgeClasses: {}, nodeLabels: dist.reduce((a, d, i) => { a[i] = d; return a; }, {}) },
        dpTable: { values: [...dist], highlighted: [], computed: finalizedList, title: 'dist[]' },
        result: `Shortest: [${dist.join(', ')}]`,
      });
    });
  },
};
