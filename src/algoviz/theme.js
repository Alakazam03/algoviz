// Color palette
export const P = ['#6ee7b7','#f472b6','#60a5fa','#fbbf24','#a78bfa','#fb7185','#34d399','#e879f9','#38bdf8'];
export const pc = i => P[((i % P.length) + P.length) % P.length];

// Difficulty colors
export const DC = { Easy: '#6ee7b7', Medium: '#fbbf24', Hard: '#f472b6' };

// Category colors
export const CC = {
  Graph: '#60a5fa', DSU: '#6ee7b7', Sorting: '#f472b6',
  Tree: '#a78bfa', DP: '#fb923c', Search: '#fbbf24', Heap: '#e879f9',
  Recursion: '#34d399', 'Two Pointers': '#38bdf8', Stack: '#fb7185',
  'Linked List': '#e879f9', 'Sliding Window': '#a3e635',
};
