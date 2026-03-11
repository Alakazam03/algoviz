import { buildSteps } from '../core/buildSteps';

export default {
  id: 'inorder',
  title: 'Inorder Traversal',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'Traverse left subtree, visit node, traverse right subtree. Produces sorted order for BST.',
  mnemonic: {
    steps: ['Go left', 'Visit node', 'Go right'],
    detail: [
      'Recurse into left subtree first.',
      'Process current node (BST = sorted order).',
      'Then recurse into right subtree.',
    ],
  },
  pseudocode: [
    'inorder(node):',
    '  if node is null: return',
    '  inorder(node.left)',
    '  visit(node)',
    '  inorder(node.right)',
  ],
  defaultInput: {
    // BST:       4
    //          /   \
    //         2     6
    //        / \   / \
    //       1   3 5   7
    nodes: [
      { id: 4, value: 4, left: 2, right: 6 },
      { id: 2, value: 2, left: 1, right: 3 },
      { id: 6, value: 6, left: 5, right: 7 },
      { id: 1, value: 1, left: null, right: null },
      { id: 3, value: 3, left: null, right: null },
      { id: 5, value: 5, left: null, right: null },
      { id: 7, value: 7, left: null, right: null },
    ],
    root: 4,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'BST', area: 'main' },
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

      addLog('Start inorder traversal');
      snap({
        tree: { nodes, root, highlighted: [], visited: [], current: null },
        array: { values: [], comparing: [], swapping: [], sorted: [], highlighted: [] },
        codeLine: null,
      });

      function inorder(id) {
        if (id == null) return;
        const node = nodeMap[id];
        if (!node) return;

        // Going left
        addLog(`At node ${node.value}: go left`, 'active');
        snap({
          tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
          array: { values: [...output], comparing: [], swapping: [], sorted: range(0, output.length - 1), highlighted: [] },
          codeLine: [0, 1, 2],
        });

        inorder(node.left);

        // Visit
        visited.push(id);
        output.push(node.value);
        addLog(`Visit: ${node.value}`, 'active');
        snap({
          tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
          array: { values: [...output], comparing: [], swapping: [], sorted: [], highlighted: [output.length - 1] },
          codeLine: 3,
        });

        // Going right
        addLog(`At node ${node.value}: go right`);
        snap({
          tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
          array: { values: [...output], comparing: [], swapping: [], sorted: range(0, output.length - 1), highlighted: [] },
          codeLine: 4,
        });

        inorder(node.right);
      }

      inorder(root);

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
