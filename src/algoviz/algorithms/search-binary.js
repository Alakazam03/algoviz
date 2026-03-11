import { buildSteps } from '../core/buildSteps';

export default {
  id: 'bsearch',
  title: 'Binary Search',
  category: 'Search',
  difficulty: 'Easy',
  description: 'Search a sorted array by repeatedly halving the search space. O(log n).',
  mnemonic: {
    steps: ['Set lo=0, hi=n-1', 'Compute mid', 'Compare target with arr[mid]', 'Shrink half'],
    detail: [
      'Span entire sorted array.',
      'mid = lo + (hi - lo) / 2.',
      'Equal = found. Less = go left. More = go right.',
      'lo = mid + 1 or hi = mid - 1.',
    ],
  },
  pseudocode: [
    'lo = 0, hi = n - 1',
    'while lo <= hi:',
    '  mid = lo + (hi - lo) / 2',
    '  if arr[mid] == target:',
    '    return mid  // FOUND',
    '  elif arr[mid] < target:',
    '    lo = mid + 1',
    '  else:',
    '    hi = mid - 1',
    'return -1  // NOT FOUND',
  ],
  defaultInput: {
    array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    target: 13,
  },
  layout: {
    panels: [
      { renderer: 'searchArray', label: 'Sorted Array', area: 'main' },
    ],
  },
  build(input) {
    const { array, target } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      let lo = 0, hi = array.length - 1;
      const eliminated = [];

      addLog(`Search for ${target} in [${array.join(', ')}]`);
      snap({
        searchArray: { values: array, lo, hi, mid: -1, target, found: null, eliminated: [] },
        codeLine: 0,
      });

      while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        addLog(`lo=${lo}, hi=${hi}, mid=${mid}, arr[mid]=${array[mid]}`, 'active');
        snap({
          searchArray: { values: array, lo, hi, mid, target, found: null, eliminated: [...eliminated] },
          codeLine: [1, 2],
        });

        if (array[mid] === target) {
          addLog(`FOUND at index ${mid}!`);
          snap({
            searchArray: { values: array, lo, hi, mid, target, found: mid, eliminated: [...eliminated] },
            codeLine: [3, 4],
            result: `Found at index ${mid}`,
          });
          return;
        }

        if (array[mid] < target) {
          addLog(`${array[mid]} < ${target}: search right`);
          for (let k = lo; k <= mid; k++) eliminated.push(k);
          lo = mid + 1;
          snap({
            searchArray: { values: array, lo, hi, mid: -1, target, found: null, eliminated: [...eliminated] },
            codeLine: [5, 6],
          });
        } else {
          addLog(`${array[mid]} > ${target}: search left`);
          for (let k = mid; k <= hi; k++) eliminated.push(k);
          hi = mid - 1;
          snap({
            searchArray: { values: array, lo, hi, mid: -1, target, found: null, eliminated: [...eliminated] },
            codeLine: [7, 8],
          });
        }
      }

      addLog(`${target} not found`);
      snap({
        searchArray: { values: array, lo, hi, mid: -1, target, found: null, eliminated: [...eliminated] },
        codeLine: 9,
        result: 'Not found',
      });
    });
  },
};
