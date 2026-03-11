import { buildSteps } from '../core/buildSteps';

export default {
  id: 'detect-cycle-ll',
  title: 'Detect Cycle (Floyd\'s)',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Floyd\'s Tortoise and Hare algorithm — slow moves 1 step, fast moves 2 steps. If they meet, cycle exists.',
  mnemonic: {
    steps: ['Slow = head, Fast = head', 'Move slow 1 step', 'Move fast 2 steps', 'If they meet → cycle!'],
    detail: [
      'Both pointers start at head.',
      'Slow pointer advances one node at a time.',
      'Fast pointer advances two nodes at a time.',
      'If fast catches slow, there is a cycle. If fast reaches null, no cycle.',
    ],
  },
  pseudocode: [
    'slow = head, fast = head',
    'while fast and fast.next:',
    '  slow = slow.next',
    '  fast = fast.next.next',
    '  if slow == fast:',
    '    return true  // cycle!',
    'return false  // no cycle',
  ],
  defaultInput: {
    values: [3, 2, 0, -4, 7],
    cycleAt: 1, // last node points back to index 1
  },
  layout: {
    panels: [
      { renderer: 'linkedList', label: 'Linked List', area: 'main' },
    ],
  },
  build(input) {
    const { values, cycleAt } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const nodes = values.map((v, i) => ({ value: v, id: i }));

      addLog(`Detect cycle using Floyd's algorithm`);
      addLog(cycleAt >= 0 ? `(Last node → node ${cycleAt})` : '(No cycle)');
      snap({
        linkedList: {
          nodes, pointers: { head: 0 },
          highlighted: [], reversed: [], cycleAt,
        },
        codeLine: null,
      });

      let slow = 0, fast = 0;
      addLog('slow = head, fast = head');
      snap({
        linkedList: {
          nodes, pointers: { slow, fast },
          highlighted: [0], reversed: [], cycleAt,
        },
        codeLine: 0,
      });

      let step = 0;
      const maxSteps = values.length * 3; // prevent infinite in visualization

      while (step < maxSteps) {
        // Move slow 1 step
        const slowNext = slow + 1 < values.length ? slow + 1 : (cycleAt >= 0 ? cycleAt : -1);
        // Move fast 2 steps
        let fastNext = fast + 1 < values.length ? fast + 1 : (cycleAt >= 0 ? cycleAt : -1);
        if (fastNext < 0) break;
        fastNext = fastNext + 1 < values.length ? fastNext + 1 : (cycleAt >= 0 ? cycleAt : -1);

        if (slowNext < 0 || fastNext < 0) break;

        slow = slowNext;
        fast = fastNext;
        step++;

        addLog(`Step ${step}: slow→${values[slow]}, fast→${values[fast]}`, 'active');
        snap({
          linkedList: {
            nodes, pointers: { slow, fast },
            highlighted: [slow, fast], reversed: [], cycleAt,
          },
          codeLine: [1, 2, 3],
        });

        if (slow === fast) {
          addLog(`slow == fast at node ${values[slow]} → CYCLE DETECTED!`);
          snap({
            linkedList: {
              nodes, pointers: { slow, fast },
              highlighted: [slow], reversed: [], cycleAt,
            },
            codeLine: [4, 5],
            result: `Cycle detected at node ${values[slow]}`,
          });
          return;
        }
      }

      addLog('Fast reached end → No cycle');
      snap({
        linkedList: {
          nodes, pointers: {},
          highlighted: [], reversed: [], cycleAt: -1,
        },
        codeLine: 6,
        result: 'No cycle',
      });
    });
  },
};
