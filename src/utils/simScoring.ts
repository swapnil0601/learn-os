import { SimScenario, SimTraitId, SIM_TRAIT_LABELS } from '@/types'

interface TraitResult {
  traitId: SimTraitId
  score: number
}

interface RequirementResult {
  requirementId: string
  passed: boolean
  explanation: string
  traitResults: TraitResult[]
}

export interface SimScoreResult {
  traitScores: Partial<Record<SimTraitId, number>>
  requirements: RequirementResult[]
  passedCount: number
  totalCount: number
}

export function scoreSimulation(
  scenario: SimScenario,
  choices: Record<string, string>, // layerId → cardId
): SimScoreResult {
  // 1. Compute trait averages from chosen cards
  const traitSums: Partial<Record<SimTraitId, number>> = {}
  const traitCounts: Partial<Record<SimTraitId, number>> = {}

  for (const layer of scenario.layers) {
    const chosenId = choices[layer.id]
    const card = layer.cards.find(c => c.id === chosenId)
    if (!card) continue

    for (const [trait, value] of Object.entries(card.traits)) {
      const t = trait as SimTraitId
      traitSums[t] = (traitSums[t] ?? 0) + value!
      traitCounts[t] = (traitCounts[t] ?? 0) + 1
    }
  }

  const traitScores: Partial<Record<SimTraitId, number>> = {}
  for (const trait of Object.keys(traitSums) as SimTraitId[]) {
    traitScores[trait] = Math.round((traitSums[trait]! / traitCounts[trait]!) * 10) / 10
  }

  // 2. Evaluate each requirement
  const requirements: RequirementResult[] = scenario.requirements.map(req => {
    const traitResults: TraitResult[] = req.traitChecks.map(check => ({
      traitId: check.traitId,
      score: traitScores[check.traitId] ?? 0,
    }))

    const allPassed = req.traitChecks.every(check => {
      const score = traitScores[check.traitId] ?? 0
      return score >= check.minScore
    })

    let explanation: string
    if (allPassed) {
      explanation = `Your architecture meets this requirement.`
    } else {
      const failing = req.traitChecks.filter(check => (traitScores[check.traitId] ?? 0) < check.minScore)
      const details = failing.map(f =>
        `${SIM_TRAIT_LABELS[f.traitId]} score is ${traitScores[f.traitId]?.toFixed(1) ?? '0'}, needs ${f.minScore}+`
      ).join('. ')
      explanation = details + '.'
    }

    return { requirementId: req.id, passed: allPassed, explanation, traitResults }
  })

  const passedCount = requirements.filter(r => r.passed).length

  return { traitScores, requirements, passedCount, totalCount: requirements.length }
}
