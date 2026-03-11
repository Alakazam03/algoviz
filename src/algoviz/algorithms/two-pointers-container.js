import { buildSteps } from '../core/buildSteps';

export default {
  id: 'container-water',
  title: 'Container With Most Water',
  category: 'Two Pointers',
  difficulty: 'Medium',
  description: 'Find two lines that together with the x-axis form a container holding the most water.',
  mnemonic: {
    steps: ['Start at widest', 'Compute area', 'Move shorter side', 'Track maximum'],
    detail: [
      'Use two pointers at both ends for maximum width.',
      'Area = min(height[left], height[right]) × (right - left).',
      'Moving the taller side inward can only decrease area — always move the shorter.',
      'Keep track of the maximum area seen so far.',
    ],
  },
  pseudocode: [
    'left = 0, right = n-1',
    'maxArea = 0',
    'while left < right:',
    '  w = right - left',
    '  h = min(height[left], height[right])',
    '  area = w * h',
    '  maxArea = max(maxArea, area)',
    '  if height[left] < height[right]:',
    '    left++',
    '  else: right--',
  ],
  defaultInput: {
    array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
  },
  layout: {
    panels: [
      { renderer: 'array', label: 'Heights', area: 'main' },
    ],
  },
  build(input) {
    const { array } = input || this.defaultInput;
    const n = array.length;

    return buildSteps(({ snap, addLog }) => {
      let left = 0, right = n - 1;
      let maxArea = 0;
      let bestL = 0, bestR = 0;

      addLog(`Container With Most Water, n=${n}`);
      snap({
        array: { values: array, comparing: [], swapping: [], sorted: [], highlighted: [left, right] },
        codeLine: [0, 1],
      });

      while (left < right) {
        const w = right - left;
        const h = Math.min(array[left], array[right]);
        const area = w * h;

        addLog(`L=${left}(h=${array[left]}), R=${right}(h=${array[right]}), area=${w}×${h}=${area}`, 'active');
        snap({
          array: { values: array, comparing: [left, right], swapping: [], sorted: [], highlighted: [] },
          codeLine: [2, 3, 4, 5],
        });

        if (area > maxArea) {
          maxArea = area;
          bestL = left;
          bestR = right;
          addLog(`New max area: ${maxArea}`);
        }

        snap({
          array: { values: array, comparing: [left, right], swapping: [], sorted: [], highlighted: [bestL, bestR] },
          codeLine: 6,
        });

        if (array[left] < array[right]) {
          addLog(`height[${left}]=${array[left]} < height[${right}]=${array[right]}, move left →`);
          left++;
          snap({
            array: { values: array, comparing: [], swapping: [], sorted: [], highlighted: [left, right] },
            codeLine: [7, 8],
          });
        } else {
          addLog(`height[${left}]=${array[left]} >= height[${right}]=${array[right]}, move right ←`);
          right--;
          snap({
            array: { values: array, comparing: [], swapping: [], sorted: [], highlighted: [left, right] },
            codeLine: 9,
          });
        }
      }

      addLog(`Max area: ${maxArea} between indices [${bestL}, ${bestR}]`);
      snap({
        array: { values: array, comparing: [], swapping: [], sorted: [], highlighted: [bestL, bestR] },
        result: `Max area = ${maxArea} (indices ${bestL},${bestR})`,
      });
    });
  },
};
