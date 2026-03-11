import { buildSteps } from '../core/buildSteps';

export default {
  id: 'generate-parens',
  title: 'Generate Parentheses',
  category: 'Recursion',
  difficulty: 'Medium',
  description: 'Generate all valid combinations of n pairs of parentheses. Classic backtracking with open/close counting.',
  mnemonic: {
    steps: ['Track open & close counts', 'Add "(" if open < n', 'Add ")" if close < open', 'When length = 2n, record result'],
    detail: [
      'Keep count of how many open and close parens used so far.',
      'Can add open paren anytime we have fewer than n opens.',
      'Can add close paren only if fewer closes than opens (ensures validity).',
      'When string reaches length 2n, we have a valid combination.',
    ],
  },
  pseudocode: [
    'generate(n):',
    '  result = []',
    '  backtrack("", 0, 0)',
    '  return result',
    '',
    'backtrack(s, open, close):',
    '  if len(s) == 2*n:',
    '    result.append(s)',
    '    return',
    '  if open < n:',
    '    backtrack(s+"(", open+1, close)',
    '  if close < open:',
    '    backtrack(s+")", open, close+1)',
  ],
  defaultInput: { n: 3 },
  layout: {
    panels: [
      { renderer: 'array', label: 'Building String', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { n } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const result = [];
      const stack = [];

      const arrSnap = (str, hl = []) => {
        const chars = str.split('');
        return {
          values: chars.length > 0 ? chars : [' '],
          comparing: [], swapping: [], sorted: [], highlighted: hl,
        };
      };

      addLog(`Generate all valid parentheses for n=${n}`);
      snap({
        array: arrSnap(''),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: [0, 1, 2],
      });

      function backtrack(s, open, close) {
        if (s.length === 2 * n) {
          result.push(s);
          addLog(`Valid: ${s}`);
          snap({
            array: arrSnap(s, s.split('').map((_, i) => i)),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [6, 7],
          });
          return;
        }

        if (open < n) {
          const next = s + '(';
          stack.push(`bt("${next}" o=${open + 1} c=${close})`);
          addLog(`Add "(" → "${next}" (open=${open + 1})`, 'active');
          snap({
            array: arrSnap(next, [next.length - 1]),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [9, 10],
          });
          backtrack(next, open + 1, close);
          stack.pop();
        }

        if (close < open) {
          const next = s + ')';
          stack.push(`bt("${next}" o=${open} c=${close + 1})`);
          addLog(`Add ")" → "${next}" (close=${close + 1})`, 'active');
          snap({
            array: arrSnap(next, [next.length - 1]),
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [11, 12],
          });
          backtrack(next, open, close + 1);
          stack.pop();
        }
      }

      backtrack('', 0, 0);

      addLog(`Done! ${result.length} valid combinations`);
      snap({
        array: { values: [result.length], comparing: [], swapping: [], sorted: [0], highlighted: [] },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `${result.length} combinations: ${result.join(', ')}`,
      });
    });
  },
};
