import { buildSteps } from '../core/buildSteps';

export default {
  id: 'postorder',
  title: 'Postorder Traversal',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'Visit left subtree, right subtree, then node. Useful for deletion and expression evaluation.',
  mnemonic: {
    steps: ['Go left', 'Go right', 'Visit node'],
    detail: [
      'Recurse into left subtree first.',
      'Then recurse into right subtree.',
      'Process current node last (children before root).',
    ],
  },
  pseudocode: [
    'postorder(node):',
    '  if node is null: return',
    '  postorder(node.left)',
    '  postorder(node.right)',
    '  visit(node)',
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

      addLog('Start postorder traversal');
      snap({
        tree: { nodes, root, highlighted: [], visited: [], current: null },
        array: { values: [], comparing: [], swapping: [], sorted: [], highlighted: [] },
        codeLine: null,
      });

      function postorder(id) {
        if (id == null) return;
        const node = nodeMap[id];
        if (!node) return;

        addLog(`At node ${node.value}`, 'active');
        snap({
          tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
          array: { values: [...output], comparing: [], swapping: [], sorted: range(0, output.length - 1), highlighted: [] },
          codeLine: [0, 1],
        });

        // Go left
        postorder(node.left);

        // Go right
        postorder(node.right);

        // Visit
        visited.push(id);
        output.push(node.value);
        addLog(`Visit: ${node.value}`);
        snap({
          tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
          array: { values: [...output], comparing: [], swapping: [], sorted: [], highlighted: [output.length - 1] },
          codeLine: 4,
        });
      }

      postorder(root);

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
