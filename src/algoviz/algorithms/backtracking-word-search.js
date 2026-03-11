import { buildSteps } from '../core/buildSteps';

export default {
  id: 'word-search',
  title: 'Word Search',
  category: 'Recursion',
  difficulty: 'Medium',
  description: 'Given a 2D grid and a word, find if the word exists by following adjacent cells (no reuse). Classic grid backtracking.',
  mnemonic: {
    steps: ['Find first letter in grid', 'DFS to match next letter', 'Mark visited to avoid reuse', 'Backtrack if path fails'],
    detail: [
      'Scan every cell for the first character of the word.',
      'From a matching cell, explore all 4 directions for the next character.',
      'Mark cells as visited while exploring to prevent revisiting.',
      'If no direction works, unmark the cell and try a different path.',
    ],
  },
  pseudocode: [
    'for each cell (r, c):',
    '  if dfs(r, c, 0): return true',
    'return false',
    '',
    'dfs(r, c, idx):',
    '  if idx == len(word): return true',
    '  if out of bounds or visited or grid[r][c] != word[idx]:',
    '    return false',
    '  mark visited',
    '  explore 4 directions with idx+1',
    '  unmark (backtrack)',
  ],
  defaultInput: {
    grid: [
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E'],
    ],
    word: 'ABCCED',
  },
  layout: {
    panels: [
      { renderer: 'grid', label: 'Grid', area: 'main' },
      { renderer: 'queueStack', label: 'Path', area: 'sidebar' },
    ],
  },
  build(input) {
    const { grid, word } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const rows = grid.length;
      const cols = grid[0].length;
      const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
      const path = [];

      const gridSnap = (hlCells = []) => {
        const cells = [];
        const highlighted = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            cells.push(visited[r][c] ? grid[r][c].toLowerCase() : grid[r][c]);
            if (hlCells.some(([hr, hc]) => hr === r && hc === c)) highlighted.push(idx);
          }
        }
        return {
          cells, rows, cols, highlighted,
          cellColors: cells.map((v, idx) => {
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            if (highlighted.includes(idx)) return '#fbbf24';
            if (visited[r][c]) return '#6ee7b7';
            return null;
          }),
        };
      };

      addLog(`Search for "${word}" in grid`);
      snap({
        grid: gridSnap(),
        queueStack: { items: [], type: 'stack', label: 'Path' },
        codeLine: null,
      });

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      function dfs(r, c, idx) {
        if (idx === word.length) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (visited[r][c] || grid[r][c] !== word[idx]) return false;

        visited[r][c] = true;
        path.push(`${grid[r][c]}(${r},${c})`);

        addLog(`Match '${word[idx]}' at (${r},${c}) [${idx + 1}/${word.length}]`, 'active');
        snap({
          grid: gridSnap([[r, c]]),
          queueStack: { items: [...path], type: 'stack', label: 'Path' },
          codeLine: [5, 8],
        });

        for (const [dr, dc] of dirs) {
          if (dfs(r + dr, c + dc, idx + 1)) return true;
        }

        // Backtrack
        visited[r][c] = false;
        path.pop();
        addLog(`Backtrack from (${r},${c})`);
        snap({
          grid: gridSnap([[r, c]]),
          queueStack: { items: [...path], type: 'stack', label: 'Path' },
          codeLine: 10,
        });

        return false;
      }

      let found = false;
      for (let r = 0; r < rows && !found; r++) {
        for (let c = 0; c < cols && !found; c++) {
          if (grid[r][c] === word[0]) {
            addLog(`Try starting at (${r},${c})`);
            snap({
              grid: gridSnap([[r, c]]),
              queueStack: { items: [], type: 'stack', label: 'Path' },
              codeLine: [0, 1],
            });
            if (dfs(r, c, 0)) found = true;
          }
        }
      }

      addLog(found ? `Found "${word}"!` : `"${word}" not found`);
      snap({
        grid: gridSnap(),
        queueStack: { items: found ? [...path] : [], type: 'stack', label: 'Path' },
        result: found ? `"${word}" found!` : `"${word}" not found`,
      });
    });
  },
};
