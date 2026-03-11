import { buildSteps } from '../core/buildSteps';

export default {
  id: 'dfs-path-sum',
  title: 'Path Sum in Binary Tree',
  category: 'Tree',
  difficulty: 'Easy',
  description: 'DFS to check if any root-to-leaf path sums to a target value.',
  mnemonic: {
    steps: ['Start at root with target', 'Subtract node value', 'Reach leaf?', 'Check remaining == 0'],
    detail: [
      'Begin DFS from root with the full target sum.',
      'At each node, subtract the node value from remaining.',
      'A leaf is a node with no children.',
      'If remaining is 0 at a leaf, path found!',
    ],
  },
  pseudocode: [
    'pathSum(node, remaining):',
    '  if node is null: return false',
    '  remaining -= node.val',
    '  if leaf and remaining == 0:',
    '    return true',
    '  return pathSum(left, remaining)',
    '    || pathSum(right, remaining)',
  ],
  defaultInput: {
    nodes: [
      { id: 5, value: 5, left: 4, right: 8 },
      { id: 4, value: 4, left: 11, right: null },
      { id: 8, value: 8, left: 13, right: 4 },
      { id: 11, value: 11, left: 7, right: 2 },
      { id: 13, value: 13, left: null, right: null },
      { id: 4.1, value: 1, left: null, right: null },
      { id: 7, value: 7, left: null, right: null },
      { id: 2, value: 2, left: null, right: null },
    ],
    root: 5,
    target: 22,
  },
  layout: {
    panels: [
      { renderer: 'tree', label: 'Tree', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const inp = input || this.defaultInput;
    // Fix node IDs to be integers for tree renderer
    const nodes = [
      { id: 5, value: 5, left: 4, right: 8 },
      { id: 4, value: 4, left: 11, right: null },
      { id: 8, value: 8, left: 13, right: 41 },
      { id: 11, value: 11, left: 7, right: 2 },
      { id: 13, value: 13, left: null, right: null },
      { id: 41, value: 1, left: null, right: null },
      { id: 7, value: 7, left: null, right: null },
      { id: 2, value: 2, left: null, right: null },
    ];
    const root = 5;
    const target = inp.target || 22;

    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    return buildSteps(({ snap, addLog }) => {
      const visited = [];
      const stack = [];
      let found = false;
      let foundPath = [];

      addLog(`Find path sum = ${target}`);
      snap({
        tree: { nodes, root, highlighted: [], visited: [], current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function dfs(id, remaining, path) {
        if (id == null || found) return false;
        const node = nodeMap[id];
        if (!node) return false;

        remaining -= node.value;
        const curPath = [...path, node.value];
        stack.push(`${node.value} (rem=${remaining})`);

        addLog(`Visit ${node.value}, remaining = ${remaining}`, 'active');
        snap({
          tree: { nodes, root, highlighted: [id], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 1, 2],
        });

        const isLeaf = node.left == null && node.right == null;
        if (isLeaf && remaining === 0) {
          found = true;
          foundPath = curPath;
          visited.push(id);
          addLog(`Leaf! Path [${curPath.join(' → ')}] = ${target} ✓`);
          snap({
            tree: { nodes, root, highlighted: curPath.map((_, i) => path.length > i ? nodes.find(n => n.value === curPath[i])?.id : id).filter(Boolean), visited: [...visited], current: id },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [3, 4],
          });
          stack.pop();
          return true;
        }

        if (isLeaf) {
          addLog(`Leaf ${node.value}, remaining=${remaining} ≠ 0`);
          visited.push(id);
          snap({
            tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [3],
          });
          stack.pop();
          return false;
        }

        visited.push(id);

        if (dfs(node.left, remaining, curPath)) { stack.pop(); return true; }
        if (dfs(node.right, remaining, curPath)) { stack.pop(); return true; }

        addLog(`Backtrack from ${node.value}`);
        stack.pop();
        snap({
          tree: { nodes, root, highlighted: [], visited: [...visited], current: id },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [5, 6],
        });
        return false;
      }

      dfs(root, target, []);

      addLog(found ? `Found! Path: [${foundPath.join(' → ')}]` : 'No path found');
      snap({
        tree: { nodes, root, highlighted: [], visited, current: null },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: found ? `Path: [${foundPath.join(' → ')}] = ${target}` : 'No path found',
      });
    });
  },
};
