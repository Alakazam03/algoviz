import { buildSteps } from '../core/buildSteps';

export default {
  id: 'bfs-level-order',
  title: 'Level Order Traversal',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'BFS on a binary tree — visit nodes level by level using a queue.',
  mnemonic: {
    steps: ['Enqueue root', 'Process level size', 'Dequeue each node', 'Enqueue children'],
    detail: [
      'Start with the root in the queue.',
      'Record queue size = number of nodes at this level.',
      'Dequeue and process each node in the current level.',
      'Enqueue left and right children for the next level.',
    ],
  },
  pseudocode: [
    'queue = [root]',
    'while queue is not empty:',
    '  levelSize = queue.length',
    '  for i = 0 to levelSize-1:',
    '    node = queue.dequeue()',
    '    visit(node)',
    '    if node.left: queue.enqueue(left)',
    '    if node.right: queue.enqueue(right)',
  ],
  defaultInput: {
    nodes: [
      { id: 1, value: 1, left: 2, right: 3 },
      { id: 2, value: 2, left: 4, right: 5 },
      { id: 3, value: 3, left: 6, right: 7 },
      { id: 4, value: 4, left: null, right: null },
      { id: 5, value: 5, left: null, right: null },
      { id: 6, value: 6, left: null, right: null },
      { id: 7, value: 7, left: null, right: null },
    ],
    root: 1,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'Tree', area: 'main' },
      { renderer: 'queueStack', label: 'Queue', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodes, root } = input || this.defaultInput;
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    return buildSteps(({ snap, addLog }) => {
      const visited = [];
      const levels = [];
      const queue = [root];

      addLog('Start level order traversal');
      snap({
        tree: { nodes, root, highlighted: [root], visited: [], current: null },
        queueStack: { items: queue.map(q => q), type: 'queue' },
        codeLine: 0,
      });

      let levelNum = 0;
      while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        addLog(`Level ${levelNum}: ${levelSize} node(s)`, 'active');
        snap({
          tree: { nodes, root, highlighted: [...queue], visited: [...visited], current: null },
          queueStack: { items: [...queue], type: 'queue' },
          codeLine: [1, 2, 3],
        });

        for (let i = 0; i < levelSize; i++) {
          const id = queue.shift();
          const node = nodeMap[id];
          visited.push(id);
          currentLevel.push(node.value);

          addLog(`  Visit node ${node.value}`);
          snap({
            tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
            queueStack: { items: [...queue], type: 'queue' },
            codeLine: [4, 5],
          });

          if (node.left != null) {
            queue.push(node.left);
            addLog(`  Enqueue left child ${nodeMap[node.left].value}`);
          }
          if (node.right != null) {
            queue.push(node.right);
            addLog(`  Enqueue right child ${nodeMap[node.right].value}`);
          }

          if (node.left != null || node.right != null) {
            snap({
              tree: { nodes, root, highlighted: [node.left, node.right].filter(x => x != null), visited: [...visited], current: id },
              queueStack: { items: [...queue], type: 'queue' },
              codeLine: [6, 7],
            });
          }
        }

        levels.push(currentLevel);
        levelNum++;
      }

      addLog(`Done! Levels: [${levels.map(l => `[${l}]`).join(', ')}]`);
      snap({
        tree: { nodes, root, highlighted: [], visited, current: null },
        queueStack: { items: [], type: 'queue' },
        result: levels.map(l => `[${l}]`).join(', '),
      });
    });
  },
};
