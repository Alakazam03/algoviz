import { buildSteps } from '../core/buildSteps';

export default {
  id: 'hanoi',
  title: 'Tower of Hanoi',
  category: 'Recursion',
  difficulty: 'Medium',
  description: 'Move n disks from source to target peg using an auxiliary peg. Classic recursion problem.',
  mnemonic: {
    steps: ['Move n-1 disks to aux', 'Move largest to target', 'Move n-1 from aux to target'],
    detail: [
      'Recursively move top n-1 disks from source to auxiliary peg.',
      'Move the largest remaining disk directly to target.',
      'Recursively move the n-1 disks from auxiliary to target.',
    ],
  },
  pseudocode: [
    'hanoi(n, source, target, aux):',
    '  if n == 0: return',
    '  hanoi(n-1, source, aux, target)',
    '  move disk n: source → target',
    '  hanoi(n-1, aux, target, source)',
  ],
  defaultInput: { n: 3 },
  layout: {
    panels: [
      { renderer: 'array', label: 'Pegs', area: 'main' },
      { renderer: 'queueStack', label: 'Call Stack', area: 'sidebar' },
    ],
  },
  build(input) {
    const { n } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      // pegs: A=0, B=1, C=2
      const pegs = [[], [], []];
      for (let i = n; i >= 1; i--) pegs[0].push(i);
      const pegNames = ['A', 'B', 'C'];
      const callStack = [];
      let moveCount = 0;

      const pegToArr = () => {
        const maxH = Math.max(n, 4);
        const values = [];
        const highlighted = [];

        for (let p = 0; p < 3; p++) {
          for (let i = 0; i < maxH; i++) {
            values.push(i < pegs[p].length ? pegs[p][i] : 0);
          }
        }
        return {
          values,
          comparing: [],
          swapping: [],
          sorted: [],
          highlighted,
        };
      };

      addLog(`Tower of Hanoi: ${n} disks, A → C`);
      snap({
        array: pegToArr(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        codeLine: null,
      });

      function hanoi(k, from, to, aux) {
        if (k === 0) return;

        callStack.push(`hanoi(${k}, ${pegNames[from]}→${pegNames[to]})`);

        addLog(`hanoi(${k}, ${pegNames[from]}, ${pegNames[to]}, ${pegNames[aux]})`, 'active');
        snap({
          array: pegToArr(),
          queueStack: { items: [...callStack], type: 'stack', label: 'Call Stack' },
          codeLine: [0, 1],
        });

        hanoi(k - 1, from, aux, to);

        // Move disk k from 'from' to 'to'
        const disk = pegs[from].pop();
        pegs[to].push(disk);
        moveCount++;

        addLog(`Move disk ${disk}: ${pegNames[from]} → ${pegNames[to]} (move #${moveCount})`);
        snap({
          array: pegToArr(),
          queueStack: { items: [...callStack], type: 'stack', label: 'Call Stack' },
          codeLine: 3,
        });

        hanoi(k - 1, aux, to, from);

        callStack.pop();
      }

      hanoi(n, 0, 2, 1);

      addLog(`Done! ${moveCount} moves (minimum = ${Math.pow(2, n) - 1})`);
      snap({
        array: pegToArr(),
        queueStack: { items: [], type: 'stack', label: 'Call Stack' },
        result: `${moveCount} moves`,
      });
    });
  },
};
