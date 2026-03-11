import { buildSteps } from '../core/buildSteps';

export default {
  id: 'n-queens',
  title: 'N-Queens',
  category: 'Recursion',
  difficulty: 'Hard',
  description: 'Place N queens on an N×N board so no two attack each other. Classic backtracking with constraint checking.',
  mnemonic: {
    steps: ['Place queen row by row', 'Check column, diag, anti-diag', 'If safe, place and recurse', 'If stuck, backtrack'],
    detail: [
      'Try placing one queen per row, starting from row 0.',
      'Before placing, verify no queen attacks via same column or diagonals.',
      'If the cell is safe, place the queen and move to the next row.',
      'If no column works in a row, remove last queen and try next column.',
    ],
  },
  pseudocode: [
    'solve(row):',
    '  if row == N: solution found!',
    '  for col in 0..N-1:',
    '    if isSafe(row, col):',
    '      place queen at (row, col)',
    '      solve(row + 1)',
    '      remove queen (backtrack)',
  ],
  defaultInput: { n: 4 },
  layout: {
    panels: [
      { renderer: 'grid', label: 'Board', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { n } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      // Board: 0 = empty, 1 = queen, 2 = attacked
      const board = Array.from({ length: n }, () => Array(n).fill(0));
      const queens = []; // col index per row
      const stack = [];
      let solutions = 0;

      const gridSnap = (hlCells = [], checkCells = []) => {
        const cells = [];
        const highlighted = [];
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            const idx = r * n + c;
            cells.push(board[r][c] === 1 ? 'Q' : board[r][c] === 2 ? '·' : 0);
            if (hlCells.some(([hr, hc]) => hr === r && hc === c)) highlighted.push(idx);
          }
        }
        return {
          cells, rows: n, cols: n, highlighted,
          cellColors: cells.map((v, idx) => {
            if (highlighted.includes(idx)) return '#fbbf24';
            if (checkCells.some(([cr, cc]) => cr === Math.floor(idx / n) && cc === idx % n)) return '#f472b644';
            if (v === 'Q') return '#6ee7b7';
            return null;
          }),
        };
      };

      addLog(`Solve ${n}-Queens`);
      snap({
        grid: gridSnap(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function isSafe(row, col) {
        for (let r = 0; r < row; r++) {
          const c = queens[r];
          if (c === col || Math.abs(r - row) === Math.abs(c - col)) return false;
        }
        return true;
      }

      function getAttacked(row, col) {
        const cells = [];
        for (let r = 0; r < row; r++) {
          const c = queens[r];
          if (c === col) cells.push([r, c]);
          if (Math.abs(r - row) === Math.abs(c - col)) cells.push([r, c]);
        }
        return cells;
      }

      function solve(row) {
        if (row === n) {
          solutions++;
          addLog(`Solution #${solutions} found!`);
          snap({
            grid: gridSnap(),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 1,
          });
          return;
        }

        stack.push(`solve(row=${row})`);

        for (let col = 0; col < n; col++) {
          const safe = isSafe(row, col);
          const conflicts = getAttacked(row, col);

          if (!safe) {
            addLog(`(${row},${col}) attacked — skip`);
            snap({
              grid: gridSnap([[row, col]], conflicts),
              queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
              codeLine: [2, 3],
            });
            continue;
          }

          // Place queen
          board[row][col] = 1;
          queens[row] = col;
          addLog(`Place queen at (${row},${col})`, 'active');
          snap({
            grid: gridSnap([[row, col]]),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [4, 5],
          });

          solve(row + 1);

          // Backtrack
          board[row][col] = 0;
          queens[row] = undefined;
          addLog(`Remove queen from (${row},${col})`);
          snap({
            grid: gridSnap([[row, col]]),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 6,
          });
        }

        stack.pop();
      }

      solve(0);

      addLog(`Done! ${solutions} solution(s)`);
      snap({
        grid: gridSnap(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `${solutions} solution(s) for ${n}-Queens`,
      });
    });
  },
};
