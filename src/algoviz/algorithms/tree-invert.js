import { buildSteps } from '../core/buildSteps';

export default {
  id: 'invert-tree',
  title: 'Invert Binary Tree',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'Mirror a binary tree by swapping every node\'s left and right children. The famous Homebrew interview question.',
  mnemonic: {
    steps: ['Base: null → return', 'Swap left and right children', 'Recurse on left subtree', 'Recurse on right subtree'],
    detail: [
      'If the node is null, nothing to invert.',
      'Swap the left and right child pointers of the current node.',
      'Recursively invert the (new) left subtree.',
      'Recursively invert the (new) right subtree.',
    ],
  },
  pseudocode: [
    'invert(node):',
    '  if node is null: return null',
    '  swap(node.left, node.right)',
    '  invert(node.left)',
    '  invert(node.right)',
    '  return node',
  ],
  defaultInput: {
    nodes: [
      { id: 4, value: 4, left: 2, right: 7 },
      { id: 2, value: 2, left: 1, right: 3 },
      { id: 7, value: 7, left: 6, right: 9 },
      { id: 1, value: 1, left: null, right: null },
      { id: 3, value: 3, left: null, right: null },
      { id: 6, value: 6, left: null, right: null },
      { id: 9, value: 9, left: null, right: null },
    ],
    root: 4,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'Tree', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodes: origNodes, root } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      // Deep copy so we can mutate
      const nodeMap = {};
      origNodes.forEach(n => { nodeMap[n.id] = { ...n }; });
      const getNodes = () => Object.values(nodeMap);
      const visited = [];
      const stack = [];

      addLog('Invert binary tree');
      snap({
        tree: { nodes: getNodes(), root, highlighted: [], visited: [], current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function invert(id) {
        if (id == null || !nodeMap[id]) return;
        const node = nodeMap[id];

        stack.push(`invert(${node.value})`);
        addLog(`At node ${node.value}`, 'active');
        snap({
          tree: { nodes: getNodes(), root, highlighted: [id], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 1],
        });

        // Swap children
        const tmp = node.left;
        node.left = node.right;
        node.right = tmp;

        addLog(`Swap children of ${node.value}: L↔R`);
        snap({
          tree: { nodes: getNodes(), root, highlighted: [node.left, node.right].filter(Boolean), visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: 2,
        });

        invert(node.left);
        invert(node.right);

        visited.push(id);
        addLog(`Node ${node.value} inverted`);
        snap({
          tree: { nodes: getNodes(), root, highlighted: [], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [3, 4, 5],
        });

        stack.pop();
      }

      invert(root);

      addLog('Tree fully inverted!');
      snap({
        tree: { nodes: getNodes(), root, highlighted: [], visited, current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: 'Binary tree inverted',
      });
    });
  },
};
