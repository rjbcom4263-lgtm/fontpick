export interface DiversityCandidate {
  score: number
  provider: string
  group: string
}

/**
 * Re-ranks only the recommendation shelf. The original relevance order after
 * the shelf is preserved, so explicit filters and secondary sort modes stay
 * predictable while the first screen avoids near-duplicate clusters.
 */
export const diversifyTop = <T>(
  items: T[],
  describe: (item: T) => DiversityCandidate,
  shelfSize = 12,
): T[] => {
  const remaining = items.map((item, index) => ({ item, index, ...describe(item) }))
  const selected: typeof remaining = []
  const target = Math.min(shelfSize, remaining.length)

  while (selected.length < target) {
    const providerCounts = new Map<string, number>()
    const groupCounts = new Map<string, number>()
    for (const item of selected) {
      providerCounts.set(item.provider, (providerCounts.get(item.provider) ?? 0) + 1)
      groupCounts.set(item.group, (groupCounts.get(item.group) ?? 0) + 1)
    }

    let bestIndex = 0
    let bestValue = Number.NEGATIVE_INFINITY
    remaining.forEach((candidate, index) => {
      const providerCount = providerCounts.get(candidate.provider) ?? 0
      const groupCount = groupCounts.get(candidate.group) ?? 0
      const recentSameGroup = selected.slice(-3).some(item => item.group === candidate.group)
      const hardProviderPenalty = providerCount >= 4 ? 24 : 0
      const hardGroupPenalty = groupCount >= 5 ? 18 : 0
      const handwritingPenalty = candidate.group === 'handwriting' && groupCount >= 4 ? 22 : 0
      const diversityPenalty = providerCount * 1.4 + groupCount * 2.1 + (recentSameGroup ? 2.5 : 0)
      const value = candidate.score - hardProviderPenalty - hardGroupPenalty - handwritingPenalty - diversityPenalty
      if (value > bestValue || (value === bestValue && candidate.index < remaining[bestIndex].index)) {
        bestValue = value
        bestIndex = index
      }
    })

    selected.push(remaining.splice(bestIndex, 1)[0])
  }

  return [...selected.map(item => item.item), ...remaining.sort((a, b) => a.index - b.index).map(item => item.item)]
}
