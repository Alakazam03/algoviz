import { buildSteps } from '../core/buildSteps';

export default {
  id: 'validate-bst',
  title: 'Validate BST',
  category: 'Tree',
  difficulty: 'Medium',
  description: 'Check if a binary tree is a valid Binary Search Tree. Each node must be within a valid range (min, max).',
  mnemonic: {
    steps: ['Pass valid range (min, max)', 'Check node.val in range', 'Recurse left with max=node.val', 'Recurse right with min=node.val'],
    detail: [
      'Every node has a valid range it must fall within.',
      'If the current value violates the range, it is NOT a valid BST.',
      'Left child must be less than current — update max bound.',
      'Right child must be greater than current — update min bound.',
    ],
  },
  pseudocode: [
    'isValidBST(node, min, max):',
    '  if node is null: return true',
    '  if node.val <= min or node.val >= max:',
    '    return false',
    '  left = isValidBST(node.left, min, node.val)',
    '  right = isValidBST(node.right, node.val, max)',
    '  return left and right',
  ],
  defaultInput: {
    nodes: [
      { id: 5, value: 5, left: 3, right: 8 },
      { id: 3, value: 3, left: 1, right: 4 },
      { id: 8, value: 8, left: 6, right: 10 },
      { id: 1, value: 1, left: null, right: null },
      { id: 4, value: 4, left: null, right: null },
      { id: 6, value: 6, left: null, right: null },
      { id: 10, value: 10, left: null, right: null },
    ],
    root: 5,
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

      addLog('Validate if tree is a BST');
      snap({
        tree: { nodes, root, highlighted: [], visited: [], current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function validate(id, min, max) {
        if (id == null) return true;
        const node = nodeMap[id];
        if (!node) return true;

        const minStr = min === -Infinity ? '-∞' : min;
        const maxStr = max === Infinity ? '∞' : max;

        stack.push(`valid(${node.value}, ${minStr}, ${maxStr})`);
        addLog(`Node ${node.value}: range (${minStr}, ${maxStr})`, 'active');
        snap({
          tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 1],
        });

        if (node.value <= min || node.value >= max) {
          addLog(`INVALID: ${node.value} not in (${minStr}, ${maxStr})`);
          snap({
            tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [2, 3],
          });
          stack.pop();
          return false;
        }

        visited.push(id);
        addLog(`Node ${node.value} is valid ✓`);
        snap({
          tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [4, 5],
        });

        const leftOk = validate(node.left, min, node.value);
        const rightOk = validate(node.right, node.value, max);

        stack.pop();
        return leftOk && rightOk;
      }

      const result = validate(root, -Infinity, Infinity);

      addLog(result ? 'Valid BST!' : 'NOT a valid BST');
      snap({
        tree: { nodes, root, highlighted: [], visited, current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: result ? 'Valid BST ✓' : 'Invalid BST ✗',
      });
    });
  },
};
