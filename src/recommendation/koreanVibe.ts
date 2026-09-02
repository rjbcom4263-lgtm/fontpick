/**
 * Korean-language vibe signal layer for FontPick.
 *
 * Conceptually inspired by situation/tag-based Korean font recommenders,
 * but implemented independently for FontPick's use cases. This module does
 * not copy a third-party catalog; it only converts Korean copy into reusable
 * semantic signals for our ranking engine.
 */

export type VibeProfile = 'product' | 'editorial' | 'playful' | 'impact' | 'neutral'
export type SuggestedPurpose = '로고' | '레이저 각인' | '간판' | '포스터' | 'SNS' | '청첩장'

export type VibeTag =
  | 'warm' | 'emotional' | 'friendly' | 'cute' | 'playful' | 'handwritten'
  | 'clean' | 'minimal' | 'modern' | 'brand' | 'tech' | 'readable'
  | 'editorial' | 'poetic' | 'traditional' | 'culture' | 'luxury' | 'premium'
  | 'impact' | 'campaign' | 'poster' | 'signage' | 'local' | 'street' | 'retro'
  | 'food' | 'wedding' | 'formal' | 'youth'

export interface KoreanVibeAnalysis {
  tags: VibeTag[]
  profile: VibeProfile
  confidence: number
  matchedTerms: string[]
  suggestedPurpose?: SuggestedPurpose
}

type Rule = {
  tag: VibeTag
  terms: string[]
  weight?: number
}

const RULES: Rule[] = [
  { tag: 'warm', terms: ['수고', '고마워', '감사', '사랑', '행복', '응원', '함께', '마음', '따뜻', '포근'], weight: 3 },
  { tag: 'emotional', terms: ['기억', '추억', '그리움', '순간', '바램', '소원', '오늘도', '오래도록', '감성', '서정'], weight: 3 },
  { tag: 'friendly', terms: ['안녕', '우리', '친구', '환영', '동네', '편하게', '친근', '반가워'], weight: 2 },
  { tag: 'cute', terms: ['귀여', '아기', '아이', '냥', '멍', '토끼', '하트', '러블리', '아기자기'], weight: 3 },
  { tag: 'playful', terms: ['놀자', '재미', '신나', '파티', '축제', '맥주', '이벤트', '챌린지', '유쾌'], weight: 3 },
  { tag: 'handwritten', terms: ['손글씨', '필기', '메모', '다이어리', '낙서', '캘리', '편지'], weight: 3 },

  { tag: 'clean', terms: ['깔끔', '정갈', '단정', '심플', '정돈', '깨끗'], weight: 2 },
  { tag: 'minimal', terms: ['미니멀', '절제', '군더더기', '간결'], weight: 3 },
  { tag: 'modern', terms: ['현대적', '모던', '세련', '트렌디', 'studio', 'atelier', 'design'], weight: 2 },
  { tag: 'brand', terms: ['브랜드', '브랜딩', '로고', '시그니처', 'identity', 'brand'], weight: 3 },
  { tag: 'tech', terms: ['테크', '기술', 'ai', 'saas', '스타트업', '개발', '앱', '플랫폼'], weight: 3 },
  { tag: 'readable', terms: ['가독성', '읽기', '본문', '안내문', '설명', '정보'], weight: 2 },

  { tag: 'editorial', terms: ['에디토리얼', '매거진', '잡지', '저널', '에세이', '인터뷰'], weight: 3 },
  { tag: 'poetic', terms: ['시적', '서정', '문학', '시집', '여운', '고요'], weight: 3 },
  { tag: 'traditional', terms: ['전통', '한옥', '민화', '한지', '한국적', '옛'], weight: 3 },
  { tag: 'culture', terms: ['문화', '예술', '작가', '공방', '마을', '전시', '아카이브'], weight: 2 },
  { tag: 'luxury', terms: ['고급', '럭셔리', '하이엔드', '명품', '우아'], weight: 3 },
  { tag: 'premium', terms: ['프리미엄', '시그니처', '한정판', 'premium'], weight: 3 },

  { tag: 'impact', terms: ['강렬', '임팩트', '강한', '주목', '파격', '굵게', 'sale', 'event', 'festival'], weight: 3 },
  { tag: 'campaign', terms: ['캠페인', '행사', '이벤트', '축제', '페스티벌', '프로모션', '세일', '할인', '런칭', 'sale', 'event', 'festival', 'promo', 'promotion'], weight: 3 },
  { tag: 'poster', terms: ['포스터', '전단', '배너', '축제', '페스티벌', 'festival', 'sale', 'event', 'poster', 'banner'], weight: 3 },
  { tag: 'signage', terms: ['간판', '사인', '표지판', '입간판', '매장명'], weight: 3 },
  { tag: 'local', terms: ['로컬', '동네', '골목', '시장', '마을', '지역', '부산', '감천', '다대포'], weight: 2 },
  { tag: 'street', terms: ['거리', '골목', '을지로', '스트리트', '시장'], weight: 2 },
  { tag: 'retro', terms: ['레트로', '복고', '옛날', '빈티지', '오래된'], weight: 3 },
  { tag: 'food', terms: ['맛집', '식당', '메뉴', '푸드', '먹거리', '카페', '커피', '맥주'], weight: 2 },
  { tag: 'wedding', terms: ['결혼', '웨딩', '청첩', '초대합니다', '신랑', '신부', 'wedding'], weight: 4 },
  { tag: 'formal', terms: ['공지', '안내', '귀하', '기념', '공식', '기관', '정책'], weight: 2 },
  { tag: 'youth', terms: ['청년', '학생', '젊은', 'z세대', '키즈', '어린이'], weight: 2 },
]

const PROFILE_WEIGHTS: Record<VibeProfile, Partial<Record<VibeTag, number>>> = {
  product: { clean: 3, minimal: 3, modern: 3, brand: 2, tech: 3, readable: 2, formal: 1 },
  editorial: { editorial: 3, poetic: 3, traditional: 2, culture: 2, luxury: 2, premium: 2, emotional: 1, warm: 1 },
  playful: { playful: 3, cute: 3, friendly: 2, warm: 1, handwritten: 2, food: 2, youth: 2, local: 1 },
  impact: { impact: 3, campaign: 3, poster: 3, signage: 2, street: 2, retro: 2, food: 1, local: 1 },
  neutral: { readable: 2, clean: 2, formal: 1, friendly: 1 },
}

const normalize = (text: string) => text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim()

const inferPurpose = (scores: Map<VibeTag, number>): SuggestedPurpose | undefined => {
  const value = (tag: VibeTag) => scores.get(tag) ?? 0
  const candidates: Array<[SuggestedPurpose, number]> = [
    ['청첩장', value('wedding') * 4 + value('luxury') + value('emotional') + value('warm')],
    ['간판', value('signage') * 4 + value('local') * 1.5 + value('street') + value('impact')],
    ['포스터', value('poster') * 4 + value('campaign') * 2 + value('impact') * 2 + value('playful')],
    ['로고', value('brand') * 4 + value('modern') * 1.5 + value('luxury') + value('minimal')],
    ['SNS', value('playful') * 2 + value('friendly') * 2 + value('cute') * 2 + value('food') + value('youth')],
  ]
  candidates.sort((a, b) => b[1] - a[1])
  return candidates[0][1] >= 7 ? candidates[0][0] : undefined
}

export function vibeLabel(tag: VibeTag): string {
  const labels: Record<VibeTag, string> = {
    warm: '따뜻함', emotional: '감성', friendly: '친근함', cute: '귀여움', playful: '발랄함', handwritten: '손글씨 감성',
    clean: '깔끔함', minimal: '미니멀', modern: '현대적', brand: '브랜드감', tech: '테크', readable: '가독성',
    editorial: '에디토리얼', poetic: '서정적', traditional: '전통적', culture: '문화적', luxury: '고급감', premium: '프리미엄',
    impact: '임팩트', campaign: '캠페인', poster: '포스터성', signage: '간판 적합', local: '로컬감', street: '스트리트', retro: '레트로',
    food: '푸드', wedding: '웨딩', formal: '공식적', youth: '젊은 무드',
  }
  return labels[tag]
}

export function analyzeKoreanVibe(input: string): KoreanVibeAnalysis {
  const text = normalize(input)
  const scores = new Map<VibeTag, number>()
  const matchedTerms: string[] = []

  const strictTerm = (term: string) => {
    const normalizedTerm = term.toLocaleLowerCase()
    if (!['여운', '아이'].includes(normalizedTerm)) return text.includes(normalizedTerm)
    const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const particleOrBoundary = '(?:$|[은는이가을를와과도의에로랑들께서한테에게]|\\s|[.,!?])'
    return new RegExp(`(?:^|[^가-힣])${escaped}(?=${particleOrBoundary})`, 'u').test(text)
  }

  for (const rule of RULES) {
    const matches = rule.terms.filter(strictTerm)
    if (!matches.length) continue
    scores.set(rule.tag, (scores.get(rule.tag) ?? 0) + matches.length * (rule.weight ?? 1))
    matchedTerms.push(...matches)
  }

  const boost = (tag: VibeTag, amount: number) => scores.set(tag, (scores.get(tag) ?? 0) + amount)
  if ((scores.get('wedding') ?? 0) > 0) { boost('warm', 2); boost('emotional', 2); boost('luxury', 1) }
  if ((scores.get('retro') ?? 0) > 0) { boost('street', 1); boost('local', 1) }
  if ((scores.get('food') ?? 0) > 0) { boost('friendly', 1); boost('playful', 1) }
  if ((scores.get('culture') ?? 0) > 0 && (scores.get('local') ?? 0) > 0) boost('traditional', 1)
  if ((scores.get('tech') ?? 0) > 0) { boost('modern', 2); boost('clean', 1) }
  if ((scores.get('brand') ?? 0) > 0) { boost('modern', 1); boost('clean', 1) }
  if ((scores.get('campaign') ?? 0) > 0) { boost('impact', 2); boost('poster', 1) }

  if (!scores.size) {
    scores.set('clean', 1)
    scores.set('modern', 1)
    scores.set('readable', 1)
  }

  const rankedTags = [...scores.entries()].sort((a, b) => b[1] - a[1])
  const tags = rankedTags.slice(0, 8).map(([tag]) => tag)

  const profileScores = (Object.keys(PROFILE_WEIGHTS) as VibeProfile[]).map(profile => {
    const weights = PROFILE_WEIGHTS[profile]
    const score = [...scores.entries()].reduce((sum, [tag, value]) => sum + value * (weights[tag] ?? 0), 0)
    return { profile, score }
  }).sort((a, b) => b.score - a.score)

  const top = profileScores[0]
  const second = profileScores[1]
  const maxTagScore = Math.max(...rankedTags.map(([, score]) => score), 1)
  const separation = Math.max(0, top.score - (second?.score ?? 0))
  const confidence = Math.min(100, Math.round(30 + maxTagScore * 8 + separation * 2))

  return {
    tags,
    profile: top.score > 0 ? top.profile : 'neutral',
    confidence,
    matchedTerms: [...new Set(matchedTerms)].slice(0, 12),
    suggestedPurpose: inferPurpose(scores),
  }
}
