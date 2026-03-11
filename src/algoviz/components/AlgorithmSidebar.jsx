import { DC, CC } from '../theme';

export default function AlgorithmSidebar({
  algorithms,
  filteredAlgorithms,
  selectedIdx,
  onSelect,
  categoryFilter,
  onCategoryChange,
  difficultyFilter,
  onDifficultyChange,
  categories,
  difficulties,
}) {
  const displayList = filteredAlgorithms || algorithms;

  return (
    <div style={{
      width: 220, flexShrink: 0, borderRight: '1px solid #1a1a2e',
      overflowY: 'auto', padding: 10,
    }}>
      {/* Category filter */}
      {categories && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
          {categories.map(c => (
            <button key={c} onClick={() => onCategoryChange(c)} style={{
              padding: '3px 8px', borderRadius: 5, fontSize: 9, fontFamily: 'monospace', cursor: 'pointer',
              border: `1px solid ${categoryFilter === c ? (CC[c] || '#6ee7b7') + '44' : '#1a1a2e'}`,
              background: categoryFilter === c ? (CC[c] || '#6ee7b7') + '0e' : 'transparent',
              color: categoryFilter === c ? (CC[c] || '#6ee7b7') : '#475569', transition: 'all 0.15s',
            }}>{c}</button>
          ))}
        </div>
      )}

      {/* Difficulty filter */}
      {difficulties && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
          {difficulties.map(d => (
            <button key={d} onClick={() => onDifficultyChange(d)} style={{
              padding: '3px 8px', borderRadius: 5, fontSize: 9, fontFamily: 'monospace', cursor: 'pointer',
              border: `1px solid ${difficultyFilter === d ? (DC[d] || '#6ee7b7') + '44' : '#1a1a2e'}`,
              background: difficultyFilter === d ? (DC[d] || '#6ee7b7') + '0e' : 'transparent',
              color: difficultyFilter === d ? (DC[d] || '#6ee7b7') : '#475569', transition: 'all 0.15s',
            }}>{d}</button>
          ))}
        </div>
      )}

      {/* Algorithm list */}
      {displayList.map(a => {
        const globalIdx = algorithms.indexOf(a);
        return (
          <div key={a.id} onClick={() => onSelect(globalIdx)} style={{
            padding: '8px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 3,
            border: `1px solid ${globalIdx === selectedIdx ? (CC[a.category] || '#6ee7b7') + '33' : 'transparent'}`,
            background: globalIdx === selectedIdx ? (CC[a.category] || '#6ee7b7') + '0a' : 'transparent',
            transition: 'all 0.12s',
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 8, color: DC[a.difficulty], marginBottom: 2,
            }}>* {a.difficulty} - {a.category}</div>
            <div style={{
              fontSize: 11.5, fontWeight: globalIdx === selectedIdx ? 600 : 400,
              color: globalIdx === selectedIdx ? '#e2e8f0' : '#8892a8',
            }}>{a.title}</div>
          </div>
        );
      })}

      {/* Empty state */}
      {displayList.length === 0 && (
        <div style={{
          padding: 20, textAlign: 'center', fontFamily: 'monospace',
          fontSize: 10, color: '#475569',
        }}>No algorithms match filters</div>
      )}
    </div>
  );
}
