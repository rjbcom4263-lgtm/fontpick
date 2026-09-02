import test from 'node:test'
import assert from 'node:assert/strict'
import { diversifyTop } from './diversify.ts'

test('recommendation shelf mixes providers and style groups', () => {
  const providers = ['naver', 'google', 'baemin', 'independent']
  const items = Array.from({ length: 24 }, (_, index) => ({
    id: index,
    score: 96 - Math.floor(index / 4),
    provider: providers[Math.floor(index / 6)],
    group: index < 10 ? 'handwriting' : index < 16 ? 'sans' : index < 20 ? 'serif' : 'display',
  }))
  const ranked = diversifyTop(items, item => item, 12).slice(0, 12)
  const providerCounts = Object.groupBy(ranked, item => item.provider)
  const groupCounts = Object.groupBy(ranked, item => item.group)

  assert.equal(Math.max(...Object.values(providerCounts).map(group => group?.length ?? 0)) <= 4, true)
  assert.equal((groupCounts.handwriting?.length ?? 0) <= 4, true)
  assert.equal(new Set(ranked.map(item => item.group)).size >= 3, true)
})

test('items after the diversified shelf preserve relevance order', () => {
  const items = Array.from({ length: 20 }, (_, index) => ({ id: index, score: 100 - index, provider: 'one', group: 'sans' }))
  const ranked = diversifyTop(items, item => item, 5)
  assert.deepEqual(ranked.slice(5).map(item => item.id), items.filter(item => !ranked.slice(0, 5).includes(item)).map(item => item.id))
})
