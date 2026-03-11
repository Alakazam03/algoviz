import { buildSteps } from '../core/buildSteps';

export default {
  id: 'max-subarray-k',
  title: 'Max Sum Subarray of Size K',
  category: 'Sliding Window',
  difficulty: 'Easy',
  description: 'Find the maximum sum of any contiguous subarray of size k using the sliding window technique.',
  mnemonic: {
    steps: ['Build first window', 'Slide right: add right', 'Remove left', 'Track max sum'],
    detail: [
      'Sum the first k elements to form the initial window.',
      'Add the next element on the right to expand.',
      'Remove the leftmost element to maintain window size k.',
      'Compare current window sum with the best seen so far.',
    ],
  },
  pseudocode: [
    'sum = sum(arr[0..k-1])',
    'maxSum = sum',
    'for i = k to n-1:',
    '  sum += arr[i]     // add right',
    '  sum -= arr[i-k]   // remove left',
    '  maxSum = max(maxSum, sum)',
    'return maxSum',
  ],
  defaultInput: {
    array: [2, 1, 5, 1, 3, 2, 8, 1, 3],
    k: 3,
  },
  layout: {
    panels: [
      { renderer: 'array', label: 'Array', area: 'main' },
    ],
  },
  build(input) {
    const { array, k } = input || this.defaultInput;
    const n = array.length;

    return buildSteps(({ snap, addLog }) => {
      let sum = 0;
      let maxSum = -Infinity;
      let bestStart = 0;

      addLog(`Find max sum subarray of size ${k}`);
      snap({
        array: { values: array, comparing: [], swapping: [], sorted: [], highlighted: [] },
        codeLine: null,
      });

      // Build first window
      for (let i = 0; i < k; i++) sum += array[i];
      maxSum = sum;

      addLog(`Initial window [0..${k - 1}]: sum = ${sum}`);
      snap({
        array: {
          values: array, comparing: Array.from({ length: k }, (_, i) => i),
          swapping: [], sorted: [], highlighted: [],
        },
        codeLine: [0, 1],
      });

      // Slide window
      for (let i = k; i < n; i++) {
        sum += array[i];
        sum -= array[i - k];
        const windowStart = i - k + 1;

        addLog(`Window [${windowStart}..${i}]: +${array[i]} -${array[i - k]} → sum=${sum}`, 'active');

        const windowIndices = Array.from({ length: k }, (_, j) => windowStart + j);
        snap({
          array: {
            values: array, comparing: windowIndices,
            swapping: [], sorted: [], highlighted: [i, i - k],
          },
          codeLine: [2, 3, 4],
        });

        if (sum > maxSum) {
          maxSum = sum;
          bestStart = windowStart;
          addLog(`New max: ${maxSum}`);
        }

        snap({
          array: {
            values: array, comparing: windowIndices,
            swapping: [], sorted: [],
            highlighted: Array.from({ length: k }, (_, j) => bestStart + j),
          },
          codeLine: 5,
        });
      }

      const bestWindow = Array.from({ length: k }, (_, j) => bestStart + j);
      addLog(`Max sum = ${maxSum}, window [${bestStart}..${bestStart + k - 1}]`);
      snap({
        array: {
          values: array, comparing: [],
          swapping: [], sorted: bestWindow, highlighted: bestWindow,
        },
        codeLine: 6,
        result: `Max sum = ${maxSum} at [${bestStart}..${bestStart + k - 1}]`,
      });
    });
  },
};
