import { buildSteps } from '../core/buildSteps';

export default {
  id: 'fib-dp',
  title: 'Fibonacci (Memoized)',
  category: 'DP',
  difficulty: 'Easy',
  description: 'Compute Fibonacci numbers using memoization. Shows overlapping subproblems and how memo avoids recomputation.',
  mnemonic: {
    steps: ['Base: fib(0)=0, fib(1)=1', 'Recurse: fib(n) = fib(n-1) + fib(n-2)', 'Memo: store results', 'Return memo[n]'],
    detail: [
      'The simplest cases: 0th Fibonacci is 0, 1st is 1.',
      'Each Fibonacci number is sum of previous two.',
      'Store computed values to avoid exponential recomputation.',
      'Subsequent calls return cached value in O(1).',
    ],
  },
  pseudocode: [
    'memo = {}',
    'fib(n):',
    '  if n <= 1: return n',
    '  if n in memo: return memo[n]',
    '  memo[n] = fib(n-1) + fib(n-2)',
    '  return memo[n]',
  ],
  defaultInput: { n: 8 },
  layout: {
    panels: [
      { renderer: 'dpTable', label: 'Fibonacci Table', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { n } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const memo = new Array(n + 1).fill(null);
      const computed = [];
      const stack = [];

      addLog(`Compute Fibonacci(${n}) with memoization`);
      snap({
        dpTable: {
          values: [...memo], highlighted: [], computed: [],
          labels: Array.from({ length: n + 1 }, (_, i) => `fib(${i})`),
          title: 'Fibonacci values',
        },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: 0,
      });

      function fib(k) {
        stack.push(`fib(${k})`);

        if (k <= 1) {
          memo[k] = k;
          computed.push(k);
          addLog(`fib(${k}) = ${k} (base case)`);
          snap({
            dpTable: {
              values: [...memo], highlighted: [k], computed: [...computed],
              labels: Array.from({ length: n + 1 }, (_, i) => `fib(${i})`),
              title: 'Fibonacci values',
            },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: [1, 2],
          });
          stack.pop();
          return k;
        }

        if (memo[k] != null) {
          addLog(`fib(${k}) = ${memo[k]} (cached)`);
          snap({
            dpTable: {
              values: [...memo], highlighted: [k], computed: [...computed],
              labels: Array.from({ length: n + 1 }, (_, i) => `fib(${i})`),
              title: 'Fibonacci values',
            },
            queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
            codeLine: 3,
          });
          stack.pop();
          return memo[k];
        }

        addLog(`Computing fib(${k})...`, 'active');
        snap({
          dpTable: {
            values: [...memo], highlighted: [k], computed: [...computed],
            labels: Array.from({ length: n + 1 }, (_, i) => `fib(${i})`),
            title: 'Fibonacci values',
          },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [1, 4],
        });

        const a = fib(k - 1);
        const b = fib(k - 2);
        memo[k] = a + b;
        computed.push(k);

        addLog(`fib(${k}) = fib(${k - 1})(${a}) + fib(${k - 2})(${b}) = ${memo[k]}`);
        snap({
          dpTable: {
            values: [...memo], highlighted: [k], computed: [...computed],
            labels: Array.from({ length: n + 1 }, (_, i) => `fib(${i})`),
            arrows: [`fib(${k}) = ${a} + ${b}`],
            title: 'Fibonacci values',
          },
          queueStack: { items: [...stack], type: 'stack', label: 'Call Stack' },
          codeLine: [4, 5],
        });

        stack.pop();
        return memo[k];
      }

      const result = fib(n);

      addLog(`Fibonacci(${n}) = ${result}`);
      snap({
        dpTable: {
          values: [...memo], highlighted: [n], computed: [...computed],
          labels: Array.from({ length: n + 1 }, (_, i) => `fib(${i})`),
          title: 'Fibonacci values',
        },
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `Fibonacci(${n}) = ${result}`,
      });
    });
  },
};
