import { buildSteps } from '../core/buildSteps';

export default {
  id: 'coin-change',
  title: 'Coin Change',
  category: 'DP',
  difficulty: 'Medium',
  description: 'Minimum coins to make a target amount. dp[i] = min(dp[i - coin] + 1) for each coin.',
  mnemonic: {
    steps: ['State: dp[i] = min coins for amount i', 'Base: dp[0] = 0', 'Try each coin', 'dp[i] = min(dp[i], dp[i-coin]+1)'],
    detail: [
      'dp[i] represents the fewest coins needed to make amount i.',
      'Zero coins needed to make amount 0.',
      'For each amount, try using each available coin denomination.',
      'If coin ≤ i and dp[i-coin] is valid, update dp[i].',
    ],
  },
  pseudocode: [
    'dp[0] = 0',
    'dp[1..amount] = Infinity',
    'for i = 1 to amount:',
    '  for each coin in coins:',
    '    if coin <= i and dp[i-coin]+1 < dp[i]:',
    '      dp[i] = dp[i-coin] + 1',
    'return dp[amount] or -1',
  ],
  defaultInput: {
    coins: [1, 3, 4],
    amount: 6,
  },
  layout: {
    panels: [
      { renderer: 'dpTable', label: 'DP Table', area: 'main' },
    ],
  },
  build(input) {
    const { coins, amount } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const dp = new Array(amount + 1).fill(Infinity);
      dp[0] = 0;
      const computed = [0];

      addLog(`Coins: [${coins.join(', ')}], Amount: ${amount}`);
      snap({
        dpTable: {
          values: dp.map(v => v === Infinity ? '∞' : v),
          highlighted: [0], computed: [0],
          labels: Array.from({ length: amount + 1 }, (_, i) => `${i}`),
          title: 'dp[i] = min coins for amount i',
        },
        codeLine: [0, 1],
      });

      for (let i = 1; i <= amount; i++) {
        addLog(`Amount ${i}:`, 'active');

        for (const coin of coins) {
          if (coin <= i && dp[i - coin] + 1 < dp[i]) {
            dp[i] = dp[i - coin] + 1;
            addLog(`  coin ${coin}: dp[${i}] = dp[${i - coin}]+1 = ${dp[i]}`);
          }
        }

        computed.push(i);
        snap({
          dpTable: {
            values: dp.map(v => v === Infinity ? '∞' : v),
            highlighted: [i], computed: [...computed],
            labels: Array.from({ length: amount + 1 }, (_, j) => `${j}`),
            arrows: dp[i] !== Infinity ? [`dp[${i}] = ${dp[i]} coins`] : ['no solution'],
            title: 'dp[i] = min coins for amount i',
          },
          codeLine: [2, 3, 4, 5],
        });
      }

      const ans = dp[amount] === Infinity ? -1 : dp[amount];
      addLog(ans === -1 ? 'No solution!' : `Minimum coins: ${ans}`);
      snap({
        dpTable: {
          values: dp.map(v => v === Infinity ? '∞' : v),
          highlighted: [amount], computed: [...computed],
          labels: Array.from({ length: amount + 1 }, (_, i) => `${i}`),
          title: 'dp[i] = min coins for amount i',
        },
        codeLine: 6,
        result: ans === -1 ? 'Impossible (-1)' : `${ans} coins`,
      });
    });
  },
};
