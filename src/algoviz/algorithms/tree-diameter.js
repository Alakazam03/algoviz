import { buildSteps } from '../core/buildSteps';

export default {
  id: 'tree-diameter',
  title: 'Diameter of Binary Tree',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'Find the diameter (longest path between any two nodes) in a binary tree. The path may or may not pass through the root.',
  mnemonic: {
    steps: ['At each node, compute left height', 'Compute right height', 'Update diameter = max(diameter, L+R)', 'Return 1 + max(L, R) as height'],
    detail: [
      'DFS to find the height of each node\'s left subtree.',
      'Also find the height of the right subtree.',
      'The diameter through this node is leftHeight + rightHeight. Track the global max.',
      'Return the height of this node (1 + deeper subtree) to the parent.',
    ],
  },
  pseudocode: [
    'diameter = 0',
    'height(node):',
    '  if node is null: return 0',
    '  L = height(node.left)',
    '  R = height(node.right)',
    '  diameter = max(diameter, L + R)',
    '  return 1 + max(L, R)',
  ],
  defaultInput: {
    nodes: [
      { id: 1, value: 1, left: 2, right: 3 },
      { id: 2, value: 2, left: 4, right: 5 },
      { id: 3, value: 3, left: null, right: null },
      { id: 4, value: 4, left: null, right: null },
      { id: 5, value: 5, left: 6, right: null },
      { id: 6, value: 6, left: null, right: null },
    ],
    root: 1,
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
      const nodeMap = {};
      nodes.forEach(n => { nodeMap[n.id] = n; });
      const visited = [];
      const stack = [];
      let diameter = 0;

      addLog('Find diameter of binary tree');
      snap({
        tree: { nodes, root, highlighted: [], visited: [], current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: 0,
      });

      function height(id) {
        if (id == null || !nodeMap[id]) return 0;
        const node = nodeMap[id];

        stack.push(`h(${node.value})`);
        addLog(`At node ${node.value}`, 'active');
        snap({
          tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [1, 2],
        });

        const L = height(node.left);
        const R = height(node.right);
        const pathThrough = L + R;

        if (pathThrough > diameter) diameter = pathThrough;

        visited.push(id);
        const h = 1 + Math.max(L, R);
        addLog(`Node ${node.value}: L=${L}, R=${R}, path=${pathThrough}, dia=${diameter}, h=${h}`);
        snap({
          tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [3, 4, 5, 6],
        });

        stack.pop();
        return h;
      }

      height(root);

      addLog(`Diameter = ${diameter}`);
      snap({
        tree: { nodes, root, highlighted: [], visited, current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `Diameter = ${diameter} edges`,
      });
    });
  },
};
