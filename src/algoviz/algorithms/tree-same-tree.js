import { buildSteps } from '../core/buildSteps';

export default {
  id: 'same-tree',
  title: 'Same Tree',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'Determine if two binary trees are structurally identical with the same node values.',
  mnemonic: {
    steps: ['Both null → true', 'One null → false', 'Compare values', 'Recurse left & right'],
    detail: [
      'If both nodes are null, the subtrees match.',
      'If only one is null, the structure differs — not the same tree.',
      'If both exist but values differ, not the same tree.',
      'Recursively check that left subtrees match AND right subtrees match.',
    ],
  },
  pseudocode: [
    'isSame(p, q):',
    '  if p is null and q is null: return true',
    '  if p is null or q is null: return false',
    '  if p.val != q.val: return false',
    '  return isSame(p.left, q.left)',
    '    and isSame(p.right, q.right)',
  ],
  defaultInput: {
    tree1: [
      { id: 1, value: 1, left: 2, right: 3 },
      { id: 2, value: 2, left: null, right: null },
      { id: 3, value: 3, left: null, right: null },
    ],
    tree2: [
      { id: 11, value: 1, left: 12, right: 13 },
      { id: 12, value: 2, left: null, right: null },
      { id: 13, value: 3, left: null, right: null },
    ],
    root1: 1,
    root2: 11,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'Tree (comparing)', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { tree1, tree2, root1, root2 } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      // Merge both trees side by side for display by offsetting tree2 ids
      const nodeMap1 = {};
      tree1.forEach(n => { nodeMap1[n.id] = n; });
      const nodeMap2 = {};
      tree2.forEach(n => { nodeMap2[n.id] = n; });

      // We'll display only tree1 and show comparison in logs
      const visited = [];
      const stack = [];

      addLog('Compare two trees for equality');
      snap({
        tree: { nodes: tree1, root: root1, highlighted: [], visited: [], current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function isSame(id1, id2) {
        const n1 = id1 != null ? nodeMap1[id1] : null;
        const n2 = id2 != null ? nodeMap2[id2] : null;

        if (!n1 && !n2) {
          addLog('Both null → match');
          snap({
            tree: { nodes: tree1, root: root1, highlighted: [], visited: [...visited], current: null },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 1,
          });
          return true;
        }

        if (!n1 || !n2) {
          addLog(`Mismatch: one is null (${n1 ? n1.value : 'null'} vs ${n2 ? n2.value : 'null'})`);
          snap({
            tree: { nodes: tree1, root: root1, highlighted: id1 != null ? [id1] : [], visited: [...visited], current: null },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 2,
          });
          return false;
        }

        stack.push(`same(${n1.value}, ${n2.value})`);
        addLog(`Compare: Tree1=${n1.value}, Tree2=${n2.value}`, 'active');
        snap({
          tree: { nodes: tree1, root: root1, highlighted: [id1], visited: [...visited], current: id1 },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 3],
        });

        if (n1.value !== n2.value) {
          addLog(`Values differ: ${n1.value} ≠ ${n2.value}`);
          snap({
            tree: { nodes: tree1, root: root1, highlighted: [id1], visited: [...visited], current: id1 },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 3,
          });
          stack.pop();
          return false;
        }

        visited.push(id1);
        addLog(`${n1.value} == ${n2.value} ✓`);
        snap({
          tree: { nodes: tree1, root: root1, highlighted: [], visited: [...visited], current: id1 },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [4, 5],
        });

        const leftOk = isSame(n1.left, n2.left);
        const rightOk = leftOk ? isSame(n1.right, n2.right) : false;

        stack.pop();
        return leftOk && rightOk;
      }

      const result = isSame(root1, root2);

      addLog(result ? 'Trees are identical!' : 'Trees are NOT the same');
      snap({
        tree: { nodes: tree1, root: root1, highlighted: [], visited, current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: result ? 'Same Tree ✓' : 'Different Trees ✗',
      });
    });
  },
};
