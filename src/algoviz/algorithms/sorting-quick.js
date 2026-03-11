import { buildSteps } from '../core/buildSteps';

export default {
  id: 'quick-sort',
  title: 'Quick Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'Divide-and-conquer sort: pick a pivot, partition so smaller elements go left, larger go right, then recurse.',
  mnemonic: {
    steps: ['Pick pivot (last element)', 'Partition: i tracks boundary', 'Swap smaller elements to left', 'Place pivot at boundary, recurse'],
    detail: [
      'Choose the last element as the pivot for Lomuto partition.',
      'Variable i marks the boundary — everything before i is smaller than pivot.',
      'Scan j across the subarray. If arr[j] < pivot, swap arr[j] with arr[i] and advance i.',
      'After scan, swap pivot into position i. Recurse on left and right partitions.',
    ],
  },
  pseudocode: [
    'quickSort(arr, lo, hi):',
    '  if lo >= hi: return',
    '  pivot = arr[hi]',
    '  i = lo',
    '  for j in lo..hi-1:',
    '    if arr[j] < pivot:',
    '      swap(arr[i], arr[j])',
    '      i++',
    '  swap(arr[i], arr[hi])  // place pivot',
    '  quickSort(arr, lo, i-1)',
    '  quickSort(arr, i+1, hi)',
  ],
  defaultInput: { values: [8, 3, 1, 7, 0, 10, 2] },
  layout: {
    panels: [
      { renderer: 'array', label: 'Array', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { values } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const arr = [...values];
      const sorted = new Set();
      const stack = [];

      const arrSnap = (cmp = [], swp = []) => ({
        values: [...arr], comparing: cmp, swapping: swp,
        sorted: [...sorted], highlighted: [],
      });

      addLog(`Quick sort [${arr.join(', ')}]`);
      snap({
        array: arrSnap(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function quickSort(lo, hi) {
        if (lo >= hi) {
          if (lo === hi) sorted.add(lo);
          return;
        }

        stack.push(`qs(${lo}..${hi})`);
        const pivot = arr[hi];

        addLog(`Partition [${lo}..${hi}], pivot=${pivot}`, 'active');
        snap({
          array: arrSnap([hi]),
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 1, 2, 3],
        });

        let i = lo;
        for (let j = lo; j < hi; j++) {
          addLog(`Compare arr[${j}]=${arr[j]} vs pivot=${pivot}`);
          snap({
            array: arrSnap([j, hi]),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [4, 5],
          });

          if (arr[j] < pivot) {
            if (i !== j) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
              addLog(`Swap arr[${i}] ↔ arr[${j}]`);
              snap({
                array: arrSnap([], [i, j]),
                queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
                codeLine: [6, 7],
              });
            }
            i++;
          }
        }

        // Place pivot
        [arr[i], arr[hi]] = [arr[hi], arr[i]];
        sorted.add(i);
        addLog(`Place pivot ${pivot} at index ${i}`);
        snap({
          array: arrSnap([], [i, hi]),
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: 8,
        });

        quickSort(lo, i - 1);
        quickSort(i + 1, hi);
        stack.pop();
      }

      quickSort(0, arr.length - 1);

      addLog(`Sorted: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: arr.map((_, i) => i), highlighted: [] },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `Sorted: [${arr.join(', ')}]`,
      });
    });
  },
};
