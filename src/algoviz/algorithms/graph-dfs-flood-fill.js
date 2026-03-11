import { buildSteps } from '../core/buildSteps';

export default {
  id: 'flood-fill',
  title: 'Flood Fill',
  category: 'Graph',
  difficulty: 'Easy',
  description: 'DFS to fill all connected cells of the same color with a new color (like paint bucket).',
  mnemonic: {
    steps: ['Start at (sr,sc)', 'Check same color', 'Fill with new color', 'DFS 4 neighbors'],
    detail: [
      'Start at the given starting row and column.',
      'Only fill cells that match the original color.',
      'Change the current cell to the new color.',
      'Recursively fill up, down, left, right.',
    ],
  },
  pseudocode: [
    'floodFill(r, c, newColor):',
    '  origColor = grid[sr][sc]',
    '  if origColor == newColor: return',
    '  dfs(r, c):',
    '    if out of bounds: return',
    '    if grid[r][c] != origColor: return',
    '    grid[r][c] = newColor',
    '    dfs(r-1,c), dfs(r+1,c)',
    '    dfs(r,c-1), dfs(r,c+1)',
  ],
  defaultInput: {
    grid: [
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 1, 1, 0],
      [0, 0, 1, 1, 1],
    ],
    sr: 0, sc: 0,
    newColor: 2,
  },
  layout: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'queueStack', label: 'DFS Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { grid: origGrid, sr, sc, newColor } = input || this.defaultInput;
    const R = origGrid.length, C = origGrid[0].length;
    const grid = origGrid.map(row => [...row]);
    const origColor = grid[sr][sc];

    return buildSteps(({ snap, addLog }) => {
      const filled = new Set();
      const walls = new Set();
      const stack = [];

      // Initialize: land = cells with origColor, walls = everything else
      for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++) {
          if (grid[r][c] !== origColor && grid[r][c] !== newColor) walls.add(r * C + c);
        }

      const makeGridData = (hlCell) => ({
        land: new Set([...Array(R * C).keys()].filter(i => !walls.has(i))),
        parent: Array.from({ length: R * C }, (_, i) => filled.has(i) ? 0 : i + R * C),
        R, C, hlCell,
      });

      addLog(`Flood fill from (${sr},${sc}), color ${origColor} → ${newColor}`);
      snap({
        grid: makeGridData(sr * C + sc),
        queueStack: { items: [], type: 'stack', label: 'DFS Stack' },
        codeLine: [0, 1],
      });

      if (origColor === newColor) {
        addLog('Original = new color, nothing to do');
        snap({
          grid: makeGridData(-1),
          queueStack: { items: [], type: 'stack', label: 'DFS Stack' },
          codeLine: 2,
          result: 'No change needed',
        });
        return;
      }

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      function dfs(r, c) {
        if (r < 0 || r >= R || c < 0 || c >= C) return;
        if (grid[r][c] !== origColor) return;

        grid[r][c] = newColor;
        const idx = r * C + c;
        filled.add(idx);
        stack.push(`(${r},${c})`);

        addLog(`Fill (${r},${c})`, 'active');
        snap({
          grid: makeGridData(idx),
          queueStack: { items: [...stack], type: 'stack', label: 'DFS Stack' },
          codeLine: [4, 5, 6],
        });

        for (const [dr, dc] of dirs) {
          dfs(r + dr, c + dc);
        }

        stack.pop();
      }

      dfs(sr, sc);

      addLog(`Flood fill complete! ${filled.size} cells filled`);
      snap({
        grid: makeGridData(-1),
        queueStack: { items: [], type: 'stack', label: 'DFS Stack' },
        result: `${filled.size} cells filled`,
      });
    });
  },
};
