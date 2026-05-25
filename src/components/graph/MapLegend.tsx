import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function MapLegend() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors"
      >
        Kingdom Guide
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 mt-1 w-52 space-y-3">
          {/* Tiers */}
          <div>
            <div className="text-[10px] font-semibold text-foreground mb-1.5 uppercase tracking-wider">Building Rank</div>
            <div className="space-y-1">
              {[
                { tier: 'Castle', desc: '8+ connections', size: 'text-sm' },
                { tier: 'Fortress', desc: '5-7 connections', size: 'text-xs' },
                { tier: 'Tower', desc: '3-4 connections', size: 'text-[11px]' },
                { tier: 'Cottage', desc: '0-2 connections', size: 'text-[10px]' },
              ].map((t) => (
                <div key={t.tier} className="flex items-center gap-2">
                  <span className={`${t.size} font-medium text-foreground w-14`}>{t.tier}</span>
                  <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health */}
          <div>
            <div className="text-[10px] font-semibold text-foreground mb-1.5 uppercase tracking-wider">Building Health</div>
            <div className="space-y-1">
              {[
                { state: 'Pristine', color: '#22c55e', desc: 'Recently reviewed' },
                { state: 'Weathered', color: '#eab308', desc: 'Review approaching' },
                { state: 'Damaged', color: '#f97316', desc: 'Overdue' },
                { state: 'Ruins', color: '#6b7280', desc: 'Never/long overdue' },
              ].map((h) => (
                <div key={h.state} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                  <span className="text-[10px] text-foreground w-16">{h.state}</span>
                  <span className="text-[10px] text-muted-foreground">{h.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[9px] text-muted-foreground italic">
            Buildings decay when overdue for review. Click to rebuild!
          </p>
        </div>
      )}
    </div>
  )
}
