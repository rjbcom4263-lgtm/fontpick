/**
 * BM25 metadata ranker adapted for FontPick.
 *
 * Inspired by the MIT-licensed sliday/google-fonts-skill BM25 approach,
 * but implemented independently in TypeScript and changed to tokenize
 * Unicode letters/numbers so Korean metadata works.
 */
export type BM25Document<T> = {
  item: T
  text: string
}

export type BM25Result<T> = {
  item: T
  score: number
  normalizedScore: number
}

const tokenize = (text: string): string[] =>
  text
    .normalize('NFKC')
    .toLocaleLowerCase()
    .match(/[\p{L}\p{N}]+/gu) ?? []

export function rankBM25<T>(
  documents: BM25Document<T>[],
  query: string,
  k1 = 1.5,
  b = 0.75,
): BM25Result<T>[] {
  if (!documents.length) return []

  const docTokens = documents.map(document => tokenize(document.text))
  const docLengths = docTokens.map(tokens => tokens.length)
  const avgDocLength = docLengths.reduce((sum, length) => sum + length, 0) / documents.length || 1

  const docFreq = new Map<string, number>()
  const termFreqs = docTokens.map(tokens => {
    const frequencies = new Map<string, number>()
    for (const token of tokens) {
      frequencies.set(token, (frequencies.get(token) ?? 0) + 1)
    }
    for (const token of new Set(tokens)) {
      docFreq.set(token, (docFreq.get(token) ?? 0) + 1)
    }
    return frequencies
  })

  const queryTokens = tokenize(query)
  const corpusSize = documents.length

  const rawScores = documents.map((document, index) => {
    let score = 0
    const dl = docLengths[index] || 1
    const frequencies = termFreqs[index]

    for (const token of queryTokens) {
      const tf = frequencies.get(token) ?? 0
      if (!tf) continue

      const df = docFreq.get(token) ?? 0
      const idf = Math.log((corpusSize - df + 0.5) / (df + 0.5) + 1)
      const numerator = tf * (k1 + 1)
      const denominator = tf + k1 * (1 - b + b * dl / avgDocLength)
      score += idf * numerator / denominator
    }

    return { item: document.item, score }
  })

  const maxScore = Math.max(...rawScores.map(result => result.score), 0)

  return rawScores
    .map(result => ({
      ...result,
      normalizedScore: maxScore > 0 ? Math.round((result.score / maxScore) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score)
}
