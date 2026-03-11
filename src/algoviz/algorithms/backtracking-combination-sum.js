import { buildSteps } from '../core/buildSteps';

export default {
  id: 'combination-sum',
  title: 'Combination Sum',
  category: 'Recursion',
  difficulty: 'Medium',
  description: 'Find all unique combinations that sum to target. Each number can be used unlimited times. Classic backtracking.',
  mnemonic: {
    steps: ['Sort candidates', 'Include candidate, reduce target', 'If target == 0, found combo', 'Skip to next candidate (backtrack)'],
    detail: [
      'Sort to enable early termination when candidate > remaining target.',
      'Try including the current candidate again (unlimited use). Subtract from target.',
      'When remaining target is exactly 0, the current combination is valid.',
      'Pop the last candidate and move to the next one to explore other combos.',
    ],
  },
  pseudocode: [
    'combinationSum(candidates, target):',
    '  sort(candidates)',
    '  result = []',
    '  backtrack(0, target, [])',
    '  return result',
    '',
    'backtrack(start, remaining, combo):',
    '  if remaining == 0: add combo to result',
    '  for i in start..len(candidates)-1:',
    '    if candidates[i] > remaining: break',
    '    combo.push(candidates[i])',
    '    backtrack(i, remaining - candidates[i], combo)',
    '    combo.pop()  // backtrack',
  ],
  defaultInput: { candidates: [2, 3, 6, 7], target: 7 },
  layout: {
    panels: [
      { renderer: 'array', label: 'Current Combination', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { candidates: cands, target } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const sorted = [...cands].sort((a, b) => a - b);
      const result = [];
      const stack = [];
      const combo = [];

      const arrSnap = (hl = []) => ({
        values: combo.length > 0 ? [...combo] : [' '],
        comparing: [], swapping: [], sorted: [], highlighted: hl,
      });

      addLog(`Find combinations in [${sorted.join(', ')}] that sum to ${target}`);
      snap({
        array: arrSnap(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: [0, 1, 2, 3],
      });

      function backtrack(start, remaining) {
        if (remaining === 0) {
          result.push([...combo]);
          addLog(`Found: [${combo.join(', ')}] = ${target}`);
          snap({
            array: arrSnap(combo.map((_, i) => i)),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 7,
          });
          return;
        }

        for (let i = start; i < sorted.length; i++) {
          if (sorted[i] > remaining) {
            addLog(`${sorted[i]} > ${remaining} — prune`);
            snap({
              array: arrSnap(),
              queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
              codeLine: 9,
            });
            break;
          }

          combo.push(sorted[i]);
          stack.push(`bt(${i}, rem=${remaining - sorted[i]})`);

          addLog(`Add ${sorted[i]}, sum=${combo.reduce((a, b) => a + b, 0)}, need ${remaining - sorted[i]} more`, 'active');
          snap({
            array: arrSnap([combo.length - 1]),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [10, 11],
          });

          backtrack(i, remaining - sorted[i]);

          combo.pop();
          stack.pop();
          addLog(`Pop ${sorted[i]} (backtrack)`);
          snap({
            array: arrSnap(),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 12,
          });
        }
      }

      backtrack(0, target);

      addLog(`Done! ${result.length} combinations`);
      snap({
        array: { values: [result.length], comparing: [], swapping: [], sorted: [0], highlighted: [] },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `${result.length} combos: ${result.map(c => `[${c.join(',')}]`).join(' ')}`,
      });
    });
  },
};
