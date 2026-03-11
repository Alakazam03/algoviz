import { buildSteps } from '../core/buildSteps';

export default {
  id: 'merge',
  title: 'Merge Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'Divide array in half, recursively sort, then merge sorted halves.',
  mnemonic: {
    steps: ['Split in half', 'Recurse left', 'Recurse right', 'Merge sorted halves'],
    detail: [
      'Find mid, divide.',
      'Sort left subarray.',
      'Sort right subarray.',
      'Two-pointer merge.',
    ],
  },
  pseudocode: [
    'mergeSort(arr, lo, hi):',
    '  if lo >= hi: return',
    '  mid = (lo + hi) / 2',
    '  mergeSort(arr, lo, mid)',
    '  mergeSort(arr, mid+1, hi)',
    '  merge(arr, lo, mid, hi)',
    '  // two-pointer merge step',
  ],
  defaultInput: {
    array: [8, 3, 5, 1, 4, 2, 7, 6],
  },
  layout: {
    panels: [
      { renderer: 'array', label: 'Array', area: 'main' },
    ],
  },
  build(input) {
    const { array } = input || this.defaultInput;
    const arr = [...array];

    return buildSteps(({ snap, addLog }) => {
      addLog(`Merge sort: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: [], highlighted: [] },
        codeLine: null,
      });

      function mergeSort(lo, hi) {
        if (lo >= hi) return;
        const mid = Math.floor((lo + hi) / 2);

        addLog(`Split [${lo}..${hi}] at mid=${mid}`, 'active');
        snap({
          array: { values: [...arr], comparing: [], swapping: [], sorted: [], highlighted: range(lo, hi) },
          codeLine: [0, 1, 2],
        });

        mergeSort(lo, mid);
        mergeSort(mid + 1, hi);

        // Merge step
        const left = arr.slice(lo, mid + 1);
        const right = arr.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo;

        addLog(`Merge [${lo}..${mid}] + [${mid + 1}..${hi}]`, 'active');
        snap({
          array: { values: [...arr], comparing: [], swapping: [], sorted: [], highlighted: range(lo, hi) },
          codeLine: [5, 6],
        });

        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) {
            arr[k] = left[i]; i++;
          } else {
            arr[k] = right[j]; j++;
          }
          k++;
        }
        while (i < left.length) { arr[k] = left[i]; i++; k++; }
        while (j < right.length) { arr[k] = right[j]; j++; k++; }

        addLog(`Merged: [${arr.slice(lo, hi + 1).join(', ')}]`);
        snap({
          array: { values: [...arr], comparing: [], swapping: [], sorted: [], highlighted: range(lo, hi) },
          codeLine: 5,
        });
      }

      mergeSort(0, arr.length - 1);

      addLog(`Sorted: [${arr.join(', ')}]`);
      snap({
        array: { values: [...arr], comparing: [], swapping: [], sorted: range(0, arr.length - 1), highlighted: [] },
        result: `[${arr.join(', ')}]`,
      });
    });
  },
};

function range(lo, hi) {
  const r = [];
  for (let i = lo; i <= hi; i++) r.push(i);
  return r;
}
