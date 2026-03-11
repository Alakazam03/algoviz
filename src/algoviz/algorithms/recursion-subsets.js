import { buildSteps } from '../core/buildSteps';

export default {
  id: 'subsets',
  title: 'Subsets (Power Set)',
  category: 'Recursion',
  difficulty: 'Medium',
  description: 'Generate all subsets of a set. Classic backtracking/recursion pattern — include or exclude each element.',
  mnemonic: {
    steps: ['Start with empty subset', 'For each element: include or skip', 'When index = n, record subset', 'Backtrack and try other branch'],
    detail: [
      'Begin building subsets from an empty list.',
      'At each position, branch into two choices: take the element or skip it.',
      'When you have processed all elements, add the current subset to results.',
      'After exploring "include", undo (pop) and explore "skip".',
    ],
  },
  pseudocode: [
    'subsets(nums):',
    '  result = []',
    '  backtrack(0, [])',
    '  return result',
    '',
    'backtrack(i, current):',
    '  if i == len(nums):',
    '    result.append(copy(current))',
    '    return',
    '  current.push(nums[i])  // include',
    '  backtrack(i+1, current)',
    '  current.pop()          // exclude',
    '  backtrack(i+1, current)',
  ],
  defaultInput: { nums: [1, 2, 3] },
  layout: {
    panels: [
      { renderer: 'array', label: 'Current Subset', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nums } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const result = [];
      const stack = [];
      const current = [];

      const arrSnap = (hl = []) => ({
        values: current.length > 0 ? [...current] : [' '],
        comparing: [], swapping: [], sorted: [], highlighted: hl,
      });

      addLog(`Generate all subsets of [${nums.join(', ')}]`);
      snap({
        array: arrSnap(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: [0, 1, 2],
      });

      function backtrack(i) {
        if (i === nums.length) {
          result.push([...current]);
          addLog(`Found subset: [${current.join(', ')}]`);
          snap({
            array: arrSnap(current.map((_, idx) => idx)),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [6, 7],
          });
          return;
        }

        stack.push(`bt(${i}) incl ${nums[i]}`);

        // Include nums[i]
        current.push(nums[i]);
        addLog(`Include ${nums[i]}`, 'active');
        snap({
          array: arrSnap([current.length - 1]),
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [9, 10],
        });
        backtrack(i + 1);

        // Exclude nums[i]
        current.pop();
        stack.pop();
        stack.push(`bt(${i}) skip ${nums[i]}`);
        addLog(`Exclude ${nums[i]} (backtrack)`);
        snap({
          array: arrSnap(),
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [11, 12],
        });
        backtrack(i + 1);

        stack.pop();
      }

      backtrack(0);

      addLog(`Done! ${result.length} subsets found`);
      snap({
        array: { values: [result.length], comparing: [], swapping: [], sorted: [0], highlighted: [] },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `${result.length} subsets: ${result.map(s => `[${s.join(',')}]`).join(' ')}`,
      });
    });
  },
};
