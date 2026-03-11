import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllAlgorithms, getCategories, getDifficulties } from './core/registry';
import { DC, CC } from './theme';
import './algorithms'; // registers all algorithms

import Homepage from './components/Homepage';
import AlgorithmSidebar from './components/AlgorithmSidebar';
import Layout from './components/Layout';
import StepControls from './components/StepControls';
import ResultBadge from './components/ResultBadge';
import { getAllMnemonics } from './mnemonics/deriveMnemonics';
import LearnMode from './mnemonics/LearnMode';
import QuizMode from './mnemonics/QuizMode';
import FlashcardMode from './mnemonics/FlashcardMode';
import EditMode from './mnemonics/EditMode';

export default function AlgoViz() {
  const algorithms = getAllAlgorithms();
  const [tab, setTab] = useState('home');
  const [probIdx, setProbIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  // Problems filters
  const [probCatF, setProbCatF] = useState('All');
  const [probDiffF, setProbDiffF] = useState('All');
  const probCategories = getCategories();
  const probDifficulties = getDifficulties();
  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter(a =>
      (probCatF === 'All' || a.category === probCatF) &&
      (probDiffF === 'All' || a.difficulty === probDiffF)
    );
  }, [algorithms, probCatF, probDiffF]);

  // Mnemonics
  const [mMode, setMMode] = useState('learn');
  const [mIdx, setMIdx] = useState(0);
  const [catF, setCatF] = useState('All');
  const [mnemonics, setMnemonics] = useState(() => getAllMnemonics());

  // Mnemonic persistence
  useEffect(() => {
    try {
      const stored = localStorage.getItem('av-mnemonics');
      if (stored) {
        const o = JSON.parse(stored);
        setMnemonics(prev => prev.map(m =>
          o[m.id] ? { ...m, steps: o[m.id].steps || m.steps, detail: o[m.id].detail || m.detail } : m
        ));
      }
    } catch (e) { /* ignore */ }
  }, []);

  const saveMnemonic = useCallback((id, steps, detail) => {
    setMnemonics(prev => prev.map(m => m.id === id ? { ...m, steps, detail } : m));
    try {
      const stored = localStorage.getItem('av-mnemonics');
      const o = stored ? JSON.parse(stored) : {};
      o[id] = { steps, detail };
      localStorage.setItem('av-mnemonics', JSON.stringify(o));
    } catch (e) { /* ignore */ }
  }, []);

  // Algorithm steps
  const algo = algorithms[probIdx];
  const steps = useMemo(() => {
    if (!algo) return [];
    return algo.build(algo.defaultInput);
  }, [probIdx]);
  const step = steps[stepIdx] || steps[0] || {};

  const next = useCallback(() => setStepIdx(i => Math.min(i + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setStepIdx(i => Math.max(i - 1, 0)), []);
  const reset = useCallback(() => setStepIdx(0), []);
  const jump = useCallback((i) => setStepIdx(i), []);

  // Reset step when problem changes
  useEffect(() => setStepIdx(0), [probIdx]);

  // Sync selection when filters change
  useEffect(() => {
    if (filteredAlgorithms.length > 0) {
      const currentInFiltered = filteredAlgorithms.indexOf(algorithms[probIdx]);
      if (currentInFiltered === -1) {
        setProbIdx(algorithms.indexOf(filteredAlgorithms[0]));
      }
    }
  }, [probCatF, probDiffF]);

  // Navigate to problems with category filter (from Homepage)
  const navigateToCategory = useCallback((category) => {
    setProbCatF(category);
    setProbDiffF('All');
    setTab('problems');
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const h = (e) => {
      if (tab !== 'problems') return;
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [tab, next, prev]);

  // Mnemonic filtering
  const mCats = ['All', ...new Set(mnemonics.map(m => m.cat))];
  const filteredM = catF === 'All' ? mnemonics : mnemonics.filter(m => m.cat === catF);
  const curM = mnemonics[mIdx];

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#07070e',
      color: '#e2e8f0', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', borderBottom: '1px solid #1a1a2e',
        background: '#0a0a16', flexShrink: 0, padding: '0 14px',
      }}>
        <div onClick={() => setTab('home')} style={{
          fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#6ee7b7',
          marginRight: 20, letterSpacing: -0.5, cursor: 'pointer',
        }}>AlgoViz</div>
        {[{ k: 'home', l: 'Home' }, { k: 'problems', l: 'Problems' }, { k: 'mnemonics', l: 'Mnemonics' }].map(v => (
          <div key={v.k} onClick={() => setTab(v.k)} style={{
            padding: '12px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            borderBottom: `2px solid ${tab === v.k ? '#6ee7b7' : 'transparent'}`,
            color: tab === v.k ? '#6ee7b7' : '#64748b', transition: 'all 0.15s',
          }}>{v.l}</div>
        ))}
        {tab === 'mnemonics' && (
          <div style={{ display: 'flex', gap: 2, marginLeft: 16 }}>
            {['learn', 'quiz', 'flashcards', 'edit'].map(m => (
              <div key={m} onClick={() => setMMode(m)} style={{
                padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 10, fontFamily: 'monospace',
                background: mMode === m ? '#6ee7b712' : 'transparent',
                border: `1px solid ${mMode === m ? '#6ee7b744' : 'transparent'}`,
                color: mMode === m ? '#6ee7b7' : '#475569', transition: 'all 0.15s',
              }}>{m}</div>
            ))}
          </div>
        )}
        <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 9, color: '#2a2a40' }}>
          {tab === 'problems' ? 'arrow keys / space' : ''}
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* HOME TAB */}
        {tab === 'home' && (
          <Homepage
            algorithms={algorithms}
            onSelectCategory={navigateToCategory}
            onStartLearning={() => { setProbCatF('All'); setProbDiffF('All'); setTab('problems'); }}
          />
        )}

        {/* PROBLEMS TAB */}
        {tab === 'problems' && (
          <>
            <AlgorithmSidebar
              algorithms={algorithms}
              filteredAlgorithms={filteredAlgorithms}
              selectedIdx={probIdx}
              onSelect={setProbIdx}
              categoryFilter={probCatF}
              onCategoryChange={setProbCatF}
              difficultyFilter={probDiffF}
              onDifficultyChange={setProbDiffF}
              categories={probCategories}
              difficulties={probDifficulties}
            />
            <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
              {algo && (
                <>
                  {/* Compact header: title + badges + description + mnemonic */}
                  <div style={{
                    background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 10,
                    padding: '10px 14px', marginBottom: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{algo.title}</span>
                      <span style={{
                        fontSize: 9, fontFamily: 'monospace', padding: '1px 6px', borderRadius: 3,
                        background: DC[algo.difficulty] + '18', color: DC[algo.difficulty],
                      }}>{algo.difficulty}</span>
                      <span style={{
                        fontSize: 9, fontFamily: 'monospace', padding: '1px 6px', borderRadius: 3,
                        background: (CC[algo.category] || '#6ee7b7') + '18',
                        color: CC[algo.category] || '#6ee7b7',
                      }}>{algo.category}</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginLeft: 4 }}>{algo.description}</span>
                    </div>
                    {algo.mnemonic && (
                      <div style={{
                        display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center',
                        marginTop: 6, padding: '5px 10px', borderRadius: 6,
                        background: '#6ee7b706', border: '1px solid #6ee7b715',
                      }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 2, marginRight: 4 }}>Mnemonic</span>
                        {algo.mnemonic.steps.map((s, i) => (
                          <span key={i} style={{ fontSize: 11, color: '#a7f3d0', fontWeight: 600 }}>
                            {s}{i < algo.mnemonic.steps.length - 1 ? <span style={{ color: '#2a2a40', margin: '0 3px' }}>→</span> : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, flexWrap: 'wrap' }}>
                    <StepControls
                      stepIdx={stepIdx} totalSteps={steps.length}
                      onPrev={prev} onNext={next} onReset={reset} onJump={jump}
                    />
                    <ResultBadge result={step.result} metrics={step.metrics} />
                  </div>

                  {/* Layout renders all panels + code + log */}
                  <Layout algorithm={algo} step={step} />
                </>
              )}
            </div>
          </>
        )}

        {/* MNEMONICS TAB */}
        {tab === 'mnemonics' && (
          <>
            {mMode !== 'flashcards' && (
              <div style={{
                width: 220, flexShrink: 0, borderRight: '1px solid #1a1a2e',
                overflowY: 'auto', padding: 10,
              }}>
                {/* Category filter */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
                  {mCats.map(c => (
                    <button key={c} onClick={() => setCatF(c)} style={{
                      padding: '3px 8px', borderRadius: 5, fontSize: 9, fontFamily: 'monospace', cursor: 'pointer',
                      border: `1px solid ${catF === c ? (CC[c] || '#6ee7b7') + '44' : '#1a1a2e'}`,
                      background: catF === c ? (CC[c] || '#6ee7b7') + '0e' : 'transparent',
                      color: catF === c ? (CC[c] || '#6ee7b7') : '#475569', transition: 'all 0.15s',
                    }}>{c}</button>
                  ))}
                </div>
                {filteredM.map((m) => {
                  const ri = mnemonics.indexOf(m);
                  return (
                    <div key={m.id} onClick={() => setMIdx(ri)} style={{
                      padding: '7px 9px', borderRadius: 7, cursor: 'pointer', marginBottom: 3,
                      border: `1px solid ${ri === mIdx ? (CC[m.cat] || '#6ee7b7') + '33' : 'transparent'}`,
                      background: ri === mIdx ? (CC[m.cat] || '#6ee7b7') + '0a' : 'transparent',
                      transition: 'all 0.12s',
                    }}>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 1 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 7, color: CC[m.cat] || '#6ee7b7' }}>*</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: DC[m.diff] }}>{m.diff}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#2a2a40' }}>-</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: CC[m.cat] || '#6ee7b7' }}>{m.cat}</span>
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: ri === mIdx ? 600 : 400, color: ri === mIdx ? '#e2e8f0' : '#8892a8' }}>
                        {m.name}
                      </div>
                      <div style={{
                        fontFamily: 'monospace', fontSize: 8, color: '#2a2a40', marginTop: 1,
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>{m.steps.join(' -> ')}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ flex: 1, overflowY: 'auto', padding: mMode === 'flashcards' ? 16 : 14 }}>
              {mMode !== 'flashcards' && curM && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{curM.name}</h2>
                  <span style={{
                    fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 4,
                    background: (DC[curM.diff]) + '15', color: DC[curM.diff],
                  }}>{curM.diff}</span>
                  <span style={{
                    fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 4,
                    background: (CC[curM.cat] || '#6ee7b7') + '15', color: CC[curM.cat] || '#6ee7b7',
                  }}>{curM.cat}</span>
                </div>
              )}
              {mMode === 'learn' && curM && <LearnMode m={curM} />}
              {mMode === 'quiz' && curM && <QuizMode m={curM} />}
              {mMode === 'flashcards' && (
                <>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {mCats.map(c => (
                      <button key={c} onClick={() => setCatF(c)} style={{
                        padding: '4px 10px', borderRadius: 5, fontSize: 10, fontFamily: 'monospace', cursor: 'pointer',
                        border: `1px solid ${catF === c ? (CC[c] || '#6ee7b7') + '44' : '#1a1a2e'}`,
                        background: catF === c ? (CC[c] || '#6ee7b7') + '0e' : 'transparent',
                        color: catF === c ? (CC[c] || '#6ee7b7') : '#475569',
                      }}>{c}</button>
                    ))}
                  </div>
                  <FlashcardMode items={filteredM} />
                </>
              )}
              {mMode === 'edit' && curM && <EditMode m={curM} onSave={saveMnemonic} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
