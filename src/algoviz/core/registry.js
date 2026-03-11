const algorithms = [];

export function registerAlgorithm(algo) {
  if (!algorithms.find(a => a.id === algo.id)) {
    algorithms.push(algo);
  }
}

export function registerAlgorithms(algos) {
  algos.forEach(registerAlgorithm);
}

export function getAllAlgorithms() {
  return algorithms;
}

export function getAlgorithmById(id) {
  return algorithms.find(a => a.id === id);
}

export function getCategories() {
  return ['All', ...new Set(algorithms.map(a => a.category))];
}

export function getDifficulties() {
  return ['All', ...new Set(algorithms.map(a => a.difficulty))];
}
