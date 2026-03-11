import { buildSteps } from '../core/buildSteps';
import { DSU } from '../core/dsu';

export default {
  id: 'accts',
  title: 'Accounts Merge',
  category: 'DSU',
  difficulty: 'Hard',
  description: 'Map emails to indices, union shared emails, group by root.',
  mnemonic: {
    steps: ['Map each email -> index', 'For each account: union first email with rest', 'Find all roots', 'Group emails by root -> sorted result'],
    detail: [
      'Create a unique integer ID for every distinct email address.',
      'Within each account, the first email is the "anchor". Union it with every other email in that account.',
      'After all unions, call find() to get the final root for each email.',
      'Collect emails sharing a root into one merged account. Sort emails alphabetically.',
    ],
  },
  pseudocode: [
    'emailToId = {}; id = 0',
    'for each account:',
    '  for each email: assign id',
    'dsu = new DSU(numEmails)',
    'for each account:',
    '  for i = 1..n:',
    '    union(email[0], email[i])',
    'group emails by find(emailId)',
    'return merged accounts',
  ],
  defaultInput: {
    accounts: [
      { name: 'John', emails: ['a@x', 'b@x'] },
      { name: 'John', emails: ['b@x', 'c@x'] },
      { name: 'Mary', emails: ['d@x'] },
      { name: 'John', emails: ['e@x'] },
    ],
  },
  layout: {
    panels: [
      { renderer: 'accounts', label: 'Accounts', area: 'main' },
      { renderer: 'dsu', label: 'Parent / Rank', area: 'bottom-left' },
    ],
  },
  build(input) {
    const { accounts } = input || this.defaultInput;
    return buildSteps(({ snap, addLog }) => {
      const em = {};
      let idx = 0;
      accounts.forEach(a => a.emails.forEach(e => { if (!(e in em)) em[e] = idx++; }));
      const d = new DSU(idx);

      addLog(`${idx} unique emails`);
      snap({
        accounts: { hlAcct: [], merged: null },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: [0, 1, 2, 3],
      });

      for (let ai = 0; ai < accounts.length; ai++) {
        const a = accounts[ai];
        for (let ei = 1; ei < a.emails.length; ei++) {
          const from = em[a.emails[0]], to = em[a.emails[ei]];
          addLog(`Acct ${ai}: union(${a.emails[0]}, ${a.emails[ei]})`, 'active');
          snap({
            accounts: { hlAcct: [ai], merged: null },
            dsu: { parent: [...d.p], rank: [...d.r], highlighted: [from, to] },
            codeLine: [4, 5, 6],
          });
          d.union(from, to);
        }
      }

      const groups = {};
      Object.entries(em).forEach(([email, i]) => {
        const r = d.find(i);
        (groups[r] || (groups[r] = { name: '', emails: [] })).emails.push(email);
      });
      accounts.forEach(a => a.emails.forEach(e => {
        const r = d.find(em[e]);
        if (groups[r]) groups[r].name = a.name;
      }));
      const merged = Object.values(groups).map(g => { g.emails.sort(); return g; });

      addLog(`${merged.length} merged accounts`);
      snap({
        accounts: { hlAcct: [], merged },
        dsu: { parent: [...d.p], rank: [...d.r], highlighted: [] },
        codeLine: [7, 8],
        result: `${merged.length} merged account(s)`,
      });
    });
  },
};
