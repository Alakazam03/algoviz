import { buildSteps } from '../core/buildSteps';

export default {
  id: 'preorder',
  title: 'Preorder Traversal',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'Visit node first, then left subtree, then right subtree. Useful for copying/serializing trees.',
  mnemonic: {
    steps: ['Visit node', 'Go left', 'Go right'],
    detail: [
      'Process the current node first (root before children).',
      'Recurse into left subtree.',
      'Then recurse into right subtree.',
    ],
  },
  pseudocode: [
    'preorder(node):',
    '  if node is null: return',
    '  visit(node)',
    '  preorder(node.left)',
    '  preorder(node.right)',
  ],
  defaultInput: {
    nodes: [
      { id: 1, value: 1, left: 2, right: 3 },
      { id: 2, value: 2, left: 4, right: 5 },
      { id: 3, value: 3, left: null, right: 6 },
      { id: 4, value: 4, left: null, right: null },
      { id: 5, value: 5, left: null, right: null },
      { id: 6, value: 6, left: null, right: null },
    ],
    root: 1,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'Tree', area: 'main' },
      { renderer: 'array', label: 'Output', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodes, root } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const visited = [];
      const output = [];
      const nodeMap = {};
      nodes.forEach(n => { nodeMap[n.id] = n; });

      addLog('Start preorder traversal');
      snap({
        tree: { nodes, root, highlighted: [], visited: [], current: null },
        array: { values: [], comparing: [], swapping: [], sorted: [], highlighted: [] },
        codeLine: null,
      });

      function preorder(id) {
        if (id == null) return;
        const node = nodeMap[id];
        if (!node) return;

        // Visit
        visited.push(id);
        output.push(node.value);
        addLog(`Visit: ${node.value}`, 'active');
        snap({
          tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
          array: { values: [...output], comparing: [], swapping: [], sorted: [], highlighted: [output.length - 1] },
          codeLine: [0, 1, 2],
        });

        // Go left
        if (node.left != null) {
          addLog(`${node.value}: go left`);
          snap({
            tree: { nodes, root, highlighted: [node.left], visited: [...visited], current: id },
            array: { values: [...output], comparing: [], swapping: [], sorted: range(0, output.length - 1), highlighted: [] },
            codeLine: 3,
          });
        }
        preorder(node.left);

        // Go right
        if (node.right != null) {
          addLog(`${node.value}: go right`);
          snap({
            tree: { nodes, root, highlighted: [node.right], visited: [...visited], current: id },
            array: { values: [...output], comparing: [], swapping: [], sorted: range(0, output.length - 1), highlighted: [] },
            codeLine: 4,
          });
        }
        preorder(node.right);
      }

      preorder(root);

      addLog(`Done! Order: [${output.join(', ')}]`);
      snap({
        tree: { nodes, root, highlighted: [], visited, current: null },
        array: { values: output, comparing: [], swapping: [], sorted: range(0, output.length - 1), highlighted: [] },
        result: `[${output.join(', ')}]`,
      });
    });
  },
};

function range(lo, hi) {
  const r = [];
  for (let i = lo; i <= hi; i++) r.push(i);
  return r;
}
