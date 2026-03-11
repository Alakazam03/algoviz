import { getAllAlgorithms } from '../core/registry';
import { STANDALONE_MNEMONICS } from './standaloneMnemonics';

export function getAllMnemonics() {
  // 1. Derive from registered algorithms
  const fromAlgos = getAllAlgorithms()
    .filter(a => a.mnemonic)
    .map(a => ({
      id: a.id,
      name: a.title,
      cat: a.category,
      diff: a.difficulty,
      steps: a.mnemonic.steps,
      detail: a.mnemonic.detail,
      code: a.pseudocode ? a.pseudocode.join('\n') : '',
      hasVisualization: true,
    }));

  // 2. Standalone mnemonics (no interactive viz)
  const standalone = STANDALONE_MNEMONICS.map(m => ({
    ...m,
    hasVisualization: false,
  }));

  // 3. Merge, dedup (algorithm version wins)
  const algoIds = new Set(fromAlgos.map(m => m.id));
  return [
    ...fromAlgos,
    ...standalone.filter(m => !algoIds.has(m.id)),
  ];
}
