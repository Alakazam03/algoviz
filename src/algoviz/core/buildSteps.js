export function buildSteps(fn) {
  const steps = [];
  const log = [];
  const snap = (s = {}) => steps.push({ log: log.map(l => ({ ...l })), ...s });
  const addLog = (msg, status = 'done') => log.push({ msg, status });
  fn({ snap, addLog });
  return steps;
}
