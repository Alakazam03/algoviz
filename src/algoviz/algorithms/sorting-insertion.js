import { buildSteps } from '../core/buildSteps';

export default {
  id: 'insertion-sort',
  title: 'Insertion Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'Build sorted array one element at a time by inserting each element into its correct position.',
  mnemonic: {
    steps: ['Pick next element', 'Compare going left', 'Shift larger elements right', 'Insert at correct spot'],
    detail: [
      'Start from the second element, consider it the "key".',
      'Compare the key with elements to its left.',
      'Shift elements larger than key one position right.',
      'Place key at the position where it belongs.',
    ],
  },
  pseudocode: [
    'for i = 1 to n-1:',
    '  key = arr[i]',
    '  j = i - 1',
    '  while j >= 0 and arr[j] > key:',
    '    arr[j+1] = arr[j]  // shift right',
    '    j--',
    '  arr[j+1] = key  // insert',
  ],
  defaultInput: {
    array: [12, 11, 13, 5, 6, 7],
  },
  layout: {
    panels: [
      { renderer: 'array', label: 'Array', area: 'main' },
    ],
  },
  build(input) {
    const { array } = input || this.defaultInput;
    const arr = [...array];
    const n = arr.length;

    return buildSteps(({ snap, addLog }) => {
      const sorted = [0];

      addLog(`Insertion Sort: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: [0], highlighted: [] },
        codeLine: null,
      });

      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        addLog(`Insert key=${key} (index ${i})`, 'active');
        snap({
          array: { values: [...arr], comparing: [], swapping: [], sorted: [...sorted], highlighted: [i] },
          codeLine: [0, 1, 2],
        });

        while (j >= 0 && arr[j] > key) {
          addLog(`arr[${j}]=${arr[j]} > ${key}, shift right`);
          arr[j + 1] = arr[j];
          snap({
            array: { values: [...arr], comparing: [j, j + 1], swapping: [j, j + 1], sorted: [...sorted], highlighted: [] },
            codeLine: [3, 4, 5],
          });
          j--;
        }

        arr[j + 1] = key;
        sorted.push(i);
        addLog(`Place ${key} at index ${j + 1}`);
        snap({
          array: { values: [...arr], comparing: [], swapping: [], sorted: [...sorted], highlighted: [j + 1] },
          codeLine: 6,
        });
      }

      addLog(`Sorted: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), highlighted: [] },
        result: `[${arr.join(', ')}]`,
      });
    });
  },
};
