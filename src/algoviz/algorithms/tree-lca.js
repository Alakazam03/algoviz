import { buildSteps } from '../core/buildSteps';

export default {
  id: 'lca',
  title: 'Lowest Common Ancestor',
  category: 'Tree',
  difficulty: 'Medium',
  description: 'Find the lowest common ancestor (LCA) of two nodes in a binary tree. If a node is an ancestor of both, and no deeper node is, that\'s the LCA.',
  mnemonic: {
    steps: ['Base: null or target → return node', 'Search left subtree', 'Search right subtree', 'Both non-null → current is LCA'],
    detail: [
      'If current node is null or equals p or q, return it immediately.',
      'Recursively search the left subtree for p or q.',
      'Recursively search the right subtree for p or q.',
      'If both left and right return non-null, current node is the LCA. Otherwise return whichever is non-null.',
    ],
  },
  pseudocode: [
    'LCA(node, p, q):',
    '  if node is null: return null',
    '  if node == p or node == q: return node',
    '  left = LCA(node.left, p, q)',
    '  right = LCA(node.right, p, q)',
    '  if left and right: return node  // LCA!',
    '  return left or right',
  ],
  defaultInput: {
    nodes: [
      { id: 3, value: 3, left: 5, right: 1 },
      { id: 5, value: 5, left: 6, right: 2 },
      { id: 1, value: 1, left: 0, right: 8 },
      { id: 6, value: 6, left: null, right: null },
      { id: 2, value: 2, left: 7, right: 4 },
      { id: 0, value: 0, left: null, right: null },
      { id: 8, value: 8, left: null, right: null },
      { id: 7, value: 7, left: null, right: null },
      { id: 4, value: 4, left: null, right: null },
    ],
    root: 3,
    p: 5,
    q: 4,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'Tree', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nodes, root, p, q } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const nodeMap = {};
      nodes.forEach(n => { nodeMap[n.id] = n; });
      const visited = [];
      const stack = [];

      addLog(`Find LCA of nodes ${p} and ${q}`);
      snap({
        tree: { nodes, root, highlighted: [p, q], visited: [], current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function lca(id) {
        if (id == null || !nodeMap[id]) return null;
        const node = nodeMap[id];

        stack.push(`LCA(${node.value})`);
        addLog(`Visit node ${node.value}`, 'active');
        snap({
          tree: { nodes, root, highlighted: [id, p, q], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 1],
        });

        if (id === p || id === q) {
          addLog(`Found target: ${node.value}`);
          visited.push(id);
          snap({
            tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 2,
          });
          stack.pop();
          return id;
        }

        const left = lca(node.left);
        const right = lca(node.right);

        visited.push(id);

        if (left != null && right != null) {
          addLog(`Node ${node.value} is LCA! (found in both subtrees)`);
          snap({
            tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 5,
          });
          stack.pop();
          return id;
        }

        const result = left != null ? left : right;
        addLog(`Node ${node.value}: left=${left != null ? nodeMap[left]?.value : 'null'}, right=${right != null ? nodeMap[right]?.value : 'null'} → ${result != null ? nodeMap[result]?.value : 'null'}`);
        snap({
          tree: { nodes, root, highlighted: result != null ? [result] : [], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: 6,
        });

        stack.pop();
        return result;
      }

      const result = lca(root);

      addLog(`LCA of ${p} and ${q} = ${result != null ? nodeMap[result]?.value : 'null'}`);
      snap({
        tree: { nodes, root, highlighted: result != null ? [result] : [], visited, current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `LCA(${p}, ${q}) = ${result != null ? nodeMap[result]?.value : 'null'}`,
      });
    });
  },
};
