import { buildSteps } from '../core/buildSteps';

export default {
  id: 'rotting-oranges',
  title: 'Rotting Oranges',
  category: 'Graph',
  difficulty: 'Medium',
  description: 'Multi-source BFS on a grid. Each minute, rotten oranges rot adjacent fresh ones. Find minimum time.',
  mnemonic: {
    steps: ['Find all rotten (multi-source)', 'BFS layer by layer', 'Rot adjacent fresh', 'Count minutes'],
    detail: [
      'Add all initially rotten oranges to the queue.',
      'Process one layer of BFS = one minute.',
      'Each rotten orange rots its 4 neighbors.',
      'Track minutes until no fresh oranges remain.',
    ],
  },
  pseudocode: [
    'queue = all initially rotten oranges',
    'while queue is not empty:',
    '  for each cell in current layer:',
    '    for each 4-directional neighbor:',
    '      if neighbor is fresh:',
    '        mark rotten, enqueue',
    '  minutes++',
    'return fresh remaining ? -1 : minutes',
  ],
  defaultInput: {
    grid: [
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  layout: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'queueStack', label: 'Queue', area: 'sidebar' },
    ],
  },
  build(input) {
    const { grid: origGrid } = input || this.defaultInput;
    const R = origGrid.length, C = origGrid[0].length;
    const grid = origGrid.map(row => [...row]);

    return buildSteps(({ snap, addLog }) => {
      const queue = [];
      let fresh = 0;
      const rotten = new Set();
      const walls = new Set();

      // Scan grid
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          const idx = r * C + c;
          if (grid[r][c] === 2) { queue.push([r, c]); rotten.add(idx); }
          else if (grid[r][c] === 1) fresh++;
          else walls.add(idx);
        }
      }

      const makeGridData = (hlCell) => ({
        land: new Set([...Array(R * C).keys()].filter(i => !walls.has(i))),
        parent: Array.from({ length: R * C }, (_, i) => rotten.has(i) ? 0 : i + R * C),
        R, C, hlCell,
      });

      addLog(`Grid: ${R}x${C}, Fresh: ${fresh}, Rotten: ${queue.length}`);
      snap({
        grid: makeGridData(-1),
        queueStack: { items: queue.map(([r, c]) => `(${r},${c})`), type: 'queue' },
        codeLine: 0,
      });

      let minutes = 0;
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      while (queue.length > 0 && fresh > 0) {
        const layerSize = queue.length;
        addLog(`Minute ${minutes + 1}: processing ${layerSize} rotten`, 'active');

        for (let i = 0; i < layerSize; i++) {
          const [r, c] = queue.shift();

          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
              grid[nr][nc] = 2;
              fresh--;
              const nidx = nr * C + nc;
              rotten.add(nidx);
              queue.push([nr, nc]);
              addLog(`  Rot (${nr},${nc})`);
            }
          }
        }

        minutes++;
        snap({
          grid: makeGridData(-1),
          queueStack: { items: queue.map(([r, c]) => `(${r},${c})`), type: 'queue' },
          codeLine: [1, 2, 3, 4, 5, 6],
        });
      }

      const answer = fresh === 0 ? minutes : -1;
      addLog(answer === -1 ? 'Impossible! Fresh oranges remain.' : `All rotted in ${minutes} minutes`);
      snap({
        grid: makeGridData(-1),
        queueStack: { items: [], type: 'queue' },
        codeLine: 7,
        result: answer === -1 ? 'Impossible (-1)' : `${minutes} minutes`,
      });
    });
  },
};
