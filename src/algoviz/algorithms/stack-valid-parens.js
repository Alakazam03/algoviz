import { buildSteps } from '../core/buildSteps';

export default {
  id: 'valid-parens',
  title: 'Valid Parentheses',
  category: 'Stack',
  difficulty: 'Easy',
  description: 'Check if a string of brackets is valid using a stack. Classic stack problem.',
  mnemonic: {
    steps: ['Open bracket → push', 'Close bracket → pop', 'Check match', 'Stack empty at end?'],
    detail: [
      'When you see (, [, or {, push it onto the stack.',
      'When you see ), ], or }, pop the top of the stack.',
      'If the popped bracket doesn\'t match, invalid.',
      'After processing all characters, the stack must be empty.',
    ],
  },
  pseudocode: [
    'for each char c in string:',
    '  if c is opening bracket:',
    '    stack.push(c)',
    '  else:',
    '    if stack is empty: return false',
    '    top = stack.pop()',
    '    if top does not match c: return false',
    'return stack is empty',
  ],
  defaultInput: {
    string: '({[()]})',
  },
  layout: {
    panels: [
      { renderer: 'searchArray', label: 'Input String', area: 'main' },
      { renderer: 'queueStack', label: 'Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { string: s } = input || this.defaultInput;
    const chars = s.split('');
    const match = { ')': '(', ']': '[', '}': '{' };
    const opens = new Set(['(', '[', '{']);

    return buildSteps(({ snap, addLog }) => {
      const stack = [];
      let valid = true;

      addLog(`Validate: "${s}"`);
      snap({
        searchArray: {
          values: chars,
          lo: -1, hi: -1, mid: -1,
          labels: {},
          eliminated: [],
        },
        queueStack: { items: [], type: 'stack', label: 'Stack' },
        codeLine: null,
      });

      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        const processed = Array.from({ length: i }, (_, j) => j);

        if (opens.has(c)) {
          stack.push(c);
          addLog(`'${c}' → push onto stack`, 'active');
          snap({
            searchArray: {
              values: chars,
              lo: -1, hi: -1, mid: i,
              labels: { [i]: '▼' },
              eliminated: processed,
            },
            queueStack: { items: [...stack], type: 'stack', label: 'Stack' },
            codeLine: [0, 1, 2],
          });
        } else {
          if (stack.length === 0) {
            addLog(`'${c}' but stack empty → INVALID!`);
            valid = false;
            snap({
              searchArray: {
                values: chars,
                lo: -1, hi: -1, mid: i,
                labels: { [i]: '✗' },
                eliminated: processed,
              },
              queueStack: { items: [], type: 'stack', label: 'Stack' },
              codeLine: [3, 4],
            });
            break;
          }

          const top = stack.pop();
          if (top !== match[c]) {
            addLog(`'${c}' ≠ match for '${top}' → INVALID!`);
            valid = false;
            snap({
              searchArray: {
                values: chars,
                lo: -1, hi: -1, mid: i,
                labels: { [i]: '✗' },
                eliminated: processed,
              },
              queueStack: { items: [...stack], type: 'stack', label: 'Stack' },
              codeLine: [5, 6],
            });
            break;
          }

          addLog(`'${c}' matches '${top}' → pop ✓`);
          snap({
            searchArray: {
              values: chars,
              lo: -1, hi: -1, mid: i,
              labels: { [i]: '✓' },
              eliminated: processed,
            },
            queueStack: { items: [...stack], type: 'stack', label: 'Stack' },
            codeLine: [3, 5, 6],
          });
        }
      }

      if (valid && stack.length > 0) {
        valid = false;
        addLog('Stack not empty → INVALID');
      }

      addLog(valid ? 'Valid! ✓' : 'Invalid! ✗');
      snap({
        searchArray: {
          values: chars,
          lo: -1, hi: -1, mid: -1,
          labels: {},
          eliminated: [],
        },
        queueStack: { items: [...stack], type: 'stack', label: 'Stack' },
        codeLine: 7,
        result: valid ? 'Valid ✓' : 'Invalid ✗',
      });
    });
  },
};
