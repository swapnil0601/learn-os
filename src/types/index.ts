export interface Concept {
  id: string
  title: string
  category: Category
  definition: string
  keyPoints: string[]
  tradeoffs: string[]
}

export type Category =
  | 'networking'
  | 'databases'
  | 'scalability'
  | 'reliability'
  | 'caching'
  | 'messaging'
  | 'architecture'

export interface ConceptEdge {
  source: string
  target: string
  label: string
}

export interface CardState {
  conceptId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate: string
}

export interface QuizQuestion {
  id: string
  scenario: string
  options: { label: string; value: string }[]
  correctAnswer: string
  explanation: string
  relatedConcepts: string[]
}


export interface JargonTerm {
  id: string
  term: string
  definition: string
  conceptId: string
  badgeGroup?: string
}

export interface JargonBadge {
  id: string
  name: string
  description: string
  icon: string
  termIds: string[]
}

// ═══════════════ DSA ═══════════════

export type DsaTopic =
  | 'arrays-hashing'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack'
  | 'binary-search'
  | 'linked-list'
  | 'trees'
  | 'tries'
  | 'heap'
  | 'backtracking'
  | 'graphs'
  | 'dynamic-programming'
  | 'greedy'
  | 'intervals'
  | 'bit-manipulation'
  | 'string-matching'
  | 'advanced-ds'

export type DsaDifficulty = 'easy' | 'medium' | 'hard'

export interface DsaAlgorithm {
  id: string
  name: string
  topic: DsaTopic
  description: string
  timeComplexity: string
  spaceComplexity: string
  keyIdea: string
}

export interface DsaProblem {
  id: string
  title: string
  topic: DsaTopic
  difficulty: DsaDifficulty
  description: string
  keyInsight: string
  patterns: string[]
}

export const DSA_TOPIC_META: Record<DsaTopic, { label: string; color: string; dot: string }> = {
  'arrays-hashing': { label: 'Arrays & Hashing', color: 'text-blue-400', dot: 'bg-blue-500' },
  'two-pointers': { label: 'Two Pointers', color: 'text-cyan-400', dot: 'bg-cyan-500' },
  'sliding-window': { label: 'Sliding Window', color: 'text-teal-400', dot: 'bg-teal-500' },
  'stack': { label: 'Stack', color: 'text-violet-400', dot: 'bg-violet-500' },
  'binary-search': { label: 'Binary Search', color: 'text-amber-400', dot: 'bg-amber-500' },
  'linked-list': { label: 'Linked List', color: 'text-rose-400', dot: 'bg-rose-500' },
  'trees': { label: 'Trees', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  'tries': { label: 'Tries', color: 'text-lime-400', dot: 'bg-lime-500' },
  'heap': { label: 'Heap / Priority Queue', color: 'text-orange-400', dot: 'bg-orange-500' },
  'backtracking': { label: 'Backtracking', color: 'text-pink-400', dot: 'bg-pink-500' },
  'graphs': { label: 'Graphs', color: 'text-indigo-400', dot: 'bg-indigo-500' },
  'dynamic-programming': { label: 'Dynamic Programming', color: 'text-purple-400', dot: 'bg-purple-500' },
  'greedy': { label: 'Greedy', color: 'text-yellow-400', dot: 'bg-yellow-500' },
  'intervals': { label: 'Intervals', color: 'text-sky-400', dot: 'bg-sky-500' },
  'bit-manipulation': { label: 'Bit Manipulation', color: 'text-slate-400', dot: 'bg-slate-500' },
  'string-matching': { label: 'String Matching', color: 'text-fuchsia-400', dot: 'bg-fuchsia-500' },
  'advanced-ds': { label: 'Advanced DS', color: 'text-red-400', dot: 'bg-red-500' },
}

// ═══════════════ SIMULATOR ═══════════════

export type SimTraitId =
  | 'read-throughput'
  | 'write-throughput'
  | 'latency'
  | 'consistency'
  | 'availability'
  | 'durability'
  | 'horizontal-scale'
  | 'cost-efficiency'

export interface SimChoiceCard {
  id: string
  name: string
  subtitle: string
  description: string
  pros: string[]
  cons: string[]
  traits: Partial<Record<SimTraitId, number>>
  realWorldUse: string
}

export interface SimLayer {
  id: string
  title: string
  description: string
  cards: SimChoiceCard[]
}

export interface SimRequirement {
  id: string
  label: string
  description: string
  traitChecks: { traitId: SimTraitId; minScore: number }[]
}

export interface SimScenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  constraints: string[]
  layers: SimLayer[]
  requirements: SimRequirement[]
}

export interface SimResult {
  scenarioId: string
  timestamp: string
  choices: Record<string, string>
  score: number
  passed: string[]
  failed: string[]
}

export const SIM_TRAIT_LABELS: Record<SimTraitId, string> = {
  'read-throughput': 'Read Throughput',
  'write-throughput': 'Write Throughput',
  'latency': 'Low Latency',
  'consistency': 'Consistency',
  'availability': 'Availability',
  'durability': 'Durability',
  'horizontal-scale': 'Horizontal Scale',
  'cost-efficiency': 'Cost Efficiency',
}

export type BuildingTier = 'castle' | 'fortress' | 'tower' | 'cottage'

export type HealthState = 'pristine' | 'weathered' | 'damaged' | 'ruins'

export const TERRITORY_NAMES: Record<Category, string> = {
  networking: 'Networking Realm',
  databases: 'Database Dominion',
  scalability: 'Scaling Frontier',
  reliability: 'Reliability Citadel',
  caching: 'Cache Provinces',
  messaging: 'Messenger Lands',
  architecture: 'Architecture Kingdom',
}

export const TERRITORY_HEX_COLORS: Record<Category, string> = {
  networking: '#3b82f6',
  databases: '#10b981',
  scalability: '#a855f7',
  reliability: '#f59e0b',
  caching: '#f43f5e',
  messaging: '#06b6d4',
  architecture: '#f97316',
}

export const CATEGORY_COLORS: Record<Category, { bg: string; border: string; text: string; dot: string }> = {
  networking: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', dot: 'bg-blue-500' },
  databases: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  scalability: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', dot: 'bg-purple-500' },
  reliability: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', dot: 'bg-amber-500' },
  caching: { bg: 'bg-rose-500/10', border: 'border-rose-500/50', text: 'text-rose-400', dot: 'bg-rose-500' },
  messaging: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400', dot: 'bg-cyan-500' },
  architecture: { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', dot: 'bg-orange-500' },
}
