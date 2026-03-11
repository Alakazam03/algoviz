import { buildSteps } from '../core/buildSteps';

export default {
  id: 'longest-substr-no-repeat',
  title: 'Longest Substring Without Repeat',
  category: 'Sliding Window',
  difficulty: 'Medium',
  description: 'Find the length of the longest substring without repeating characters. Classic sliding window with a hash set.',
  mnemonic: {
    steps: ['Left & right pointers start at 0', 'Expand right, add to set', 'If duplicate, shrink left', 'Track max window size'],
    detail: [
      'Both pointers start at the beginning of the string.',
      'Move right pointer forward, adding each character to a set.',
      'When a duplicate is found, move left pointer right until the duplicate is removed.',
      'After each expansion, update the maximum length seen.',
    ],
  },
  pseudocode: [
    'lengthOfLongestSubstring(s):',
    '  set = {}, left = 0, maxLen = 0',
    '  for right in 0..len(s)-1:',
    '    while s[right] in set:',
    '      set.remove(s[left])',
    '      left++',
    '    set.add(s[right])',
    '    maxLen = max(maxLen, right - left + 1)',
    '  return maxLen',
  ],
  defaultInput: { s: 'abcabcbb' },
  layout: {
    panels: [
      { renderer: 'array', label: 'String', area: 'main' },
      { renderer: 'queueStack', label: 'Window Set', area: 'sidebar' },
    ],
  },
  build(input) {
    const { s } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const chars = s.split('');
      const charSet = new Set();
      let left = 0;
      let maxLen = 0;
      let bestL = 0, bestR = 0;

      const arrSnap = (l, r, hl = []) => ({
        values: chars,
        comparing: [r],
        swapping: [],
        sorted: Array.from({ length: r - l + 1 }, (_, i) => l + i), // window
        highlighted: hl,
      });

      addLog(`Find longest substring without repeats in "${s}"`);
      snap({
        array: { values: chars, comparing: [], swapping: [], sorted: [], highlighted: [] },
        queueStack: { items: [], type: 'queue', label: 'Window Characters' },
        codeLine: [0, 1],
      });

      for (let right = 0; right < chars.length; right++) {
        addLog(`Expand right → '${chars[right]}' at index ${right}`, 'active');
        snap({
          array: arrSnap(left, right),
          queueStack: { items: [...charSet].map(String), type: 'queue', label: 'Window Characters' },
          codeLine: [2, 3],
        });

        while (charSet.has(chars[right])) {
          addLog(`Duplicate '${chars[right]}'! Remove '${chars[left]}', left++`);
          charSet.delete(chars[left]);
          snap({
            array: arrSnap(left, right, [left]),
            queueStack: { items: [...charSet].map(String), type: 'queue', label: 'Window Characters' },
            codeLine: [4, 5],
          });
          left++;
        }

        charSet.add(chars[right]);
        const windowLen = right - left + 1;
        if (windowLen > maxLen) {
          maxLen = windowLen;
          bestL = left;
          bestR = right;
        }

        addLog(`Window [${left}..${right}] = "${s.substring(left, right + 1)}", maxLen=${maxLen}`);
        snap({
          array: arrSnap(left, right),
          queueStack: { items: [...charSet].map(String), type: 'queue', label: 'Window Characters' },
          codeLine: [6, 7],
        });
      }

      addLog(`Longest = ${maxLen}: "${s.substring(bestL, bestR + 1)}"`);
      snap({
        array: {
          values: chars, comparing: [],
          swapping: [],
          sorted: Array.from({ length: bestR - bestL + 1 }, (_, i) => bestL + i),
          highlighted: [],
        },
        queueStack: { items: [...s.substring(bestL, bestR + 1)], type: 'queue', label: 'Best Window' },
        result: `Longest = ${maxLen} ("${s.substring(bestL, bestR + 1)}")`,
      });
    });
  },
};
