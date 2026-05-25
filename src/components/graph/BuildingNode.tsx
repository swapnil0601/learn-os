import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { BuildingTier, HealthState, Category } from '@/types'
import { TERRITORY_HEX_COLORS } from '@/types'
import { getHealthColor } from '@/utils/buildingTier'

interface BuildingNodeData {
  label: string
  category: Category
  tier: BuildingTier
  health: number
  healthState: HealthState
  [key: string]: unknown
}

function BuildingNodeComponent({ data }: NodeProps) {
  const d = data as unknown as BuildingNodeData
  const color = TERRITORY_HEX_COLORS[d.category] || '#6b7280'
  const healthColor = getHealthColor(d.health)
  const isRuins = d.healthState === 'ruins'
  const isDamaged = d.healthState === 'damaged'
  const isPristine = d.healthState === 'pristine'

  // Scale by tier
  const scale = d.tier === 'castle' ? 1.3 : d.tier === 'fortress' ? 1.1 : d.tier === 'tower' ? 0.9 : 0.75
  const opacity = isRuins ? 0.75 : isDamaged ? 0.85 : 1
  const saturation = isRuins ? 'saturate(0.5)' : isDamaged ? 'saturate(0.75)' : 'saturate(1)'

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div
        className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isPristine ? 'building-pristine' : ''} ${isDamaged ? 'building-damaged' : ''}`}
        style={{ transform: `scale(${scale})`, opacity, filter: saturation }}
      >
        {/* Building SVG */}
        <div className="relative">
          {renderBuilding(d.tier, color, d.healthState)}

          {/* Vine overlay for ruins */}
          {isRuins && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 60 60">
              <path d="M5 55 Q15 40 10 25 Q8 15 15 10" fill="none" stroke="#2d5a1e" strokeWidth="1.5" opacity="0.6" />
              <path d="M50 50 Q45 35 48 20" fill="none" stroke="#2d5a1e" strokeWidth="1" opacity="0.5" />
              <circle cx="12" cy="12" r="2" fill="#3a7a2a" opacity="0.5" />
              <circle cx="48" cy="22" r="1.5" fill="#3a7a2a" opacity="0.4" />
            </svg>
          )}
        </div>

        {/* Building name */}
        <span
          className="text-[9px] font-medium text-center max-w-[80px] leading-tight mt-1"
          style={{ color: isRuins ? '#9ca3af' : '#e5e7eb' }}
        >
          {d.label}
        </span>

        {/* Health bar */}
        <div className="w-12 h-1 bg-gray-800 rounded-full mt-0.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${d.health}%`, backgroundColor: healthColor }}
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </>
  )
}

function renderBuilding(tier: BuildingTier, color: string, healthState: HealthState) {
  const cracked = healthState === 'damaged' || healthState === 'ruins'
  // Keep category color for all states — dimming handled by container opacity/saturation
  const dim = color

  switch (tier) {
    case 'castle':
      return <CastleSVG color={dim} cracked={cracked} healthState={healthState} />
    case 'fortress':
      return <FortressSVG color={dim} cracked={cracked} healthState={healthState} />
    case 'tower':
      return <TowerSVG color={dim} cracked={cracked} healthState={healthState} />
    case 'cottage':
      return <CottageSVG color={dim} cracked={cracked} healthState={healthState} />
  }
}

function CastleSVG({ color, cracked, healthState }: { color: string; cracked: boolean; healthState: HealthState }) {
  return (
    <svg width="60" height="55" viewBox="0 0 60 55">
      {/* Base/ground */}
      <ellipse cx="30" cy="52" rx="28" ry="3" fill={healthState === 'pristine' ? '#2d5a1e' : healthState === 'ruins' ? '#4a3728' : '#5a4a2e'} opacity="0.5" />

      {/* Main wall */}
      <rect x="10" y="22" width="40" height="28" rx="1" fill={color} />

      {/* Left tower */}
      <rect x="5" y="12" width="12" height="38" rx="1" fill={color} />
      {/* Left battlement */}
      <rect x="5" y="8" width="3" height="6" fill={color} />
      <rect x="10" y="8" width="3" height="6" fill={color} />

      {/* Right tower */}
      <rect x="43" y="12" width="12" height="38" rx="1" fill={color} />
      {/* Right battlement */}
      <rect x="47" y="8" width="3" height="6" fill={color} />
      <rect x="52" y="8" width="3" height="6" fill={color} />

      {/* Center tower */}
      <rect x="22" y="5" width="16" height="30" rx="1" fill={color} />
      <polygon points="22,5 30,0 38,5" fill={color} />

      {/* Gate */}
      <rect x="25" y="36" width="10" height="14" rx="5" fill="#1a1a2e" />

      {/* Windows */}
      <rect x="27" y="15" width="6" height="6" rx="3" fill="#1a1a2e" opacity="0.8" />
      <rect x="8" y="22" width="4" height="5" rx="2" fill="#1a1a2e" opacity="0.7" />
      <rect x="48" y="22" width="4" height="5" rx="2" fill="#1a1a2e" opacity="0.7" />

      {/* Banner on center tower */}
      {healthState !== 'ruins' && (
        <g className={healthState === 'pristine' ? 'banner-wave' : ''}>
          <line x1="30" y1="0" x2="30" y2="-8" stroke="#8b7355" strokeWidth="1" />
          <polygon points="30,-8 42,-5 30,-2" fill={color} opacity="0.9" />
        </g>
      )}

      {/* Cracks */}
      {cracked && (
        <g opacity="0.6">
          <path d="M18 30 L22 35 L20 42" fill="none" stroke="#1a1a1a" strokeWidth="1" />
          <path d="M40 25 L38 32 L42 38" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
        </g>
      )}

      {/* Golden glow for pristine */}
      {healthState === 'pristine' && (
        <rect x="3" y="0" width="54" height="55" rx="3" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" className="building-glow" />
      )}
    </svg>
  )
}

function FortressSVG({ color, cracked, healthState }: { color: string; cracked: boolean; healthState: HealthState }) {
  return (
    <svg width="50" height="45" viewBox="0 0 50 45">
      <ellipse cx="25" cy="43" rx="22" ry="2.5" fill={healthState === 'pristine' ? '#2d5a1e' : '#4a3728'} opacity="0.5" />

      {/* Main structure */}
      <rect x="8" y="15" width="34" height="27" rx="1" fill={color} />

      {/* Left turret */}
      <rect x="5" y="10" width="8" height="32" rx="1" fill={color} />
      <rect x="5" y="7" width="3" height="5" fill={color} />
      <rect x="10" y="7" width="3" height="5" fill={color} />

      {/* Right turret */}
      <rect x="37" y="10" width="8" height="32" rx="1" fill={color} />
      <rect x="37" y="7" width="3" height="5" fill={color} />
      <rect x="42" y="7" width="3" height="5" fill={color} />

      {/* Gate */}
      <rect x="20" y="30" width="10" height="12" rx="5" fill="#1a1a2e" />

      {/* Windows */}
      <rect x="14" y="20" width="4" height="5" rx="2" fill="#1a1a2e" opacity="0.7" />
      <rect x="32" y="20" width="4" height="5" rx="2" fill="#1a1a2e" opacity="0.7" />

      {/* Flag */}
      {healthState !== 'ruins' && (
        <g className={healthState === 'pristine' ? 'banner-wave' : ''}>
          <line x1="25" y1="15" x2="25" y2="3" stroke="#8b7355" strokeWidth="1" />
          <polygon points="25,3 35,6 25,9" fill={color} opacity="0.9" />
        </g>
      )}

      {cracked && (
        <path d="M16 22 L20 30 L18 38" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.5" />
      )}

      {healthState === 'pristine' && (
        <rect x="3" y="2" width="44" height="43" rx="3" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" className="building-glow" />
      )}
    </svg>
  )
}

function TowerSVG({ color, cracked, healthState }: { color: string; cracked: boolean; healthState: HealthState }) {
  return (
    <svg width="30" height="42" viewBox="0 0 30 42">
      <ellipse cx="15" cy="40" rx="12" ry="2" fill={healthState === 'pristine' ? '#2d5a1e' : '#4a3728'} opacity="0.5" />

      {/* Tower body */}
      <rect x="8" y="12" width="14" height="28" rx="1" fill={color} />

      {/* Pointed roof */}
      <polygon points="6,12 15,2 24,12" fill={color} opacity="0.9" />

      {/* Window */}
      <rect x="12" y="18" width="6" height="7" rx="3" fill="#1a1a2e" opacity="0.7" />

      {/* Door */}
      <rect x="11" y="33" width="8" height="7" rx="4" fill="#1a1a2e" />

      {/* Flag */}
      {healthState !== 'ruins' && (
        <g className={healthState === 'pristine' ? 'banner-wave' : ''}>
          <line x1="15" y1="2" x2="15" y2="-5" stroke="#8b7355" strokeWidth="0.8" />
          <polygon points="15,-5 23,-3 15,-1" fill={color} opacity="0.8" />
        </g>
      )}

      {cracked && (
        <path d="M12 20 L14 28 L12 35" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.5" />
      )}

      {healthState === 'pristine' && (
        <rect x="5" y="0" width="20" height="42" rx="2" fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.3" className="building-glow" />
      )}
    </svg>
  )
}

function CottageSVG({ color, cracked, healthState }: { color: string; cracked: boolean; healthState: HealthState }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <ellipse cx="14" cy="26" rx="12" ry="2" fill={healthState === 'pristine' ? '#2d5a1e' : '#4a3728'} opacity="0.5" />

      {/* House body */}
      <rect x="4" y="14" width="20" height="12" rx="1" fill={color} />

      {/* Roof */}
      <polygon points="2,14 14,4 26,14" fill={color} />

      {/* Door */}
      <rect x="11" y="19" width="6" height="7" rx="1" fill="#1a1a2e" />

      {/* Window */}
      <rect x="6" y="17" width="4" height="4" rx="1" fill="#1a1a2e" opacity="0.7" />

      {/* Chimney */}
      <rect x="19" y="7" width="3" height="8" fill={color} opacity="0.9" />
      {healthState !== 'ruins' && (
        <g className="smoke-wisps" opacity="0.3">
          <circle cx="20.5" cy="5" r="1.5" fill="#9ca3af" />
          <circle cx="21.5" cy="2" r="1" fill="#9ca3af" />
        </g>
      )}

      {cracked && (
        <path d="M8 16 L10 22" fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.5" />
      )}

      {healthState === 'pristine' && (
        <rect x="1" y="2" width="26" height="26" rx="2" fill="none" stroke="#fbbf24" strokeWidth="0.6" opacity="0.25" className="building-glow" />
      )}
    </svg>
  )
}

export const BuildingNode = memo(BuildingNodeComponent)
