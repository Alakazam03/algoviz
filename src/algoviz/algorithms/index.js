import { registerAlgorithms } from '../core/registry';

// Graph traversals
import bfs from './graph-bfs';
import dfs from './graph-dfs';
import dijkstra from './graph-dijkstra';
import bfsShortestPath from './graph-bfs-shortest-path';
import bfsLevelOrder from './graph-bfs-level-order';
import bfsRottingOranges from './graph-bfs-rotting-oranges';
import dfsIslands from './graph-dfs-islands';
import dfsFloodFill from './graph-dfs-flood-fill';
import dfsPathSum from './graph-dfs-path-sum';
import topoSort from './graph-topological-sort';

// DSU
import cycle from './dsu-cycle';
import comps from './dsu-components';
import redun from './dsu-redundant';
import islands from './dsu-islands';
import accts from './dsu-accounts';
import kruskal from './dsu-kruskal';

// Sorting
import bubble from './sorting-bubble';
import merge from './sorting-merge';
import selection from './sorting-selection';
import insertion from './sorting-insertion';
import quick from './sorting-quick';

// Tree
import inorder from './tree-inorder';
import preorder from './tree-preorder';
import postorder from './tree-postorder';
import maxDepth from './tree-max-depth';
import invertTree from './tree-invert';
import validateBST from './tree-validate-bst';
import lca from './tree-lca';
import diameter from './tree-diameter';
import sameTree from './tree-same-tree';

// DP
import climb from './dp-climbing-stairs';
import fibonacci from './recursion-fibonacci';
import houseRobber from './dp-house-robber';
import coinChange from './dp-coin-change';
import lcs from './dp-lcs';

// Search
import bsearch from './search-binary';

// Two Pointers
import twoSum from './two-pointers-two-sum';
import container from './two-pointers-container';

// Stack
import validParens from './stack-valid-parens';

// Recursion / Backtracking
import hanoi from './recursion-tower-of-hanoi';
import subsets from './recursion-subsets';
import permutations from './recursion-permutations';
import nQueens from './recursion-n-queens';
import generateParens from './recursion-generate-parens';
import wordSearch from './backtracking-word-search';
import combinationSum from './backtracking-combination-sum';

// Heap
import kthLargest from './heap-kth-largest';

// Linked List
import reversLL from './linkedlist-reverse';
import detectCycleLL from './linkedlist-cycle';

// Sliding Window
import maxSubarrayK from './sliding-window-max-subarray';
import longestSubstr from './sliding-window-longest-substring';

const ALL_ALGORITHMS = [
  // Graph — BFS
  bfs, bfsShortestPath, bfsLevelOrder, bfsRottingOranges,
  // Graph — DFS
  dfs, dfsIslands, dfsFloodFill, dfsPathSum, topoSort,
  // Graph — Weighted
  dijkstra,
  // DSU
  cycle, comps, redun, islands, accts, kruskal,
  // Sorting
  bubble, selection, insertion, merge, quick,
  // Tree
  inorder, preorder, postorder, maxDepth, invertTree, validateBST, lca, diameter, sameTree,
  // DP
  climb, fibonacci, houseRobber, coinChange, lcs,
  // Search
  bsearch,
  // Two Pointers
  twoSum, container,
  // Stack
  validParens,
  // Recursion / Backtracking
  hanoi, subsets, permutations, nQueens, generateParens, wordSearch, combinationSum,
  // Heap
  kthLargest,
  // Linked List
  reversLL, detectCycleLL,
  // Sliding Window
  maxSubarrayK, longestSubstr,
];

registerAlgorithms(ALL_ALGORITHMS);

export default ALL_ALGORITHMS;
