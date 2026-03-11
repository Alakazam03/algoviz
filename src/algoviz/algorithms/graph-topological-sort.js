import { buildSteps } from '../core/buildSteps';

export default {
  id: 'topo-sort',
  title: 'Topological Sort (Kahn\'s)',
  category: 'Graph',
  difficulty: 'Medium',
  description: 'Order directed graph nodes so every edge (u,v) has u before v. Uses BFS with in-degree tracking.',
  mnemonic: {
    steps: ['Compute in-degrees', 'Enqueue 0 in-degree nodes', 'Process: add to order', 'Decrement neighbor in-degrees'],
    detail: [
      'Count incoming edges for each node.',
      'Nodes with 0 in-degree have no dependencies — start with them.',
      'Dequeue and add to topological order.',
      'For each neighbor, decrement in-degree. If 0, enqueue.',
    ],
  },
  pseudocode: [
    'compute in-degree for all nodes',
    'queue = nodes with in-degree 0',
    'while queue is not empty:',
    '  node = queue.dequeue()',
    '  order.append(node)',
    '  for neighbor in adj[node]:',
    '    in-degree[neighbor]--',
    '    if in-degree[neighbor] == 0:',
    '      queue.enqueue(neighbor)',
    'return order (if |order|==n)',
  ],
  defaultInput: {
    nodeCount: 6,
    edges: [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]],
    pos: [
      { x: 220, y: 160 }, { x: 300, y: 100 }, { x: 140, y: 100 },
      { x: 220, y: 60 }, { x: 80, y: 160 }, { x: 50, y: 60 },
    ],
    directed: true,
  },
  layout: {
    panels: [
      { renderer: 'graph', label: 'DAG', area: 'main' },
      { renderer: 'queueStack', label: 'Queue', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodeCount, edges, pos } = input || this.defaultInput;
    const adj = Array.from({ length: nodeCount }, () => []);
    const inDeg = new Array(nodeCount).fill(0);
    edges.forEach(([u, v]) => { adj[u].push(v); inDeg[v]++; });

    return buildSteps(({ snap, addLog }) => {
      const queue = [];
      const order = [];
      const exploredEdges = {};
      const visitedList = [];

      addLog('Compute in-degrees');
      for (let i = 0; i < nodeCount; i++) addLog(`  node ${i}: in-degree = ${inDeg[i]}`);
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: [], edgeClasses: {}, nodeLabels: Object.fromEntries(Array.from({ length: nodeCount }, (_, i) => [i, `${i}(${inDeg[i]})`])) },
        queueStack: { items: [], type: 'queue' },
        codeLine: 0,
      });

      // Enqueue in-degree 0
      for (let i = 0; i < nodeCount; i++) {
        if (inDeg[i] === 0) queue.push(i);
      }

      addLog(`In-degree 0 nodes: [${queue.join(', ')}]`);
      snap({
        graph: { nodes: pos, edges, highlighted: [...queue], visited: [], edgeClasses: {}, nodeLabels: {} },
        queueStack: { items: [...queue], type: 'queue' },
        codeLine: 1,
      });

      const indeg = [...inDeg];

      while (queue.length > 0) {
        const node = queue.shift();
        order.push(node);
        visitedList.push(node);

        addLog(`Dequeue ${node} → order: [${order.join(', ')}]`, 'active');
        snap({
          graph: { nodes: pos, edges, highlighted: [node], visited: [...visitedList], edgeClasses: { ...exploredEdges } },
          queueStack: { items: [...queue], type: 'queue' },
          codeLine: [2, 3, 4],
        });

        for (const nb of adj[node]) {
          indeg[nb]--;
          const ei = edges.findIndex(([u, v]) => u === node && v === nb);
          if (ei >= 0) exploredEdges[ei] = 'explored';

          addLog(`  ${node}→${nb}: in-degree[${nb}] = ${indeg[nb]}`);

          if (indeg[nb] === 0) {
            queue.push(nb);
            addLog(`  ${nb} now has in-degree 0 → enqueue`);
          }

          snap({
            graph: { nodes: pos, edges, highlighted: [node, nb], visited: [...visitedList], activeEdge: ei, edgeClasses: { ...exploredEdges } },
            queueStack: { items: [...queue], type: 'queue' },
            codeLine: [5, 6, 7, 8],
          });
        }
      }

      const valid = order.length === nodeCount;
      addLog(valid ? `Topological order: [${order.join(', ')}]` : 'Cycle detected! No valid ordering.');
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: visitedList, edgeClasses: exploredEdges },
        queueStack: { items: [], type: 'queue' },
        codeLine: 9,
        result: valid ? `[${order.join(', ')}]` : 'Has cycle!',
      });
    });
  },
};
