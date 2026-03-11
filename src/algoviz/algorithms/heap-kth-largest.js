import { buildSteps } from '../core/buildSteps';

export default {
  id: 'kth-largest',
  title: 'Kth Largest Element',
  category: 'Heap',
  difficulty: 'Medium',
  description: 'Find the kth largest element using a min-heap of size k. As you scan the array, the heap always holds the k largest seen so far.',
  mnemonic: {
    steps: ['Build min-heap of size k', 'For each element, compare with heap top', 'If larger, replace top and heapify', 'Heap top = kth largest'],
    detail: [
      'Insert the first k elements into a min-heap.',
      'For remaining elements, compare each against the smallest in the heap (the root).',
      'If the new element is larger than the root, pop the root and push the new element.',
      'After processing all elements, the root of the min-heap is the kth largest.',
    ],
  },
  pseudocode: [
    'findKthLargest(nums, k):',
    '  heap = MinHeap()',
    '  for num in nums:',
    '    heap.push(num)',
    '    if heap.size > k:',
    '      heap.pop()  // remove smallest',
    '  return heap.peek()  // kth largest',
  ],
  defaultInput: { nums: [3, 2, 1, 5, 6, 4], k: 2 },
  layout: {
    panels: [
      { renderer: 'array', label: 'Array & Heap', area: 'main' },
      { renderer: 'queueStack', label: 'Min-Heap', area: 'sidebar' },
    ],
  },
  build(input) {
    const { nums, k } = input || this.defaultInput;

    return buildSteps(({ snap, addLog }) => {
      // Simple min-heap
      const heap = [];

      function heapPush(val) {
        heap.push(val);
        let i = heap.length - 1;
        while (i > 0) {
          const parent = Math.floor((i - 1) / 2);
          if (heap[parent] <= heap[i]) break;
          [heap[parent], heap[i]] = [heap[i], heap[parent]];
          i = parent;
        }
      }

      function heapPop() {
        const val = heap[0];
        const last = heap.pop();
        if (heap.length > 0) {
          heap[0] = last;
          let i = 0;
          while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < heap.length && heap[l] < heap[smallest]) smallest = l;
            if (r < heap.length && heap[r] < heap[smallest]) smallest = r;
            if (smallest === i) break;
            [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
            i = smallest;
          }
        }
        return val;
      }

      const arrSnap = (scanIdx = -1) => ({
        values: [...nums],
        comparing: scanIdx >= 0 ? [scanIdx] : [],
        swapping: [], sorted: [], highlighted: [],
      });

      addLog(`Find ${k}th largest in [${nums.join(', ')}]`);
      snap({
        array: arrSnap(),
        queueStack: { items: [], type: 'queue', label: 'Min-Heap (size ≤ k)' },
        codeLine: [0, 1],
      });

      for (let i = 0; i < nums.length; i++) {
        heapPush(nums[i]);

        addLog(`Push ${nums[i]} → heap = [${[...heap].sort((a, b) => a - b).join(', ')}]`, 'active');
        snap({
          array: arrSnap(i),
          queueStack: { items: [...heap].sort((a, b) => a - b).map(String), type: 'queue', label: 'Min-Heap (size ≤ k)' },
          codeLine: [2, 3],
        });

        if (heap.length > k) {
          const removed = heapPop();
          addLog(`Heap size ${heap.length + 1} > k=${k}, pop min=${removed}`);
          snap({
            array: arrSnap(i),
            queueStack: { items: [...heap].sort((a, b) => a - b).map(String), type: 'queue', label: 'Min-Heap (size ≤ k)' },
            codeLine: [4, 5],
          });
        }
      }

      const result = heap[0];
      addLog(`Heap top = ${result} = ${k}th largest`);
      snap({
        array: arrSnap(),
        queueStack: { items: [...heap].sort((a, b) => a - b).map(String), type: 'queue', label: 'Min-Heap (size ≤ k)' },
        codeLine: 6,
        result: `${k}th largest = ${result}`,
      });
    });
  },
};
