import { buildSteps } from '../core/buildSteps';

export default {
  id: 'bubble',
  title: 'Bubble Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'Repeatedly swap adjacent elements if they are in the wrong order. Largest bubbles to the end.',
  mnemonic: {
    steps: ['Outer loop: n-1 passes', 'Inner loop: compare adjacent', 'If arr[j] > arr[j+1]: swap', 'Largest element settled'],
    detail: [
      'Each pass guarantees the next-largest element reaches its position.',
      'Compare each pair of adjacent elements.',
      'If out of order, swap them.',
      'After pass i, the i-th largest is in its final position.',
    ],
  },
  pseudocode: [
    'for i = 0 to n-2:',
    '  for j = 0 to n-2-i:',
    '    if arr[j] > arr[j+1]:',
    '      swap(arr[j], arr[j+1])',
    '  // arr[n-1-i] is now sorted',
    'return arr',
  ],
  defaultInput: {
    array: [5, 3, 8, 1, 4, 2],
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

      addLog(`Bubble sort: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: [], highlighted: [] },
        codeLine: null,
      });

      for (let i = 0; i < n - 1; i++) {
        addLog(`Pass ${i + 1}`);

        for (let j = 0; j < n - 1 - i; j++) {
          addLog(`Compare arr[${j}]=${arr[j]} vs arr[${j + 1}]=${arr[j + 1]}`, 'active');
          snap({
            array: { values: [...arr], comparing: [j, j + 1], swapping: [], sorted: [...sorted], highlighted: [] },
            codeLine: [0, 1, 2],
          });

          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            addLog(`Swap! -> [${arr.join(', ')}]`);
            snap({
              array: { values: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted], highlighted: [] },
              codeLine: 3,
            });
          }
        }

        sorted.push(n - 1 - i);
        addLog(`Position ${n - 1 - i} settled`);
        snap({
          array: { values: [...arr], comparing: [], swapping: [], sorted: [...sorted], highlighted: [] },
          codeLine: 4,
        });
      }

      sorted.push(0);
      addLog(`Sorted: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: [...sorted], highlighted: [] },
        codeLine: 5,
        result: `[${arr.join(', ')}]`,
      });
    });
  },
};
