import GraphRenderer from './GraphRenderer';
import GridRenderer from './GridRenderer';
import AccountsRenderer from './AccountsRenderer';
import ParentArrRenderer from './ParentArrRenderer';
import EdgeListRenderer from './EdgeListRenderer';
import ArrayBarRenderer from './ArrayBarRenderer';
import TreeRenderer from './TreeRenderer';
import QueueStackRenderer from './QueueStackRenderer';
import DPTableRenderer from './DPTableRenderer';
import SearchArrayRenderer from './SearchArrayRenderer';
import LinkedListRenderer from './LinkedListRenderer';

const RENDERERS = {
  graph: GraphRenderer,
  grid: GridRenderer,
  accounts: AccountsRenderer,
  dsu: ParentArrRenderer,
  edgeList: EdgeListRenderer,
  array: ArrayBarRenderer,
  tree: TreeRenderer,
  queueStack: QueueStackRenderer,
  dpTable: DPTableRenderer,
  searchArray: SearchArrayRenderer,
  linkedList: LinkedListRenderer,
};

export function getRenderer(type) {
  return RENDERERS[type] || null;
}

export function registerRenderer(type, component) {
  RENDERERS[type] = component;
}
