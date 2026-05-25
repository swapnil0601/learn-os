import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { JargonTerm } from '@/types'
import { cn } from '@/lib/utils'

interface JargonTooltipProps {
  term: JargonTerm
  matchedText: string
  isDiscovered: boolean
  onDiscover?: (termId: string) => void
}

export function JargonTooltip({ term, matchedText, isDiscovered, onDiscover }: JargonTooltipProps) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number; above: boolean }>({ x: 0, y: 0, above: true })
  const ref = useRef<HTMLSpanElement>(null)

  const handleEnter = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const above = rect.top > 140
      setPos({
        x: rect.left + rect.width / 2,
        y: above ? rect.top : rect.bottom,
        above,
      })
      if (!isDiscovered && onDiscover) onDiscover(term.id)
    }
    setShow(true)
  }, [isDiscovered, onDiscover, term.id])

  return (
    <span
      ref={ref}
      className={cn(
        'border-b border-dashed cursor-help inline',
        isDiscovered
          ? 'border-primary/50 text-foreground'
          : 'border-muted-foreground/30'
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      onClick={() => { if (show) setShow(false); else handleEnter() }}
    >
      {matchedText}
      {show && createPortal(
        <div
          className="fixed z-[200] w-64 px-3 py-2.5 rounded-lg bg-[hsl(var(--card))] border border-border shadow-2xl text-xs pointer-events-none"
          style={{
            left: pos.x,
            top: pos.above ? pos.y : pos.y + 8,
            transform: pos.above
              ? 'translate(-50%, -100%) translateY(-8px)'
              : 'translate(-50%, 0)',
          }}
        >
          <span className="font-semibold text-primary block mb-0.5">{term.term}</span>
          <span className="text-muted-foreground leading-relaxed block">{term.definition}</span>
        </div>,
        document.body
      )}
    </span>
  )
}
