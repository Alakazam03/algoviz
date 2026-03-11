// Mnemonics for algorithms that don't have interactive visualizations yet
export const STANDALONE_MNEMONICS = [
  {
    id: 'toposort', name: 'Topological Sort', cat: 'Graph', diff: 'Medium',
    steps: ['Count in-degrees', 'Enqueue 0-indegree nodes', 'Remove, add to order', 'Decrement neighbors, enqueue new 0s'],
    detail: [
      'For every edge u->v, indegree[v]++.',
      'No dependencies = ready.',
      'Dequeue = next in topological order.',
      'Removing frees neighbors. If any hit 0, enqueue.',
    ],
    code: `queue = [n for n if indeg[n]==0]\nwhile queue:\n  n = queue.poll()\n  order.add(n)\n  for nb: indeg[nb]--\n    if indeg[nb]==0: queue.add(nb)`,
  },
  {
    id: 'bellman', name: 'Bellman-Ford', cat: 'Graph', diff: 'Medium',
    steps: ['Init dist[src]=0, rest=INF', 'Repeat V-1 times', 'For each edge: relax', 'V-th pass: check negative cycle'],
    detail: [
      'Source = 0, all others = infinity.',
      'Longest shortest path has V-1 edges.',
      'If dist[u]+w < dist[v], update.',
      'If still relaxing, negative cycle exists.',
    ],
    code: `dist[src]=0\nfor 1..V-1:\n  for (u,v,w):\n    if dist[u]+w<dist[v]: dist[v]=dist[u]+w\nfor (u,v,w): if still relaxes -> NEG CYCLE`,
  },
  {
    id: 'dsu-find', name: 'DSU Find', cat: 'DSU', diff: 'Easy',
    steps: ['Check if self-parent', 'Yes -> return root', 'Recurse on parent', 'Compress: point to root'],
    detail: [
      'parent[i]==i means root.',
      'Base case - return.',
      'Follow parent upward.',
      'Set parent[i]=root. Future finds = O(1).',
    ],
    code: `find(i):\n  if p[i]==i: return i\n  p[i] = find(p[i])\n  return p[i]`,
  },
  {
    id: 'dsu-union', name: 'DSU Union', cat: 'DSU', diff: 'Easy',
    steps: ['Find root of A', 'Find root of B', 'Same root -> skip', 'Attach smaller rank under larger'],
    detail: [
      'find(a) -> representative.',
      'find(b) -> representative.',
      'Already same set.',
      'Union by rank keeps trees flat.',
    ],
    code: `union(a,b):\n  ra,rb = find(a),find(b)\n  if ra==rb: return\n  attach smaller rank under larger`,
  },
  {
    id: 'quick-sort', name: 'Quick Sort', cat: 'Sorting', diff: 'Medium',
    steps: ['Pick pivot', 'Partition around pivot', 'Recurse left', 'Recurse right'],
    detail: [
      'Choose last/random/median.',
      'Small left, large right.',
      'Sort left partition.',
      'Sort right partition.',
    ],
    code: `quickSort(lo,hi):\n  p = partition(lo,hi)\n  quickSort(lo,p-1)\n  quickSort(p+1,hi)`,
  },
  {
    id: 'sliding-window', name: 'Sliding Window', cat: 'Search', diff: 'Medium',
    steps: ['Expand right', 'Add to window', 'Shrink left while invalid', 'Update answer'],
    detail: [
      'Include new element.',
      'Update running state.',
      'Move left until constraint met.',
      'Record best from valid window.',
    ],
    code: `l=0\nfor r in 0..n-1:\n  add arr[r]\n  while invalid: remove arr[l]; l++\n  update answer`,
  },
  {
    id: 'dp-pattern', name: 'DP Pattern', cat: 'DP', diff: 'Medium',
    steps: ['Define state', 'Base case(s)', 'Write recurrence', 'Fill order', 'Extract answer'],
    detail: [
      'What does dp[i] mean?',
      'Trivial subproblems.',
      'dp[i] = f(dp[smaller]).',
      'Bottom-up or top-down+memo.',
      'Usually dp[n] or max/min of table.',
    ],
    code: `// 1. dp[i] = ...\n// 2. dp[0] = base\n// 3. dp[i] = f(dp[i-1],...)\n// 4. for i in 1..n\n// 5. return dp[n]`,
  },
  {
    id: 'heap-insert', name: 'Heap Insert', cat: 'Heap', diff: 'Easy',
    steps: ['Add to end', 'Compare with parent', 'Swap if violates', 'Bubble up'],
    detail: [
      'Maintain complete tree shape.',
      'Parent = (i-1)/2.',
      'Min-heap: child<parent -> swap.',
      'Repeat until fixed or root.',
    ],
    code: `insert(val):\n  arr.add(val); i=size-1\n  while i>0 and arr[i]<arr[parent]:\n    swap(i,parent); i=parent`,
  },
];
