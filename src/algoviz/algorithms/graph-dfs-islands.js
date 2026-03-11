import { buildSteps } from '../core/buildSteps';

export default {
  id: 'dfs-islands',
  title: 'Number of Islands (DFS)',
  category: 'Graph',
  difficulty: 'Medium',
  description: 'Count connected components of 1s in a grid using DFS flood fill.',
  mnemonic: {
    steps: ['Scan grid', 'Found unvisited land?', 'DFS flood fill', 'Increment count'],
    detail: [
      'Iterate through every cell in the grid.',
      'If cell is 1 and not visited, start a new island.',
      'DFS marks all connected land cells as visited.',
      'Each DFS call = one island found.',
    ],
  },
  pseudocode: [
    'count = 0',
    'for each cell (r,c):',
    '  if grid[r][c] == 1 and not visited:',
    '    dfs(r, c)  // flood fill',
    '    count++',
    'dfs(r,c):',
    '  mark visited',
    '  for each 4 neighbors:',
    '    if valid and land and not visited:',
    '      dfs(neighbor)',
  ],
  defaultInput: {
    grid: [
      [1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 1, 1],
    ],
  },
  layout: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'queueStack', label: 'DFS Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { grid } = input || this.defaultInput;
    const R = grid.length, C = grid[0].length;

    return buildSteps(({ snap, addLog }) => {
      const visited = Array.from({ length: R }, () => new Array(C).fill(false));
      const islandMap = new Array(R * C).fill(-1);
      let count = 0;
      const land = new Set();
      const walls = new Set();

      for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++) {
          const idx = r * C + c;
          if (grid[r][c] === 1) land.add(idx);
          else walls.add(idx);
        }

      const makeGridData = (hlCell) => ({
        land,
        parent: islandMap.map((v, i) => v >= 0 ? v : i + R * C),
        R, C, hlCell,
      });

      const stack = [];

      addLog('Scan grid for islands');
      snap({
        grid: makeGridData(-1),
        queueStack: { items: [], type: 'stack', label: 'DFS Stack' },
        codeLine: [0, 1],
      });

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      function dfs(r, c, islandId) {
        visited[r][c] = true;
        islandMap[r * C + c] = islandId;
        stack.push(`(${r},${c})`);

        snap({
          grid: makeGridData(r * C + c),
          queueStack: { items: [...stack], type: 'stack', label: 'DFS Stack' },
          codeLine: [5, 6],
        });

        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1 && !visited[nr][nc]) {
            addLog(`  Visit (${nr},${nc})`);
            dfs(nr, nc, islandId);
          }
        }

        stack.pop();
      }

      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          if (grid[r][c] === 1 && !visited[r][c]) {
            addLog(`Found island #${count + 1} starting at (${r},${c})`, 'active');
            snap({
              grid: makeGridData(r * C + c),
              queueStack: { items: [], type: 'stack', label: 'DFS Stack' },
              codeLine: [2, 3, 4],
            });

            dfs(r, c, count);
            count++;

            addLog(`Island #${count} fully explored`);
            snap({
              grid: makeGridData(-1),
              queueStack: { items: [], type: 'stack', label: 'DFS Stack' },
              codeLine: 4,
            });
          }
        }
      }

      addLog(`Total islands: ${count}`);
      snap({
        grid: makeGridData(-1),
        queueStack: { items: [], type: 'stack', label: 'DFS Stack' },
        result: `${count} islands`,
      });
    });
  },
};
