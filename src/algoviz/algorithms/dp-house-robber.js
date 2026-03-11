import { buildSteps } from '../core/buildSteps';

export default {
  id: 'house-robber',
  title: 'House Robber',
  category: 'DP',
  difficulty: 'Medium',
  description: 'Maximum money robbing non-adjacent houses. dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
  mnemonic: {
    steps: ['State: dp[i] = max money up to house i', 'Skip or rob?', 'Skip: dp[i] = dp[i-1]', 'Rob: dp[i] = dp[i-2] + nums[i]'],
    detail: [
      'dp[i] represents the maximum money considering houses 0..i.',
      'At each house, decide: skip it or rob it.',
      'If skip, best is same as dp[i-1].',
      'If rob, add house i\'s money to dp[i-2] (can\'t rob adjacent).',
    ],
  },
  pseudocode: [
    'dp[0] = nums[0]',
    'dp[1] = max(nums[0], nums[1])',
    'for i = 2 to n-1:',
    '  dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
    'return dp[n-1]',
  ],
  defaultInput: {
    nums: [2, 7, 9, 3, 1, 6],
  },
  layout: {
    panels: [
      { renderer: 'dpTable', label: 'DP Table', area: 'main' },
      { renderer: 'array', label: 'Houses', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nums } = input || this.defaultInput;
    const n = nums.length;

    return buildSteps(({ snap, addLog }) => {
      const dp = new Array(n).fill(null);
      const computed = [];

      addLog(`Houses: [${nums.join(', ')}]`);
      snap({
        dpTable: {
          values: [...dp], highlighted: [], computed: [],
          labels: Array.from({ length: n }, (_, i) => `dp[${i}]`),
          title: 'dp[] = max money up to house i',
        },
        array: {
          values: nums, comparing: [], swapping: [], sorted: [], highlighted: [],
        },
        codeLine: null,
      });

      dp[0] = nums[0];
      computed.push(0);
      addLog(`dp[0] = nums[0] = ${nums[0]}`);
      snap({
        dpTable: {
          values: [...dp], highlighted: [0], computed: [...computed],
          labels: Array.from({ length: n }, (_, i) => `dp[${i}]`),
          title: 'dp[]',
        },
        array: {
          values: nums, comparing: [], swapping: [], sorted: [], highlighted: [0],
        },
        codeLine: 0,
      });

      if (n > 1) {
        dp[1] = Math.max(nums[0], nums[1]);
        computed.push(1);
        addLog(`dp[1] = max(${nums[0]}, ${nums[1]}) = ${dp[1]}`);
        snap({
          dpTable: {
            values: [...dp], highlighted: [1], computed: [...computed],
            labels: Array.from({ length: n }, (_, i) => `dp[${i}]`),
            title: 'dp[]',
          },
          array: {
            values: nums, comparing: [], swapping: [], sorted: [], highlighted: [0, 1],
          },
          codeLine: 1,
        });
      }

      for (let i = 2; i < n; i++) {
        const skip = dp[i - 1];
        const rob = dp[i - 2] + nums[i];
        dp[i] = Math.max(skip, rob);
        computed.push(i);

        const choice = dp[i] === rob ? 'ROB' : 'SKIP';
        addLog(`dp[${i}] = max(dp[${i - 1}]=${skip}, dp[${i - 2}]=${dp[i - 2]}+${nums[i]}=${rob}) = ${dp[i]} (${choice})`, 'active');
        snap({
          dpTable: {
            values: [...dp], highlighted: [i], computed: [...computed],
            labels: Array.from({ length: n }, (_, j) => `dp[${j}]`),
            arrows: [`${choice}: dp[${i}] = ${dp[i]}`],
            title: 'dp[]',
          },
          array: {
            values: nums, comparing: [], swapping: [], sorted: [], highlighted: [i],
          },
          codeLine: [2, 3],
        });
      }

      addLog(`Max robbery: $${dp[n - 1]}`);
      snap({
        dpTable: {
          values: [...dp], highlighted: [n - 1], computed: [...computed],
          labels: Array.from({ length: n }, (_, i) => `dp[${i}]`),
          title: 'dp[]',
        },
        array: {
          values: nums, comparing: [], swapping: [], sorted: [], highlighted: [],
        },
        codeLine: 4,
        result: `Max = $${dp[n - 1]}`,
      });
    });
  },
};
