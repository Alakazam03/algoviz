import { buildSteps } from '../core/buildSteps';

export default {
  id: 'reverse-ll',
  title: 'Reverse Linked List',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Reverse a singly linked list by re-pointing each node\'s next pointer. Classic pointer manipulation.',
  mnemonic: {
    steps: ['prev = null, curr = head', 'Save next = curr.next', 'Point curr.next = prev', 'Advance prev, curr'],
    detail: [
      'Start with prev as null and curr as the head.',
      'Before changing pointer, save the next node.',
      'Reverse the link: make current point to previous.',
      'Move prev to curr, curr to next. Repeat.',
    ],
  },
  pseudocode: [
    'prev = null',
    'curr = head',
    'while curr is not null:',
    '  next = curr.next',
    '  curr.next = prev  // reverse!',
    '  prev = curr',
    '  curr = next',
    'return prev  // new head',
  ],
  defaultInput: {
    values: [1, 2, 3, 4, 5],
  },
  layout: {
    panels: [
      { renderer: 'linkedList', label: 'Linked List', area: 'main' },
    ],
  },
  build(input) {
    const { values } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      const nodes = values.map((v, i) => ({ value: v, id: i }));
      const reversed = [];

      addLog('Reverse linked list');
      snap({
        linkedList: { nodes, pointers: { head: 0 }, highlighted: [], reversed: [] },
        codeLine: null,
      });

      let prev = -1;
      let curr = 0;

      addLog('prev = null, curr = head');
      snap({
        linkedList: {
          nodes, pointers: { prev, curr },
          highlighted: [curr], reversed: [],
        },
        codeLine: [0, 1],
      });

      while (curr >= 0 && curr < values.length) {
        const next = curr + 1 < values.length ? curr + 1 : -1;

        addLog(`Save next = ${next >= 0 ? values[next] : 'null'}`, 'active');
        snap({
          linkedList: {
            nodes,
            pointers: { prev, curr, next: next >= 0 ? next : undefined },
            highlighted: [curr], reversed: [...reversed],
          },
          codeLine: [2, 3],
        });

        // Reverse the link
        reversed.push(curr);
        addLog(`Reverse: ${values[curr]}.next → ${prev >= 0 ? values[prev] : 'null'}`);
        snap({
          linkedList: {
            nodes,
            pointers: { prev, curr },
            highlighted: [curr], reversed: [...reversed],
          },
          codeLine: 4,
        });

        // Advance
        prev = curr;
        curr = next;
        addLog(`Advance: prev=${values[prev]}, curr=${curr >= 0 ? values[curr] : 'null'}`);
        snap({
          linkedList: {
            nodes,
            pointers: { prev, curr: curr >= 0 ? curr : undefined },
            highlighted: curr >= 0 ? [curr] : [], reversed: [...reversed],
          },
          codeLine: [5, 6],
        });
      }

      addLog(`Done! New head = ${values[prev]}`);
      snap({
        linkedList: {
          nodes,
          pointers: { head: prev },
          highlighted: [], reversed: [...reversed],
        },
        codeLine: 7,
        result: `Reversed: [${[...values].reverse().join(' → ')}]`,
      });
    });
  },
};
