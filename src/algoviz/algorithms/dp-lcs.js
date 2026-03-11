import { buildSteps } from '../core/buildSteps';

export default {
  id: 'lcs',
  title: 'Longest Common Subsequence',
  category: 'DP',
  difficulty: 'Medium',
  description: 'Find the longest subsequence common to two strings using a 2D DP table. Classic dynamic programming.',
  mnemonic: {
    steps: ['Create (m+1)×(n+1) DP table', 'If chars match, dp[i][j] = dp[i-1][j-1]+1', 'Else dp[i][j] = max(dp[i-1][j], dp[i][j-1])', 'Answer at dp[m][n]'],
    detail: [
      'Initialize a table with extra row/column of zeros for the base case.',
      'When characters match, extend the previous diagonal value by 1.',
      'When they don\'t match, take the best of skipping either character.',
      'The bottom-right cell contains the length of the LCS.',
    ],
  },
  pseudocode: [
    'LCS(text1, text2):',
    '  m, n = len(text1), len(text2)',
    '  dp[0..m][0..n] = 0',
    '  for i in 1..m:',
    '    for j in 1..n:',
    '      if text1[i-1] == text2[j-1]:',
    '        dp[i][j] = dp[i-1][j-1] + 1',
    '      else:',
    '        dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    '  return dp[m][n]',
  ],
  defaultInput: { text1: 'abcde', text2: 'ace' },
  layout: {
    panels: [
      { renderer: 'dpTable', label: 'DP Table', area: 'main' },
    ],
  },
  build(input) {
    const { text1, text2 } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const m = text1.length;
      const n = text2.length;
      const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      const computed = [];

      // Labels: top row = text2 chars, left col = text1 chars
      const labels = [''];
      for (let j = 0; j < n; j++) labels.push(text2[j]);

      const dpSnap = (hlRow = -1, hlCol = -1, matchHL = []) => {
        // Flatten the dp table to a 1D values array for dpTable renderer
        const values = [];
        const highlighted = [];
        for (let i = 0; i <= m; i++) {
          for (let j = 0; j <= n; j++) {
            const idx = i * (n + 1) + j;
            values.push(dp[i][j]);
            if (i === hlRow && j === hlCol) highlighted.push(idx);
            if (matchHL.some(([mr, mc]) => mr === i && mc === j)) highlighted.push(idx);
          }
        }
        return {
          values, highlighted, computed: [...computed],
          labels: ['', ...text2.split('')],
          rowLabels: ['', ...text1.split('')],
          title: `LCS("${text1}", "${text2}")`,
          rows: m + 1,
          cols: n + 1,
        };
      };

      addLog(`LCS of "${text1}" and "${text2}"`);
      snap({ dpTable: dpSnap(), codeLine: [0, 1, 2] });

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (text1[i - 1] === text2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
            computed.push(i * (n + 1) + j);
            addLog(`'${text1[i - 1]}' == '${text2[j - 1]}' → dp[${i}][${j}] = ${dp[i][j]}`, 'active');
            snap({
              dpTable: dpSnap(i, j, [[i - 1, j - 1]]),
              codeLine: [5, 6],
            });
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            computed.push(i * (n + 1) + j);
            addLog(`'${text1[i - 1]}' ≠ '${text2[j - 1]}' → dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`);
            snap({
              dpTable: dpSnap(i, j, [[i - 1, j], [i, j - 1]]),
              codeLine: [7, 8],
            });
          }
        }
      }

      addLog(`LCS length = ${dp[m][n]}`);
      snap({
        dpTable: dpSnap(m, n),
        codeLine: 9,
        result: `LCS length = ${dp[m][n]}`,
      });
    });
  },
};
