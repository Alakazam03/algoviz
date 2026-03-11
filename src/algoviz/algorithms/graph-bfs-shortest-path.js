import { buildSteps } from '../core/buildSteps';

export default {
  id: 'bfs-shortest-path',
  title: 'Shortest Path (Unweighted)',
  category: 'Graph',
  difficulty: 'Easy',
  description: 'Find shortest path between two nodes in an unweighted graph using BFS.',
  mnemonic: {
    steps: ['BFS from source', 'Track parent pointers', 'Stop at target', 'Reconstruct path'],
    detail: [
      'BFS visits nodes in order of distance from source.',
      'Store which node discovered each neighbor.',
      'Once target is dequeued, we found shortest path.',
      'Backtrack parent pointers to build the path.',
    ],
  },
  pseudocode: [
    'queue = [source]',
    'visited[source] = true',
    'parent[source] = -1',
    'while queue is not empty:',
    '  node = queue.dequeue()',
    '  if node == target: break',
    '  for neighbor in adj[node]:',
    '    if not visited[neighbor]:',
    '      visited[neighbor] = true',
    '      parent[neighbor] = node',
    '      queue.enqueue(neighbor)',
    'reconstruct path from parent[]',
  ],
  defaultInput: {
    nodeCount: 7,
    edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[4,6],[5,6]],
    pos: [
      { x: 50, y: 100 }, { x: 130, y: 40 }, { x: 130, y: 160 },
      { x: 220, y: 20 }, { x: 220, y: 80 }, { x: 220, y: 160 },
      { x: 310, y: 110 },
    ],
    source: 0,
    target: 6,
  },
  layout: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'queueStack', label: 'Queue', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodeCount, edges, pos, source, target } = input || this.defaultInput;
    const adj = Array.from({ length: nodeCount }, () => []);
    edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u); });

    return buildSteps(({ snap, addLog }) => {
      const visited = new Array(nodeCount).fill(false);
      const parent = new Array(nodeCount).fill(-1);
      const queue = [source];
      visited[source] = true;
      const visitedList = [];
      const exploredEdges = {};

      addLog(`Find shortest path: ${source} → ${target}`);
      snap({
        graph: { nodes: pos, edges, highlighted: [source, target], visited: [], edgeClasses: {} },
        queueStack: { items: [source], type: 'queue' },
        codeLine: [0, 1, 2],
      });

      let found = false;
      while (queue.length > 0 && !found) {
        const node = queue.shift();
        visitedList.push(node);

        addLog(`Dequeue: ${node}`, 'active');
        snap({
          graph: { nodes: pos, edges, highlighted: [node], visited: [...visitedList], edgeClasses: { ...exploredEdges } },
          queueStack: { items: [...queue], type: 'queue' },
          codeLine: [3, 4],
        });

        if (node === target) {
          addLog(`Found target ${target}!`);
          found = true;
          break;
        }

        for (const nb of adj[node]) {
          const ei = edges.findIndex(([u, v]) => (u === node && v === nb) || (v === node && u === nb));
          if (!visited[nb]) {
            visited[nb] = true;
            parent[nb] = node;
            queue.push(nb);
            if (ei >= 0) exploredEdges[ei] = 'explored';
            addLog(`  Discover ${nb} (parent=${node})`);
            snap({
              graph: { nodes: pos, edges, highlighted: [node, nb], visited: [...visitedList], activeEdge: ei, edgeClasses: { ...exploredEdges } },
              queueStack: { items: [...queue], type: 'queue' },
              codeLine: [6, 7, 8, 9, 10],
            });
          }
        }
      }

      // Reconstruct path
      const path = [];
      let cur = target;
      while (cur !== -1) { path.unshift(cur); cur = parent[cur]; }

      // Mark path edges
      const pathEdges = { ...exploredEdges };
      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i], b = path[i + 1];
        const ei = edges.findIndex(([u, v]) => (u === a && v === b) || (v === a && u === b));
        if (ei >= 0) pathEdges[ei] = 'mst';
      }

      addLog(`Shortest path: [${path.join(' → ')}], distance = ${path.length - 1}`);
      snap({
        graph: { nodes: pos, edges, highlighted: path, visited: visitedList, edgeClasses: pathEdges },
        queueStack: { items: [], type: 'queue' },
        codeLine: 11,
        result: `Path: [${path.join(' → ')}], distance = ${path.length - 1}`,
      });
    });
  },
};
