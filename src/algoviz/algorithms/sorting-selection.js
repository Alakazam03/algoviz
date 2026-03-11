import { buildSteps } from '../core/buildSteps';

export default {
  id: 'selection-sort',
  title: 'Selection Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'Find the minimum element and place it at the beginning. Repeat for remaining unsorted portion.',
  mnemonic: {
    steps: ['Find minimum in unsorted', 'Swap with first unsorted', 'Expand sorted region', 'Repeat'],
    detail: [
      'Scan the unsorted portion to find the smallest element.',
      'Swap it with the element at the boundary of sorted region.',
      'The sorted region grows by one each pass.',
      'Continue until entire array is sorted.',
    ],
  },
  pseudocode: [
    'for i = 0 to n-2:',
    '  minIdx = i',
    '  for j = i+1 to n-1:',
    '    if arr[j] < arr[minIdx]:',
    '      minIdx = j',
    '  swap(arr[i], arr[minIdx])',
  ],
  defaultInput: {
    array: [29, 10, 14, 37, 13, 5],
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
      const sorted = [];

      addLog(`Selection Sort: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: [], highlighted: [] },
        codeLine: null,
      });

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        addLog(`Pass ${i + 1}: find min in [${i}..${n - 1}]`, 'active');
        snap({
          array: { values: [...arr], comparing: [], swapping: [], sorted: [...sorted], highlighted: [i] },
          codeLine: [0, 1],
        });

        for (let j = i + 1; j < n; j++) {
          addLog(`Compare arr[${j}]=${arr[j]} vs min=${arr[minIdx]}`, 'active');
          snap({
            array: { values: [...arr], comparing: [j, minIdx], swapping: [], sorted: [...sorted], highlighted: [i] },
            codeLine: [2, 3],
          });

          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            addLog(`New min: arr[${j}]=${arr[j]}`);
            snap({
              array: { values: [...arr], comparing: [minIdx], swapping: [], sorted: [...sorted], highlighted: [i, minIdx] },
              codeLine: 4,
            });
          }
        }

        if (minIdx !== i) {
          addLog(`Swap arr[${i}]=${arr[i]} ↔ arr[${minIdx}]=${arr[minIdx]}`);
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          snap({
            array: { values: [...arr], comparing: [], swapping: [i, minIdx], sorted: [...sorted], highlighted: [] },
            codeLine: 5,
          });
        }

        sorted.push(i);
      }

      sorted.push(n - 1);
      addLog(`Sorted: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: [...sorted], highlighted: [] },
        result: `[${arr.join(', ')}]`,
      });
    });
  },
};
