import { buildSteps } from '../core/buildSteps';

export default {
  id: 'climb',
  title: 'Climbing Stairs (DP)',
  category: 'DP',
  difficulty: 'Easy',
  description: 'Count ways to climb n stairs taking 1 or 2 steps at a time. Classic DP: dp[i] = dp[i-1] + dp[i-2].',
  mnemonic: {
    steps: ['Define state: dp[i] = ways to reach step i', 'Base cases: dp[0]=1, dp[1]=1', 'Recurrence: dp[i] = dp[i-1] + dp[i-2]', 'Fill bottom-up', 'Answer: dp[n]'],
    detail: [
      'dp[i] represents the number of distinct ways to reach step i.',
      'There is 1 way to stay at ground (do nothing), 1 way to reach step 1.',
      'To reach step i, you either came from step i-1 (1 step) or i-2 (2 steps).',
      'Compute dp[2], dp[3], ..., dp[n] in order.',
      'dp[n] is the final answer.',
    ],
  },
  pseudocode: [
    'dp[0] = 1',
    'dp[1] = 1',
    'for i = 2 to n:',
    '  dp[i] = dp[i-1] + dp[i-2]',
    'return dp[n]',
  ],
  defaultInput: {
    n: 7,
  },
  layout: {
    panels: [
      { renderer: 'dpTable', label: 'DP Table', area: 'main' },
    ],
  },
  build(input) {
    const { n } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const dp = new Array(n + 1).fill(null);

      addLog('Climbing Stairs DP');
      snap({
        dpTable: {
          values: [...dp], highlighted: [], computed: [],
          labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
          title: 'dp[] = ways to reach step i',
        },
        codeLine: null,
      });

      dp[0] = 1;
      addLog('dp[0] = 1');
      snap({
        dpTable: {
          values: [...dp], highlighted: [0], computed: [0],
          labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
          title: 'dp[]',
        },
        codeLine: 0,
      });

      dp[1] = 1;
      addLog('dp[1] = 1');
      snap({
        dpTable: {
          values: [...dp], highlighted: [1], computed: [0, 1],
          labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
          title: 'dp[]',
        },
        codeLine: 1,
      });

      const computed = [0, 1];

      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        computed.push(i);
        addLog(`dp[${i}] = dp[${i - 1}](${dp[i - 1]}) + dp[${i - 2}](${dp[i - 2]}) = ${dp[i]}`, 'active');
        snap({
          dpTable: {
            values: [...dp], highlighted: [i], computed: [...computed],
            labels: Array.from({ length: n + 1 }, (_, j) => `dp[${j}]`),
            arrows: [`dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`],
            title: 'dp[]',
          },
          codeLine: [2, 3],
        });
      }

      addLog(`Answer: dp[${n}] = ${dp[n]}`);
      snap({
        dpTable: {
          values: [...dp], highlighted: [n], computed: [...computed],
          labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
          title: 'dp[]',
        },
        codeLine: 4,
        result: `dp[${n}] = ${dp[n]}`,
      });
    });
  },
};
