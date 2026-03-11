export const LAYOUTS = {
  graphWithSidebar: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'edgeList', label: 'Edges', area: 'sidebar' },
      { renderer: 'dsu', label: 'Parent / Rank', area: 'bottom-left' },
    ],
  },
  graphWithQueue: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'queueStack', label: 'Queue', area: 'sidebar' },
    ],
  },
  graphWithStack: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'queueStack', label: 'Stack', area: 'sidebar' },
    ],
  },
  graphWithDistances: {
    panels: [
      { renderer: 'graph', label: 'Graph', area: 'main' },
      { renderer: 'dpTable', label: 'Distances', area: 'sidebar' },
    ],
  },
  gridOnly: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'dsu', label: 'Parent / Rank', area: 'bottom-left' },
    ],
  },
  accountsOnly: {
    panels: [
      { renderer: 'accounts', label: 'Accounts', area: 'main' },
      { renderer: 'dsu', label: 'Parent / Rank', area: 'bottom-left' },
    ],
  },
  arrayOnly: {
    panels: [
      { renderer: 'array', label: 'Array', area: 'main' },
    ],
  },
  treeWithOutput: {
    panels: [
      { renderer: 'tree', label: 'Tree', area: 'main' },
      { renderer: 'array', label: 'Output', area: 'sidebar' },
    ],
  },
  dpTableOnly: {
    panels: [
      { renderer: 'dpTable', label: 'DP Table', area: 'main' },
    ],
  },
  searchArray: {
    panels: [
      { renderer: 'searchArray', label: 'Array', area: 'main' },
    ],
  },
  linkedListOnly: {
    panels: [
      { renderer: 'linkedList', label: 'Linked List', area: 'main' },
    ],
  },
  gridWithQueue: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'queueStack', label: 'Queue', area: 'sidebar' },
    ],
  },
  gridWithStack: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'queueStack', label: 'DFS Stack', area: 'sidebar' },
    ],
  },
};
