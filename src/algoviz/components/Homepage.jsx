import { useMemo } from 'react';
import { DC, CC } from '../theme';

const CATEGORY_ICONS = {
  Graph: '🕸️',
  DSU: '🔗',
  Tree: '🌳',
  DP: '📊',
  Sorting: '📈',
  Search: '🔍',
  'Two Pointers': '👉',
  Stack: '📚',
  Recursion: '🔄',
  'Linked List': '⛓️',
  'Sliding Window': '🪟',
  Heap: '🏔️',
};

export default function Homepage({ algorithms, onSelectCategory, onStartLearning }) {
  const stats = useMemo(() => {
    const byCategory = {};
    const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };

    algorithms.forEach(a => {
      if (!byCategory[a.category]) {
        byCategory[a.category] = { count: 0, difficulties: new Set(), algorithms: [] };
      }
      byCategory[a.category].count++;
      byCategory[a.category].difficulties.add(a.difficulty);
      byCategory[a.category].algorithms.push(a.title);
      byDifficulty[a.difficulty] = (byDifficulty[a.difficulty] || 0) + 1;
    });

    const categories = Object.entries(byCategory).map(([name, data]) => ({
      name,
      count: data.count,
      difficulties: data.difficulties,
      algorithms: data.algorithms,
      color: CC[name] || '#6ee7b7',
      icon: CATEGORY_ICONS[name] || '📌',
    }));

    categories.sort((a, b) => b.count - a.count);

    return { total: algorithms.length, categoryCount: categories.length, byDifficulty, categories };
  }, [algorithms]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>

      {/* HERO */}
      <div style={{
        background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 14,
        padding: '48px 32px', textAlign: 'center', marginBottom: 16,
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, #6ee7b706 0%, transparent 60%)',
      }}>
        <div style={{
          display: 'inline-block', fontFamily: 'monospace', fontSize: 9, color: '#6ee7b7',
          background: '#6ee7b712', border: '1px solid #6ee7b733', padding: '4px 14px',
          borderRadius: 99, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 16,
        }}>Interactive Algorithm Visualizer</div>

        <h1 style={{
          fontFamily: "'Courier New', monospace", fontSize: 40, fontWeight: 800,
          color: '#6ee7b7', letterSpacing: -1, margin: '16px 0 12px',
        }}>AlgoViz</h1>

        <p style={{
          fontSize: 14, color: '#8892a8', maxWidth: 540, margin: '0 auto 28px',
          lineHeight: 1.7,
        }}>
          See algorithms come alive. Step through BFS, DFS, sorting, dynamic programming
          and 30+ more with animated visualizations, line-by-line pseudocode tracing,
          and built-in mnemonics to lock it in.
        </p>

        <button
          onClick={onStartLearning}
          onMouseEnter={e => { e.currentTarget.style.background = '#5ddba8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#6ee7b7'; e.currentTarget.style.transform = 'translateY(0)'; }}
          style={{
            padding: '12px 32px', borderRadius: 8, background: '#6ee7b7', color: '#07070e',
            fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            transition: 'all 0.15s', boxShadow: '0 4px 20px #6ee7b722',
          }}
        >Start Learning →</button>

        <div style={{
          fontFamily: 'monospace', fontSize: 10, color: '#475569', marginTop: 14,
        }}>
          {stats.total} algorithms · {stats.categoryCount} topics · step-by-step visualization
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap',
      }}>
        {[
          { label: 'Total', value: stats.total, color: '#6ee7b7' },
          { label: 'Easy', value: stats.byDifficulty.Easy, color: DC.Easy },
          { label: 'Medium', value: stats.byDifficulty.Medium, color: DC.Medium },
          { label: 'Hard', value: stats.byDifficulty.Hard, color: DC.Hard },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, minWidth: 100, background: '#0d0d1a', border: '1px solid #1a1a2e',
            borderRadius: 10, padding: '12px 16px', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: s.color,
            }}>{s.value}</div>
            <div style={{
              fontFamily: 'monospace', fontSize: 9, color: '#475569',
              textTransform: 'uppercase', letterSpacing: 2, marginTop: 2,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SECTION HEADER */}
      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#475569',
        textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 12, paddingLeft: 4,
      }}>Explore by Topic</div>

      {/* TOPIC GRID */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 10, marginBottom: 32,
      }}>
        {stats.categories.map(cat => (
          <div
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = cat.color + '44';
              e.currentTarget.style.background = cat.color + '08';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1a1a2e';
              e.currentTarget.style.background = '#0d0d1a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            style={{
              background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10,
              padding: '16px 18px', cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
            <div style={{
              fontSize: 13, fontWeight: 700, color: cat.color, marginBottom: 4,
            }}>{cat.name}</div>
            <div style={{
              fontFamily: 'monospace', fontSize: 10, color: '#475569', marginBottom: 8,
            }}>{cat.count} algorithm{cat.count !== 1 ? 's' : ''}</div>

            {/* Difficulty pills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['Easy', 'Medium', 'Hard'].filter(d => cat.difficulties.has(d)).map(d => (
                <span key={d} style={{
                  fontSize: 8, fontFamily: 'monospace', padding: '1px 6px', borderRadius: 3,
                  background: DC[d] + '18', color: DC[d],
                }}>{d}</span>
              ))}
            </div>

            {/* Algorithm names preview */}
            <div style={{
              fontFamily: 'monospace', fontSize: 8, color: '#2a2a40', marginTop: 8,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>
              {cat.algorithms.slice(0, 3).join(' · ')}{cat.count > 3 ? ` · +${cat.count - 3}` : ''}
            </div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{
        fontFamily: 'monospace', fontSize: 9, color: '#475569',
        textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 12, paddingLeft: 4,
      }}>What You Get</div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 10, marginBottom: 40,
      }}>
        {[
          { icon: '▶️', title: 'Step-by-Step Playback', desc: 'Walk through every algorithm one step at a time with autoplay at 0.5x to 4x speed.' },
          { icon: '💻', title: 'Pseudocode Tracing', desc: 'Active line highlighting shows exactly which code line executes at each step.' },
          { icon: '🧠', title: 'Built-in Mnemonics', desc: 'Learn, quiz, flashcard, and edit modes to memorize algorithm patterns.' },
          { icon: '🎨', title: '11 Renderer Types', desc: 'Graphs, trees, arrays, grids, linked lists, DP tables, stacks, queues and more.' },
        ].map(f => (
          <div key={f.title} style={{
            background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10,
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
