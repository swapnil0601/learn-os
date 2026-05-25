import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'

interface TerritoryLabelData {
  label: string
  color: string
  buildingCount: number
  [key: string]: unknown
}

function TerritoryLabelComponent({ data }: NodeProps) {
  const d = data as unknown as TerritoryLabelData

  return (
    <div className="pointer-events-none select-none">
      <div
        className="text-[11px] font-bold uppercase tracking-[0.2em] text-center"
        style={{ color: d.color, opacity: 0.4, textShadow: `0 0 20px ${d.color}33` }}
      >
        {d.label}
      </div>
      <div className="text-[8px] text-center mt-0.5" style={{ color: d.color, opacity: 0.25 }}>
        {d.buildingCount} structure{d.buildingCount !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export const TerritoryLabel = memo(TerritoryLabelComponent)
