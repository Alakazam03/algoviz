export default function Panel({ label, children, style }) {
  return (
    <div style={{
      background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10,
      padding: 12, ...style,
    }}>
      {label && (
        <div style={{
          fontFamily: 'monospace', fontSize: 9, color: '#475569',
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6,
        }}>{label}</div>
      )}
      {children}
    </div>
  );
}
