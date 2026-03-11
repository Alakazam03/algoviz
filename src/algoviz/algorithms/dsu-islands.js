import { buildSteps } from '../core/buildSteps';
import { DSU } from '../core/dsu';

export default {
  id: 'islands',
  title: 'Number of Islands II',
  category: 'DSU',
  difficulty: 'Medium',
  description: 'Add land cells one at a time. Union with adjacent land. Track island count.',
  mnemonic: {
    steps: ['Add cell -> islands++', 'Check 4 neighbors', 'Neighbor is land + different set?', 'Union them -> islands--'],
    detail: [
      'Each new land cell starts as its own island.',
      'Look up, down, left, right.',
      'Only merge if the neighbor exists, is land, and belongs to a different component.',
      'Each successful union merges two islands into one.',
    ],
  },
  pseudocode: [
    'for each (r, c) in positions:',
    '  mark (r, c) as land',
    '  islands++',
    '  for each neighbor (nr, nc):',
    '    if neighbor is land:',
    '      if find(cell) != find(neighbor):',
    '        union(cell, neighbor)',
    '        islands--',
  ],
  defaultInput: {
    gridR: 3, gridC: 3,
    landOrder: [[0, 0], [0, 1], [1, 1], [1, 0], [2, 2], [0, 2]],
  },
  layout: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'dsu', label: 'Parent / Rank', area: 'bottom-left' },
    ],
  },
  build(input) {
    const { gridR: R, gridC: C, landOrder } = input || this.defaultInput;
    return buildSteps(({ snap, addLog }) => {
      const d = new DSU(R * C);
      const land = new Set();
      let islands = 0;

      addLog('Empty grid');
      snap({
        grid: { land: new Set(), parent: [...d.p], R, C },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: null,
        metrics: { Islands: { value: 0, color: '#6ee7b7' } },
      });

      for (const [r, c] of landOrder) {
        const idx = r * C + c;
        land.add(idx);
        islands++;
        addLog(`Add (${r},${c}) -> islands=${islands}`, 'active');
        snap({
          grid: { land: new Set(land), parent: [...d.p], R, C, hlCell: idx },
          dsu: { parent: [...d.p], rank: [...d.r], highlighted: [idx] },
          codeLine: [0, 1, 2],
          metrics: { Islands: { value: islands, color: '#6ee7b7' } },
        });

        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
          const ni = nr * C + nc;
          if (!land.has(ni)) continue;
          if (d.find(idx) !== d.find(ni)) {
            d.union(idx, ni);
            islands--;
            addLog(`Union (${r},${c})-(${nr},${nc}) -> islands=${islands}`);
            snap({
              grid: { land: new Set(land), parent: [...d.p], R, C },
              dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
              codeLine: [3, 4, 5, 6, 7],
              metrics: { Islands: { value: islands, color: '#6ee7b7' } },
            });
          }
        }
      }

      addLog(`Done! ${islands} island(s)`);
      snap({
        grid: { land: new Set(land), parent: [...d.p], R, C },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        result: `${islands} island(s)`,
      });
    });
  },
};
