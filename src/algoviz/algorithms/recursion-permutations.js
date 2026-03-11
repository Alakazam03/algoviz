import { buildSteps } from '../core/buildSteps';

export default {
  id: 'permutations',
  title: 'Permutations',
  category: 'Recursion',
  difficulty: 'Medium',
  description: 'Generate all permutations of an array. Swap each unused element into the current position, recurse, then swap back.',
  mnemonic: {
    steps: ['Fix elements left to right', 'Swap current with each remaining', 'Recurse on next position', 'Swap back (backtrack)'],
    detail: [
      'Build the permutation one position at a time from index 0.',
      'At position i, try every element from i..n-1 by swapping it into position i.',
      'After fixing position i, recurse to fill positions i+1..n-1.',
      'After returning, undo the swap so the next candidate can be tried.',
    ],
  },
  pseudocode: [
    'permute(nums):',
    '  result = []',
    '  backtrack(0)',
    '  return result',
    '',
    'backtrack(start):',
    '  if start == len(nums):',
    '    result.append(copy(nums))',
    '    return',
    '  for i in start..len(nums)-1:',
    '    swap(nums[start], nums[i])',
    '    backtrack(start + 1)',
    '    swap(nums[start], nums[i])  // undo',
  ],
  defaultInput: { nums: [1, 2, 3] },
  layout: {
    panels: [
      { renderer: 'array', label: 'Array State', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nums: orig } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const nums = [...orig];
      const result = [];
      const stack = [];

      const arrSnap = (cmp = [], swp = [], srt = []) => ({
        values: [...nums], comparing: cmp, swapping: swp, sorted: srt, highlighted: [],
      });

      addLog(`Generate all permutations of [${nums.join(', ')}]`);
      snap({
        array: arrSnap(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: [0, 1, 2],
      });

      function backtrack(start) {
        if (start === nums.length) {
          result.push([...nums]);
          addLog(`Found permutation: [${nums.join(', ')}]`);
          snap({
            array: arrSnap([], [], nums.map((_, i) => i)),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [6, 7],
          });
          return;
        }

        for (let i = start; i < nums.length; i++) {
          stack.push(`bt(${start}) swap [${start}]↔[${i}]`);

          // Swap
          [nums[start], nums[i]] = [nums[i], nums[start]];
          addLog(`Swap pos ${start} ↔ ${i}: [${nums.join(', ')}]`, i === start ? 'done' : 'active');
          snap({
            array: arrSnap([start, i], i !== start ? [start, i] : []),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [9, 10],
          });

          backtrack(start + 1);

          // Undo swap
          [nums[start], nums[i]] = [nums[i], nums[start]];
          if (i !== start) {
            addLog(`Undo swap pos ${start} ↔ ${i}`);
            snap({
              array: arrSnap([start, i]),
              queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
              codeLine: 12,
            });
          }
          stack.pop();
        }
      }

      backtrack(0);

      addLog(`Done! ${result.length} permutations`);
      snap({
        array: arrSnap([], [], nums.map((_, i) => i)),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `${result.length} permutations found`,
      });
    });
  },
};
