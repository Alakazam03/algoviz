import { buildSteps } from '../core/buildSteps';

export default {
  id: 'dfs',
  title: 'Depth-First Search',
  category: 'Graph',
  difficulty: 'Easy',
  description: 'Explore as deep as possible before backtracking, using a stack.',
  mnemonic: {
    steps: ['Push source to stack', 'Pop top node', 'Skip if visited', 'Push unvisited neighbors'],
    detail: [
      'Start by pushing source.',
      'Pop top - this is current.',
      'If already visited, skip.',
      'Push unvisited neighbors (LIFO -> depth-first).',
    ],
  },
  pseudocode: [
    'stack = [source]',
    'while stack is not empty:',
    '  node = stack.pop()',
    '  if visited[node]: continue',
    '  mark visited[node]',
    '  process node',
    '  for neighbor in adj[node]:',
    '    if not visited[neighbor]:',
    '      stack.push(neighbor)',
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
      { renderer: 'queueStack', label: 'Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodeCount, edges, pos, source } = input || this.defaultInput;
    const adj = Array.from({ length: nodeCount }, () => []);
    edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u); });

    return buildSteps(({ snap, addLog }) => {
      const visited = new Array(nodeCount).fill(false);
      const stack = [source];
      const visitedList = [];
      const exploredEdges = {};

      addLog(`Start DFS from node ${source}`);
      snap({
        graph: { nodes: pos, edges, highlighted: [source], visited: [], activeEdge: -1, edgeClasses: {} },
        queueStack: { items: [...stack], type: 'stack' },
        codeLine: 0,
      });

      while (stack.length > 0) {
        const node = stack.pop();

        if (visited[node]) {
          addLog(`Skip ${node} (already visited)`);
          snap({
            graph: { nodes: pos, edges, highlighted: [node], visited: [...visitedList], activeEdge: -1, edgeClasses: { ...exploredEdges } },
            queueStack: { items: [...stack], type: 'stack' },
            codeLine: [1, 2, 3],
          });
          continue;
        }

        visited[node] = true;
        visitedList.push(node);
        addLog(`Pop & visit: ${node}`, 'active');
        snap({
          graph: { nodes: pos, edges, highlighted: [node], visited: [...visitedList], activeEdge: -1, edgeClasses: { ...exploredEdges } },
          queueStack: { items: [...stack], type: 'stack' },
          codeLine: [1, 2, 4, 5],
        });

        for (const nb of adj[node]) {
          const ei = edges.findIndex(([u, v]) => (u === node && v === nb) || (v === node && u === nb));
          if (!visited[nb]) {
            stack.push(nb);
            if (ei >= 0) exploredEdges[ei] = 'explored';
            addLog(`  Push neighbor ${nb}`);
            snap({
              graph: { nodes: pos, edges, highlighted: [node, nb], visited: [...visitedList], activeEdge: ei, edgeClasses: { ...exploredEdges } },
              queueStack: { items: [...stack], type: 'stack', highlighted: stack.length - 1 },
              codeLine: [6, 7, 8],
            });
          }
        }
      }

      addLog(`DFS complete! Order: [${visitedList.join(', ')}]`);
      snap({
        graph: { nodes: pos, edges, highlighted: [], visited: visitedList, activeEdge: -1, edgeClasses: exploredEdges },
        queueStack: { items: [], type: 'stack' },
        result: `Order: [${visitedList.join(', ')}]`,
      });
    });
  },
};
