import { buildSteps } from '../core/buildSteps';

export default {
  id: 'bfs',
  title: 'Breadth-First Search',
  category: 'Graph',
  difficulty: 'Easy',
  description: 'Explore a graph level by level using a queue. Visits all nodes reachable from the source.',
  mnemonic: {
    steps: ['Enqueue source', 'Dequeue front node', 'Mark visited', 'Enqueue unvisited neighbors'],
    detail: [
      'Start by adding source to the queue.',
      'Remove the front element (FIFO order).',
      'Mark it visited so we never revisit.',
      'Add all unvisited neighbors to the back of the queue.',
    ],
  },
  pseudocode: [
    'queue = [source]',
    'visited[source] = true',
    'while queue is not empty:',
    '  node = queue.dequeue()',
    '  process node',
    '  for neighbor in adj[node]:',
    '    if not visited[neighbor]:',
    '      visited[neighbor] = true',
    '      queue.enqueue(neighbor)',
  ],
  defaultInput: {
    nodeCount: 6,
    edges: [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5]],
    pos: [
      { x: 50, y: 100 }, { x: 150, y: 40 }, { x: 150, y: 160 },
      { x: 250, y: 80 }, { x: 250, y: 180 }, { x: 330, y: 100 },
    ],
    source: 0,
  },
  layout: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'queueStack', label: 'Queue', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodeCount, edges, pos, source } = input || this.defaultInput;
    const adj = Array.from({ length: nodeCount }, () => []);
    edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u); });

    return buildSteps(({ snap, addLog }) => {
      const visited = new Array(nodeCount).fill(false);
      const queue = [source];
      visited[source] = true;
      const visitedList = [];
      const exploredEdges = {};

      addLog(`Start BFS from node ${source}`);
      snap({
        graph: { nodes: pos, edges, highlighted: [source], visited: [], activeEdge: -1, edgeClasses: {} },
        queueStack: { items: [...queue], type: 'queue' },
        codeLine: [0, 1],
      });

      while (queue.length > 0) {
        const node = queue.shift();
        visitedList.push(node);
        addLog(`Dequeue: ${node}`, 'active');
        snap({
          graph: { nodes: pos, edges, highlighted: [node], visited: [...visitedList], activeEdge: -1, edgeClasses: { ...exploredEdges } },
          queueStack: { items: [...queue], type: 'queue' },
          codeLine: [2, 3, 4],
        });

        for (const nb of adj[node]) {
          const ei = edges.findIndex(([u, v]) => (u === node && v === nb) || (v === node && u === nb));
          if (!visited[nb]) {
            visited[nb] = true;
            queue.push(nb);
            if (ei >= 0) exploredEdges[ei] = 'explored';
            addLog(`  Visit neighbor ${nb}, enqueue`);
            snap({
              graph: { nodes: pos, edges, highlighted: [node, nb], visited: [...visitedList], activeEdge: ei, edgeClasses: { ...exploredEdges } },
              queueStack: { items: [...queue], type: 'queue', highlighted: queue.length - 1 },
              codeLine: [5, 6, 7, 8],
            });
          } else {
            if (ei >= 0 && !exploredEdges[ei]) exploredEdges[ei] = 'explored';
          }
        }
      }

      addLog(`BFS complete! Order: [${visitedList.join(', ')}]`);
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: visitedList, activeEdge: -1, edgeClasses: exploredEdges },
        queueStack: { items: [], type: 'queue' },
        result: `Order: [${visitedList.join(', ')}]`,
      });
    });
  },
};
