import { buildSteps } from '../core/buildSteps';

export default {
  id: 'max-depth',
  title: 'Max Depth of Binary Tree',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'Find the maximum depth (height) of a binary tree using DFS recursion.',
  mnemonic: {
    steps: ['Base: null → 0', 'Recurse left', 'Recurse right', 'Return 1 + max(left, right)'],
    detail: [
      'An empty tree has depth 0.',
      'Find the depth of the left subtree.',
      'Find the depth of the right subtree.',
      'Current node adds 1 level to the deeper subtree.',
    ],
  },
  pseudocode: [
    'maxDepth(node):',
    '  if node is null: return 0',
    '  leftDepth = maxDepth(node.left)',
    '  rightDepth = maxDepth(node.right)',
    '  return 1 + max(leftDepth, rightDepth)',
  ],
  defaultInput: {
    nodes: [
      { id: 3, value: 3, left: 9, right: 20 },
      { id: 9, value: 9, left: null, right: null },
      { id: 20, value: 20, left: 15, right: 7 },
      { id: 15, value: 15, left: 11, right: null },
      { id: 7, value: 7, left: null, right: null },
      { id: 11, value: 11, left: null, right: null },
    ],
    root: 3,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'Tree', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodes, root } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const visited = [];
      const nodeMap = {};
      nodes.forEach(n => { nodeMap[n.id] = n; });
      const stack = [];

      addLog('Find max depth of binary tree');
      snap({
        tree: { nodes, root, highlighted: [], visited: [], current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function maxDepth(id) {
        if (id == null) return 0;
        const node = nodeMap[id];
        if (!node) return 0;

        stack.push(`depth(${node.value})`);
        addLog(`At node ${node.value}`, 'active');
        snap({
          tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 1],
        });

        const leftD = maxDepth(node.left);
        const rightD = maxDepth(node.right);
        const depth = 1 + Math.max(leftD, rightD);

        visited.push(id);
        addLog(`Node ${node.value}: left=${leftD}, right=${rightD}, depth=${depth}`);
        snap({
          tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [2, 3, 4],
        });

        stack.pop();
        return depth;
      }

      const result = maxDepth(root);

      addLog(`Max depth = ${result}`);
      snap({
        tree: { nodes, root, highlighted: [], visited, current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `Max depth = ${result}`,
      });
    });
  },
};
