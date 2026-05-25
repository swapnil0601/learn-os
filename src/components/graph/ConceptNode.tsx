import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { CATEGORY_COLORS, type Category } from '@/types'
import { cn } from '@/lib/utils'

interface ConceptNodeData {
  label: string
  category: Category
  [key: string]: unknown
}

function ConceptNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as ConceptNodeData
  const colors = CATEGORY_COLORS[nodeData.category] || CATEGORY_COLORS.networking

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2" />
      <div
        className={cn(
          'px-4 py-2.5 rounded-lg border-2 shadow-lg cursor-pointer transition-all',
          'hover:shadow-xl hover:scale-105',
          colors.bg,
          colors.border
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', colors.dot)} />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {nodeData.label}
          </span>
        </div>
        <div className={cn('text-[10px] mt-0.5 ml-4 capitalize', colors.text)}>
          {nodeData.category}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2" />
    </>
  )
}

export const ConceptNode = memo(ConceptNodeComponent)
