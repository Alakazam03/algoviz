import { buildSteps } from '../core/buildSteps';

export default {
  id: 'two-sum-sorted',
  title: 'Two Sum (Sorted Array)',
  category: 'Two Pointers',
  difficulty: 'Easy',
  description: 'Find two numbers in a sorted array that add up to target. Use two pointers from both ends.',
  mnemonic: {
    steps: ['Left pointer at start', 'Right pointer at end', 'Sum too small? Move left', 'Sum too big? Move right'],
    detail: [
      'Initialize left pointer at index 0.',
      'Initialize right pointer at last index.',
      'If sum < target, we need bigger numbers → move left pointer right.',
      'If sum > target, we need smaller numbers → move right pointer left.',
    ],
  },
  pseudocode: [
    'left = 0, right = n-1',
    'while left < right:',
    '  sum = arr[left] + arr[right]',
    '  if sum == target: return [left, right]',
    '  if sum < target: left++',
    '  else: right--',
    'return not found',
  ],
  defaultInput: {
    array: [1, 3, 5, 7, 9, 11, 15],
    target: 12,
  },
  layout: {
    panels: [
      { renderer: 'searchArray', label: 'Array', area: 'main' },
    ],
  },
  build(input) {
    const { array, target } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      let left = 0, right = array.length - 1;

      addLog(`Find two numbers summing to ${target}`);
      snap({
        searchArray: {
          values: array,
          lo: left, hi: right, mid: -1,
          labels: { [left]: 'L', [right]: 'R' },
          eliminated: [],
        },
        codeLine: 0,
      });

      while (left < right) {
        const sum = array[left] + array[right];
        addLog(`arr[${left}]=${array[left]} + arr[${right}]=${array[right]} = ${sum}`, 'active');
        snap({
          searchArray: {
            values: array,
            lo: left, hi: right, mid: -1,
            labels: { [left]: `L(${array[left]})`, [right]: `R(${array[right]})` },
            eliminated: [],
          },
          codeLine: [1, 2],
        });

        if (sum === target) {
          addLog(`Found! [${left}, ${right}] → ${array[left]} + ${array[right]} = ${target}`);
          snap({
            searchArray: {
              values: array,
              lo: left, hi: right, mid: -1,
              labels: { [left]: `✓ ${array[left]}`, [right]: `✓ ${array[right]}` },
              eliminated: [],
              found: [left, right],
            },
            codeLine: 3,
            result: `arr[${left}]=${array[left]} + arr[${right}]=${array[right]} = ${target}`,
          });
          return;
        }

        if (sum < target) {
          addLog(`${sum} < ${target}, move left →`);
          left++;
          snap({
            searchArray: {
              values: array,
              lo: left, hi: right, mid: -1,
              labels: { [left]: 'L', [right]: 'R' },
              eliminated: Array.from({ length: left }, (_, i) => i),
            },
            codeLine: 4,
          });
        } else {
          addLog(`${sum} > ${target}, move right ←`);
          right--;
          snap({
            searchArray: {
              values: array,
              lo: left, hi: right, mid: -1,
              labels: { [left]: 'L', [right]: 'R' },
              eliminated: Array.from({ length: array.length - right - 1 }, (_, i) => array.length - 1 - i),
            },
            codeLine: 5,
          });
        }
      }

      addLog('No pair found');
      snap({
        searchArray: { values: array, lo: -1, hi: -1, mid: -1, labels: {}, eliminated: [] },
        codeLine: 6,
        result: 'No pair found',
      });
    });
  },
};
