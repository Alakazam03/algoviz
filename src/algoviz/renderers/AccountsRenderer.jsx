import { pc } from '../theme';

export default function AccountsRenderer({ data, algorithm }) {
  if (!data) return null;
  const { hlAcct = [], merged } = data;
  const accounts = algorithm.defaultInput?.accounts || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#475569',
        textTransform: 'uppercase', letterSpacing: 2,
      }}>Input</div>
      {accounts.map((a, i) => (
        <div key={i} style={{
          padding: '5px 10px', borderRadius: 7, fontFamily: 'monospace', fontSize: 11,
          background: hlAcct.includes(i) ? '#fbbf240e' : '#0c0c18',
          border: `1px solid ${hlAcct.includes(i) ? '#fbbf24' : '#1e293b'}`,
          transition: 'all 0.2s',
        }}>
          <span style={{ color: '#60a5fa', fontWeight: 700 }}>{a.name}</span>: {a.emails.join(', ')}
        </div>
      ))}
      {merged && (
        <>
          <div style={{
            fontFamily: 'monospace', fontSize: 9, color: '#475569',
            textTransform: 'uppercase', letterSpacing: 2, marginTop: 6,
          }}>Merged</div>
          {merged.map((g, i) => {
            const c = pc(i);
            return (
              <div key={i} style={{
                padding: '5px 10px', borderRadius: 7, fontFamily: 'monospace', fontSize: 11,
                background: c + '0e', border: `1px solid ${c}44`,
              }}>
                <span style={{ color: c, fontWeight: 700 }}>{g.name}</span>: {g.emails.join(', ')}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
