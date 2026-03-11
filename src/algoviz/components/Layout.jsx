import { getRenderer } from '../renderers';
import Panel from './Panel';
import StepLog from './StepLog';
import CodePanel from './CodePanel';

export default function Layout({ algorithm, step }) {
  const { layout } = algorithm;
  const panels = layout?.panels || [];

  const main = panels.filter(p => p.area === 'main');
  const sidebar = panels.filter(p => p.area === 'sidebar');
  const bottomLeft = panels.filter(p => p.area === 'bottom-left');
  const bottomRight = panels.filter(p => p.area === 'bottom-right');
  const hasSidebar = sidebar.length > 0;

  const renderPanel = (panel) => {
    const Renderer = getRenderer(panel.renderer);
    const data = step?.[panel.renderer];
    if (!Renderer) return null;
    return (
      <Panel key={panel.renderer + panel.label} label={panel.label}>
        <Renderer data={data} algorithm={algorithm} step={step} />
      </Panel>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Top row: main + sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: hasSidebar ? '3fr 2fr' : '1fr',
        gap: 10,
      }}>
        {main.map(renderPanel)}
        {sidebar.map(renderPanel)}
      </div>

      {/* Middle row: bottom panels */}
      {(bottomLeft.length > 0 || bottomRight.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: bottomLeft.length > 0 && bottomRight.length > 0 ? '1fr 1fr' : '1fr',
          gap: 10,
        }}>
          {bottomLeft.map(renderPanel)}
          {bottomRight.map(renderPanel)}
        </div>
      )}

      {/* Bottom row: step log + code panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Panel label="Steps">
          <StepLog log={step?.log} />
        </Panel>
        <CodePanel pseudocode={algorithm.pseudocode} activeLine={step?.codeLine} />
      </div>
    </div>
  );
}
