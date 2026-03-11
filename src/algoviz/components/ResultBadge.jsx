export default function ResultBadge({ result, metrics }) {
  if (!result && (!metrics || Object.keys(metrics).length === 0)) return null;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
      {metrics && Object.entries(metrics).map(([label, { value, color }]) => (
        <div key={label} style={{
          fontFamily: 'monospace', fontSize: 13, color: color || '#60a5fa', fontWeight: 700,
        }}>{label}: {value}</div>
      ))}
      {result && (
        <div style={{
          padding: '4px 12px', borderRadius: 6, fontSize: 11.5, fontWeight: 600,
          background: result.includes('Cycle') || result.includes('Redundant') ? '#f472b60e' : '#6ee7b70e',
          border: `1px solid ${result.includes('Cycle') || result.includes('Redundant') ? '#f472b644' : '#6ee7b744'}`,
          color: result.includes('Cycle') || result.includes('Redundant') ? '#f472b6' : '#6ee7b7',
        }}>{result}</div>
      )}
    </div>
  );
}
