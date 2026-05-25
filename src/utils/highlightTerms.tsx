import { ReactNode } from 'react'
import { JargonTerm } from '@/types'
import { JargonTooltip } from '@/components/jargon/JargonTooltip'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Build a single regex that matches any jargon term in the text.
// Terms are sorted longest-first to prevent partial matches.
function buildTermRegex(terms: JargonTerm[]): RegExp | null {
  if (terms.length === 0) return null
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length)
  const pattern = sorted.map(t => escapeRegex(t.term)).join('|')
  return new RegExp(`(${pattern})`, 'gi')
}

// Map from lowercase term string to JargonTerm for quick lookup
function buildTermMap(terms: JargonTerm[]): Map<string, JargonTerm> {
  const map = new Map<string, JargonTerm>()
  for (const t of terms) {
    map.set(t.term.toLowerCase(), t)
  }
  return map
}

let cachedRegex: RegExp | null = null
let cachedTermMap: Map<string, JargonTerm> | null = null
let cachedTermsLength = 0

export function highlightTerms(
  text: string,
  terms: JargonTerm[],
  discoveredIds: Set<string>,
  onDiscover?: (termId: string) => void,
): ReactNode[] {
  if (terms.length === 0) return [text]

  // Cache regex and map across renders (terms array is stable)
  if (!cachedRegex || cachedTermsLength !== terms.length) {
    cachedRegex = buildTermRegex(terms)
    cachedTermMap = buildTermMap(terms)
    cachedTermsLength = terms.length
  }

  const regex = cachedRegex
  const termMap = cachedTermMap!

  if (!regex) return [text]

  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  // Reset regex state
  regex.lastIndex = 0

  while ((match = regex.exec(text)) !== null) {
    const matchedText = match[0]
    const jargonTerm = termMap.get(matchedText.toLowerCase())
    if (!jargonTerm) continue

    // Add text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    nodes.push(
      <JargonTooltip
        key={`jt-${key++}`}
        term={jargonTerm}
        matchedText={matchedText}
        isDiscovered={discoveredIds.has(jargonTerm.id)}
        onDiscover={onDiscover}
      />
    )

    lastIndex = match.index + matchedText.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}
