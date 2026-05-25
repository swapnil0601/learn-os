import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { BuildingNode } from './BuildingNode'
import { TerritoryLabel } from './TerritoryLabel'
import { MapLegend } from './MapLegend'
import { concepts } from '@/data/concepts'
import { relationships } from '@/data/relationships'
import { computeBuildingTier, computeHealth, getHealthState } from '@/utils/buildingTier'
import { TERRITORY_NAMES, TERRITORY_HEX_COLORS } from '@/types'
import type { CardState, Category } from '@/types'

interface KnowledgeGraphProps {
  onConceptSelect: (conceptId: string) => void
  cardStates: Record<string, CardState>
}

const nodeTypes = {
  building: BuildingNode,
  territory: TerritoryLabel,
}

// Territory zone positions — hex-like arrangement
const TERRITORY_POSITIONS: Record<Category, { x: number; y: number }> = {
  networking: { x: 0, y: 0 },
  databases: { x: 500, y: 0 },
  architecture: { x: 1000, y: 0 },
  scalability: { x: 250, y: 400 },
  reliability: { x: 750, y: 400 },
  caching: { x: 0, y: 800 },
  messaging: { x: 500, y: 800 },
}

function computeKingdomNodes(cardStates: Record<string, CardState>): Node[] {
  const nodes: Node[] = []

  // Group concepts by category
  const categoryGroups: Record<string, typeof concepts> = {}
  concepts.forEach((c) => {
    if (!categoryGroups[c.category]) categoryGroups[c.category] = []
    categoryGroups[c.category].push(c)
  })

  for (const [cat, group] of Object.entries(categoryGroups)) {
    const category = cat as Category
    const base = TERRITORY_POSITIONS[category]
    if (!base) continue

    const zoneWidth = 380
    const zoneHeight = 320

    // Territory label node
    nodes.push({
      id: `territory-${cat}`,
      type: 'territory',
      position: { x: base.x + zoneWidth / 2 - 60, y: base.y },
      data: {
        label: TERRITORY_NAMES[category],
        color: TERRITORY_HEX_COLORS[category],
        buildingCount: group.length,
      },
      selectable: false,
      draggable: false,
    })

    // Sort buildings: highest tier first (most edges = center)
    const sorted = [...group].sort((a, b) => {
      const aEdges = relationships.filter((r) => r.source === a.id).length
      const bEdges = relationships.filter((r) => r.source === b.id).length
      return bEdges - aEdges
    })

    // Place buildings within territory
    sorted.forEach((concept, i) => {
      const tier = computeBuildingTier(concept.id, relationships)
      const health = computeHealth(cardStates[concept.id])
      const healthState = getHealthState(health)

      let x: number, y: number

      if (i === 0) {
        // Highest-tier building at center of territory
        x = base.x + zoneWidth / 2 - 30
        y = base.y + 40 + zoneHeight / 2 - 30
      } else {
        // Orbit around center
        const ring = Math.ceil(i / 6) // which ring (1-based)
        const posInRing = (i - 1) % 6
        const ringCount = Math.min(6, sorted.length - 1 - (ring - 1) * 6)
        const angle = (posInRing / Math.max(ringCount, 1)) * Math.PI * 2 - Math.PI / 2
        const radius = 80 + ring * 70

        x = base.x + zoneWidth / 2 - 30 + Math.cos(angle) * radius
        y = base.y + 40 + zoneHeight / 2 - 30 + Math.sin(angle) * radius * 0.7
      }

      nodes.push({
        id: concept.id,
        type: 'building',
        position: { x, y },
        data: {
          label: concept.title,
          category: concept.category,
          tier,
          health,
          healthState,
        },
      })
    })
  }

  return nodes
}

function computeEdges(): Edge[] {
  return relationships.map((rel, i) => ({
    id: `e-${i}`,
    source: rel.source,
    target: rel.target,
    label: rel.label,
    type: 'default',
    animated: false,
    style: { strokeWidth: 1.5, strokeDasharray: '6 3', stroke: '#8b7355' },
    labelStyle: { fontSize: 9, fontWeight: 500, fill: '#a3916e' },
    labelBgStyle: { fill: 'hsl(222 47% 7%)', fillOpacity: 0.8 },
  }))
}

export function KnowledgeGraph({ onConceptSelect, cardStates }: KnowledgeGraphProps) {
  const initialNodes = useMemo(() => computeKingdomNodes(cardStates), [cardStates])
  const allEdges = useMemo(() => computeEdges(), [])
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const [nodes, , onNodesChange] = useNodesState(initialNodes)

  // Only show edges connected to the hovered node
  const visibleEdges = useMemo(() => {
    if (!hoveredNodeId) return []
    return allEdges
      .filter((e) => e.source === hoveredNodeId || e.target === hoveredNodeId)
      .map((e) => ({ ...e, animated: true }))
  }, [allEdges, hoveredNodeId])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // Ignore territory label clicks
      if (node.type === 'territory') return
      onConceptSelect(node.id)
    },
    [onConceptSelect]
  )

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'territory') return
    setHoveredNodeId(node.id)
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
  }, [])

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] relative">
      <ReactFlow
        nodes={nodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="hsl(30 15% 15%)" />
        <Controls className="!bottom-4 !right-4" />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'territory') return 'transparent'
            const cat = (node.data as { category?: string })?.category
            if (!cat) return '#4b5563'
            return TERRITORY_HEX_COLORS[cat as Category] || '#4b5563'
          }}
          maskColor="rgba(0,0,0,0.75)"
          className="!top-4 !right-4"
          pannable
          zoomable
        />
      </ReactFlow>
      <MapLegend />
    </div>
  )
}
