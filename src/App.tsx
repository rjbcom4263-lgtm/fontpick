import { useEffect, useState } from 'react'
import { rankBM25 } from './recommendation/bm25'
import { analyzeKoreanVibe, vibeLabel, type KoreanVibeAnalysis, type VibeTag } from './recommendation/koreanVibe'
import { filterCommerciallyApproved } from './recommendation/licenseGate'

type Screen = 'landing' | 'results' | 'compare' | 'download'
type Purpose = '자동' | '로고' | '레이저 각인' | '간판' | '포스터' | 'SNS' | '청첩장'
type EffectivePurpose = Exclude<Purpose, '자동'>
type FilterTag = '감성' | '귀여운' | '전통' | '미니멀' | '손글씨' | '고급' | '강렬' | '현대적' | '고딕' | '명조' | '붓글씨' | '디스플레이'
type SortOption = '추천순' | '감성순' | '가독성순' | '각인용' | '인기순'
type DownloadFormat = 'png' | 'transparent-png' | 'svg' | 'svg-path'
type MoodKey = 'warm' | 'emotional' | 'cute' | 'formal' | 'strong' | 'modern' | 'traditional' | 'playful' | 'friendly' | 'luxury'
type LaserKey = 'stroke' | 'smallText' | 'counter' | 'simplicity'

type MoodProfile = Record<MoodKey, number>
type LaserProfile = Record<LaserKey, number>

interface FontProfile {
  moods: MoodProfile
  styles: FilterTag[]
  readability: number
  smallText: number
  displayStrength: number
  popularity: number
  laser: LaserProfile
  vibeTags: VibeTag[]
  purposes: Record<EffectivePurpose, number>
}

interface FontData {
  id: number
  name: string
  cssClass: string
  score: number
  tags: string[]
  license: string
  commercial: boolean
  modifiable: boolean
  redistribute: boolean
  downloadCount: string
  description: string
  goodFor: string[]
  weight: string
  reasons: string[]
  profile: FontProfile
}

interface TextAnalysis {
  moods: MoodProfile
  detectedPurpose: EffectivePurpose
  length: number
  latinRatio: number
  hasDigits: boolean
  hasSymbols: boolean
  vibe: KoreanVibeAnalysis
}

const FONTS: FontData[] = [
  {
    id: 1, name: 'Noto Sans KR', cssClass: 'preview-noto',
    score: 96, tags: ['미니멀', '현대적', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '2.3만', weight: '500',
    description: '구글이 설계한 범용 한글 폰트. 어떤 사용 환경에서도 최상의 가독성을 제공합니다.',
    goodFor: ['로고', '간판', '포스터', 'SNS'],
    reasons: [],
    profile: {
      moods: { warm: 45, emotional: 35, cute: 20, formal: 75, strong: 45, modern: 92, traditional: 35, playful: 35, friendly: 60, luxury: 55 },
      styles: ['고딕', '미니멀'], readability: 96, smallText: 95, displayStrength: 72, popularity: 95,
      laser: { stroke: 92, smallText: 95, counter: 90, simplicity: 92 },
      vibeTags: ['clean', 'minimal', 'modern', 'readable', 'formal', 'brand'],
      purposes: { '로고': 86, '레이저 각인': 92, '간판': 88, '포스터': 90, 'SNS': 88, '청첩장': 65 },
    },
  },
  {
    id: 2, name: '나눔고딕', cssClass: 'preview-nanum-gothic',
    score: 92, tags: ['친근한', '현대적', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '1.8만', weight: '400',
    description: '네이버가 제공하는 친근하고 읽기 쉬운 고딕 계열 폰트입니다.',
    goodFor: ['SNS', '포스터', '청첩장'],
    reasons: [],
    profile: {
      moods: { warm: 72, emotional: 55, cute: 45, formal: 68, strong: 35, modern: 78, traditional: 40, playful: 50, friendly: 85, luxury: 40 },
      styles: ['고딕'], readability: 93, smallText: 91, displayStrength: 65, popularity: 88,
      laser: { stroke: 88, smallText: 89, counter: 86, simplicity: 90 },
      vibeTags: ['friendly', 'warm', 'clean', 'readable'],
      purposes: { '로고': 76, '레이저 각인': 86, '간판': 78, '포스터': 86, 'SNS': 92, '청첩장': 74 },
    },
  },
  {
    id: 3, name: '나눔명조', cssClass: 'preview-nanum-myeongjo',
    score: 89, tags: ['전통', '고급', '신뢰'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '1.2만', weight: '400',
    description: '클래식하고 신뢰감 있는 명조 계열 폰트. 고급스러운 인쇄물에 잘 어울립니다.',
    goodFor: ['청첩장', '포스터', '로고'],
    reasons: [],
    profile: {
      moods: { warm: 65, emotional: 82, cute: 15, formal: 88, strong: 35, modern: 45, traditional: 92, playful: 20, friendly: 50, luxury: 92 },
      styles: ['명조'], readability: 82, smallText: 68, displayStrength: 75, popularity: 75,
      laser: { stroke: 58, smallText: 55, counter: 62, simplicity: 65 },
      vibeTags: ['editorial', 'poetic', 'traditional', 'culture', 'luxury', 'wedding'],
      purposes: { '로고': 78, '레이저 각인': 55, '간판': 60, '포스터': 82, 'SNS': 68, '청첩장': 96 },
    },
  },
  {
    id: 4, name: 'Black Han Sans', cssClass: 'preview-black-han',
    score: 87, tags: ['강렬', '임팩트', '현대적'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '9.8천', weight: '400',
    description: '굵고 강한 인상을 주는 헤드라인 전용 폰트. 시각적 임팩트가 필요할 때 최적입니다.',
    goodFor: ['간판', '포스터', 'SNS'],
    reasons: [],
    profile: {
      moods: { warm: 25, emotional: 30, cute: 20, formal: 40, strong: 98, modern: 82, traditional: 30, playful: 82, friendly: 35, luxury: 45 },
      styles: ['고딕', '디스플레이'], readability: 60, smallText: 45, displayStrength: 99, popularity: 80,
      laser: { stroke: 80, smallText: 55, counter: 60, simplicity: 86 },
      vibeTags: ['impact', 'campaign', 'poster', 'signage', 'street', 'modern'],
      purposes: { '로고': 90, '레이저 각인': 72, '간판': 98, '포스터': 98, 'SNS': 88, '청첩장': 30 },
    },
  },
  {
    id: 5, name: 'Do Hyeon', cssClass: 'preview-do-hyeon',
    score: 85, tags: ['미니멀', '각인용', '현대적'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '7.4천', weight: '400',
    description: '선명한 윤곽과 균일한 획으로 레이저 각인에 특히 적합한 폰트입니다.',
    goodFor: ['레이저 각인', '로고', '간판'],
    reasons: [],
    profile: {
      moods: { warm: 45, emotional: 40, cute: 30, formal: 55, strong: 75, modern: 82, traditional: 45, playful: 65, friendly: 55, luxury: 50 },
      styles: ['고딕', '디스플레이'], readability: 80, smallText: 82, displayStrength: 90, popularity: 72,
      laser: { stroke: 97, smallText: 90, counter: 92, simplicity: 96 },
      vibeTags: ['impact', 'signage', 'clean', 'modern', 'brand'],
      purposes: { '로고': 92, '레이저 각인': 99, '간판': 94, '포스터': 90, 'SNS': 82, '청첩장': 48 },
    },
  },
  {
    id: 6, name: 'Jua', cssClass: 'preview-jua',
    score: 83, tags: ['귀여운', '친근한', 'SNS'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '6.1천', weight: '400',
    description: '둥글고 귀여운 느낌의 폰트. SNS 콘텐츠와 친근한 브랜딩에 잘 어울립니다.',
    goodFor: ['SNS', '포스터', '청첩장'],
    reasons: [],
    profile: {
      moods: { warm: 82, emotional: 62, cute: 96, formal: 25, strong: 45, modern: 60, traditional: 25, playful: 94, friendly: 95, luxury: 25 },
      styles: ['디스플레이'], readability: 78, smallText: 72, displayStrength: 90, popularity: 78,
      laser: { stroke: 76, smallText: 68, counter: 70, simplicity: 82 },
      vibeTags: ['cute', 'playful', 'friendly', 'food', 'youth'],
      purposes: { '로고': 80, '레이저 각인': 70, '간판': 82, '포스터': 90, 'SNS': 98, '청첩장': 78 },
    },
  },
  {
    id: 7, name: 'IBM Plex Sans KR', cssClass: 'preview-ibm-plex',
    score: 88, tags: ['기술적', '현대적', '미니멀'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '5.3천', weight: '400',
    description: 'IBM이 설계한 테크니컬 산세리프. 브랜드와 UI 텍스트 모두에 탁월합니다.',
    goodFor: ['로고', '간판', '레이저 각인'],
    reasons: [],
    profile: {
      moods: { warm: 35, emotional: 25, cute: 10, formal: 90, strong: 55, modern: 98, traditional: 20, playful: 25, friendly: 35, luxury: 72 },
      styles: ['고딕', '미니멀'], readability: 94, smallText: 93, displayStrength: 75, popularity: 70,
      laser: { stroke: 94, smallText: 92, counter: 88, simplicity: 94 },
      vibeTags: ['tech', 'modern', 'clean', 'brand', 'readable', 'formal'],
      purposes: { '로고': 98, '레이저 각인': 96, '간판': 90, '포스터': 84, 'SNS': 80, '청첩장': 55 },
    },
  },
  {
    id: 8, name: '나눔펜스크립트', cssClass: 'preview-nanum-pen',
    score: 81, tags: ['손글씨', '감성적', '청첩장'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '4.7천', weight: '400',
    description: '손으로 쓴 듯한 자연스러운 필기체. 청첩장, 감성 굿즈에 최적화됩니다.',
    goodFor: ['청첩장', 'SNS', '포스터'],
    reasons: [],
    profile: {
      moods: { warm: 96, emotional: 98, cute: 68, formal: 25, strong: 15, modern: 35, traditional: 48, playful: 55, friendly: 88, luxury: 55 },
      styles: ['손글씨'], readability: 58, smallText: 42, displayStrength: 86, popularity: 65,
      laser: { stroke: 35, smallText: 28, counter: 40, simplicity: 30 },
      vibeTags: ['handwritten', 'warm', 'emotional', 'poetic', 'wedding'],
      purposes: { '로고': 68, '레이저 각인': 25, '간판': 40, '포스터': 78, 'SNS': 92, '청첩장': 99 },
    },
  },
  {
    id: 9, name: "Noto Serif KR", cssClass: "preview-noto-serif",
    score: 85, tags: ["전통", "고급", "가독성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "단정한 본문과 고급스러운 제목에 모두 쓰기 좋은 범용 한글 세리프.",
    goodFor: ["청첩장", "포스터", "로고"],
    reasons: [],
    profile: {
      moods: { warm: 70, emotional: 82, cute: 12, formal: 90, strong: 38, modern: 55, traditional: 88, playful: 18, friendly: 48, luxury: 94 },
      styles: ["명조"], readability: 88, smallText: 76, displayStrength: 78, popularity: 90,
      laser: { stroke: 60, smallText: 62, counter: 68, simplicity: 70 },
      vibeTags: ["editorial", "traditional", "luxury", "formal", "readable", "wedding"],
      purposes: { '로고': 82, '레이저 각인': 58, '간판': 62, '포스터': 84, 'SNS': 70, '청첩장': 94 },
    },
  },
  {
    id: 10, name: "Hahmlet", cssClass: "preview-hahmlet",
    score: 85, tags: ["전통", "고급", "현대적"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "600",
    description: "전통적인 한글 명조의 인상과 현대적인 디스플레이 성격을 함께 가진 세리프.",
    goodFor: ["로고", "포스터", "청첩장"],
    reasons: [],
    profile: {
      moods: { warm: 58, emotional: 78, cute: 10, formal: 84, strong: 56, modern: 72, traditional: 86, playful: 22, friendly: 42, luxury: 92 },
      styles: ["명조", "디스플레이"], readability: 84, smallText: 70, displayStrength: 90, popularity: 82,
      laser: { stroke: 62, smallText: 60, counter: 66, simplicity: 72 },
      vibeTags: ["editorial", "traditional", "luxury", "brand", "premium", "wedding"],
      purposes: { '로고': 90, '레이저 각인': 60, '간판': 68, '포스터': 90, 'SNS': 70, '청첩장': 93 },
    },
  },
  {
    id: 11, name: "Gowun Batang", cssClass: "preview-gowun-batang",
    score: 76, tags: ["감성", "고급", "전통"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "섬세하고 따뜻한 인상의 한글 바탕체. 감성 문구와 웨딩·에디토리얼에 잘 맞음.",
    goodFor: ["청첩장", "SNS", "포스터"],
    reasons: [],
    profile: {
      moods: { warm: 90, emotional: 94, cute: 20, formal: 72, strong: 20, modern: 48, traditional: 78, playful: 28, friendly: 80, luxury: 84 },
      styles: ["명조"], readability: 82, smallText: 65, displayStrength: 76, popularity: 72,
      laser: { stroke: 52, smallText: 50, counter: 60, simplicity: 60 },
      vibeTags: ["warm", "emotional", "editorial", "poetic", "wedding", "traditional"],
      purposes: { '로고': 72, '레이저 각인': 48, '간판': 55, '포스터': 76, 'SNS': 84, '청첩장': 97 },
    },
  },
  {
    id: 12, name: "Gowun Dodum", cssClass: "preview-gowun-dodum",
    score: 77, tags: ["감성", "현대적", "가독성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "손의 움직임이 느껴지는 따뜻한 휴머니스트 산세리프. 친근한 브랜드와 긴 문구에 강함.",
    goodFor: ["SNS", "로고", "레이저 각인"],
    reasons: [],
    profile: {
      moods: { warm: 86, emotional: 74, cute: 45, formal: 62, strong: 30, modern: 70, traditional: 42, playful: 58, friendly: 90, luxury: 45 },
      styles: ["고딕"], readability: 90, smallText: 88, displayStrength: 72, popularity: 70,
      laser: { stroke: 84, smallText: 86, counter: 84, simplicity: 82 },
      vibeTags: ["warm", "friendly", "clean", "readable", "modern"],
      purposes: { '로고': 82, '레이저 각인': 88, '간판': 78, '포스터': 78, 'SNS': 91, '청첩장': 78 },
    },
  },
  {
    id: 13, name: "Song Myung", cssClass: "preview-song-myung",
    score: 74, tags: ["전통", "감성", "고급"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "붓의 결을 절제한 전통 명조 계열. 문화·문학·행사 타이틀에 어울림.",
    goodFor: ["포스터", "청첩장", "로고"],
    reasons: [],
    profile: {
      moods: { warm: 70, emotional: 88, cute: 10, formal: 80, strong: 42, modern: 40, traditional: 96, playful: 20, friendly: 46, luxury: 82 },
      styles: ["명조"], readability: 75, smallText: 58, displayStrength: 84, popularity: 65,
      laser: { stroke: 48, smallText: 45, counter: 58, simplicity: 55 },
      vibeTags: ["traditional", "culture", "editorial", "poetic", "wedding"],
      purposes: { '로고': 80, '레이저 각인': 42, '간판': 60, '포스터': 88, 'SNS': 62, '청첩장': 90 },
    },
  },
  {
    id: 14, name: "Yeon Sung", cssClass: "preview-yeon-sung",
    score: 69, tags: ["손글씨", "전통", "감성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "자연스러운 붓글씨 느낌의 한글 디스플레이 폰트. 로컬·전통·감성 문구에 적합.",
    goodFor: ["포스터", "SNS", "간판"],
    reasons: [],
    profile: {
      moods: { warm: 86, emotional: 92, cute: 42, formal: 30, strong: 55, modern: 35, traditional: 88, playful: 55, friendly: 84, luxury: 45 },
      styles: ["붓글씨", "디스플레이"], readability: 58, smallText: 42, displayStrength: 88, popularity: 62,
      laser: { stroke: 45, smallText: 34, counter: 48, simplicity: 50 },
      vibeTags: ["handwritten", "warm", "emotional", "traditional", "local", "culture"],
      purposes: { '로고': 75, '레이저 각인': 38, '간판': 76, '포스터': 88, 'SNS': 86, '청첩장': 82 },
    },
  },
  {
    id: 15, name: "Gaegu", cssClass: "preview-gaegu",
    score: 72, tags: ["귀여운", "손글씨", "감성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "장난스럽고 친근한 손글씨. 키즈·SNS·가벼운 굿즈 문구에 잘 어울림.",
    goodFor: ["SNS", "포스터", "청첩장"],
    reasons: [],
    profile: {
      moods: { warm: 88, emotional: 70, cute: 95, formal: 18, strong: 32, modern: 40, traditional: 25, playful: 92, friendly: 94, luxury: 18 },
      styles: ["손글씨"], readability: 62, smallText: 45, displayStrength: 86, popularity: 70,
      laser: { stroke: 38, smallText: 30, counter: 42, simplicity: 45 },
      vibeTags: ["cute", "playful", "friendly", "handwritten", "youth"],
      purposes: { '로고': 72, '레이저 각인': 30, '간판': 55, '포스터': 86, 'SNS': 97, '청첩장': 76 },
    },
  },
  {
    id: 16, name: "Single Day", cssClass: "preview-single-day",
    score: 67, tags: ["귀여운", "손글씨", "감성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "가볍고 귀여운 손글씨 디스플레이. 짧은 감성 문구와 SNS에 적합.",
    goodFor: ["SNS", "청첩장", "포스터"],
    reasons: [],
    profile: {
      moods: { warm: 92, emotional: 88, cute: 90, formal: 15, strong: 24, modern: 42, traditional: 28, playful: 82, friendly: 94, luxury: 35 },
      styles: ["손글씨", "디스플레이"], readability: 55, smallText: 38, displayStrength: 88, popularity: 60,
      laser: { stroke: 30, smallText: 25, counter: 38, simplicity: 38 },
      vibeTags: ["cute", "warm", "emotional", "handwritten", "playful"],
      purposes: { '로고': 68, '레이저 각인': 24, '간판': 48, '포스터': 82, 'SNS': 96, '청첩장': 88 },
    },
  },
  {
    id: 17, name: "Gamja Flower", cssClass: "preview-gamja-flower",
    score: 70, tags: ["귀여운", "손글씨", "감성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "동글하고 소박한 손글씨. 따뜻하고 귀여운 짧은 문구에 강함.",
    goodFor: ["SNS", "포스터", "청첩장"],
    reasons: [],
    profile: {
      moods: { warm: 95, emotional: 84, cute: 92, formal: 15, strong: 25, modern: 32, traditional: 35, playful: 85, friendly: 95, luxury: 20 },
      styles: ["손글씨"], readability: 60, smallText: 44, displayStrength: 82, popularity: 68,
      laser: { stroke: 42, smallText: 34, counter: 46, simplicity: 48 },
      vibeTags: ["cute", "warm", "friendly", "handwritten", "playful"],
      purposes: { '로고': 64, '레이저 각인': 34, '간판': 52, '포스터': 80, 'SNS': 96, '청첩장': 82 },
    },
  },
  {
    id: 18, name: "Kirang Haerang", cssClass: "preview-kirang",
    score: 68, tags: ["귀여운", "강렬", "손글씨"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "불규칙하고 유쾌한 손글씨 디스플레이. 행사·푸드·SNS 타이틀에서 존재감이 큼.",
    goodFor: ["포스터", "SNS", "간판"],
    reasons: [],
    profile: {
      moods: { warm: 68, emotional: 52, cute: 88, formal: 10, strong: 70, modern: 42, traditional: 30, playful: 98, friendly: 88, luxury: 15 },
      styles: ["손글씨", "디스플레이"], readability: 48, smallText: 34, displayStrength: 95, popularity: 62,
      laser: { stroke: 50, smallText: 32, counter: 38, simplicity: 55 },
      vibeTags: ["playful", "cute", "handwritten", "impact", "food", "campaign"],
      purposes: { '로고': 72, '레이저 각인': 36, '간판': 78, '포스터': 96, 'SNS': 96, '청첩장': 52 },
    },
  },
  {
    id: 19, name: "Stylish", cssClass: "preview-stylish",
    score: 68, tags: ["손글씨", "현대적", "고급"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "세련된 손글씨 느낌을 가진 디스플레이 폰트. 패션·SNS·브랜드 포인트용.",
    goodFor: ["로고", "포스터", "SNS"],
    reasons: [],
    profile: {
      moods: { warm: 56, emotional: 70, cute: 48, formal: 25, strong: 52, modern: 82, traditional: 30, playful: 62, friendly: 65, luxury: 70 },
      styles: ["손글씨", "디스플레이"], readability: 58, smallText: 42, displayStrength: 90, popularity: 58,
      laser: { stroke: 42, smallText: 32, counter: 45, simplicity: 55 },
      vibeTags: ["handwritten", "modern", "brand", "premium", "playful"],
      purposes: { '로고': 86, '레이저 각인': 34, '간판': 62, '포스터': 90, 'SNS': 88, '청첩장': 70 },
    },
  },
  {
    id: 20, name: "Sunflower", cssClass: "preview-sunflower",
    score: 83, tags: ["현대적", "강렬", "가독성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "500",
    description: "굵기 선택이 가능하고 또렷한 인상의 한글 산세리프. 간판·각인·포스터에 안정적.",
    goodFor: ["레이저 각인", "간판", "포스터"],
    reasons: [],
    profile: {
      moods: { warm: 48, emotional: 38, cute: 42, formal: 65, strong: 78, modern: 80, traditional: 38, playful: 62, friendly: 68, luxury: 42 },
      styles: ["고딕", "디스플레이"], readability: 86, smallText: 82, displayStrength: 90, popularity: 74,
      laser: { stroke: 90, smallText: 84, counter: 86, simplicity: 88 },
      vibeTags: ["clean", "modern", "impact", "signage", "readable"],
      purposes: { '로고': 86, '레이저 각인': 94, '간판': 92, '포스터': 92, 'SNS': 82, '청첩장': 55 },
    },
  },
  {
    id: 21, name: "Hi Melody", cssClass: "preview-hi-melody",
    score: 65, tags: ["귀여운", "손글씨", "감성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "가늘고 발랄한 손글씨. 키즈·일상·감성 SNS 문구에 적합.",
    goodFor: ["SNS", "청첩장", "포스터"],
    reasons: [],
    profile: {
      moods: { warm: 94, emotional: 84, cute: 96, formal: 10, strong: 18, modern: 30, traditional: 26, playful: 90, friendly: 96, luxury: 12 },
      styles: ["손글씨"], readability: 54, smallText: 36, displayStrength: 78, popularity: 64,
      laser: { stroke: 25, smallText: 22, counter: 35, simplicity: 35 },
      vibeTags: ["cute", "warm", "playful", "handwritten", "youth", "friendly"],
      purposes: { '로고': 58, '레이저 각인': 20, '간판': 44, '포스터': 74, 'SNS': 98, '청첩장': 78 },
    },
  },
  {
    id: 22, name: "Poor Story", cssClass: "preview-poor-story",
    score: 62, tags: ["손글씨", "감성", "귀여운"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "서툰 듯 자연스러운 필기감이 매력적인 한글 손글씨. 개인적이고 따뜻한 메시지에 어울림.",
    goodFor: ["SNS", "청첩장", "포스터"],
    reasons: [],
    profile: {
      moods: { warm: 93, emotional: 90, cute: 72, formal: 12, strong: 18, modern: 28, traditional: 32, playful: 70, friendly: 94, luxury: 20 },
      styles: ["손글씨"], readability: 52, smallText: 35, displayStrength: 80, popularity: 56,
      laser: { stroke: 28, smallText: 24, counter: 35, simplicity: 38 },
      vibeTags: ["handwritten", "warm", "emotional", "friendly", "poetic"],
      purposes: { '로고': 56, '레이저 각인': 22, '간판': 42, '포스터': 76, 'SNS': 92, '청첩장': 84 },
    },
  },
  {
    id: 23, name: "Cute Font", cssClass: "preview-cute-font",
    score: 62, tags: ["귀여운", "손글씨"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "작고 귀여운 표정을 가진 손글씨. 짧은 SNS·키즈·굿즈 문구용.",
    goodFor: ["SNS", "포스터", "청첩장"],
    reasons: [],
    profile: {
      moods: { warm: 84, emotional: 66, cute: 99, formal: 8, strong: 15, modern: 28, traditional: 18, playful: 94, friendly: 95, luxury: 10 },
      styles: ["손글씨"], readability: 48, smallText: 32, displayStrength: 82, popularity: 58,
      laser: { stroke: 24, smallText: 20, counter: 30, simplicity: 34 },
      vibeTags: ["cute", "playful", "handwritten", "youth", "friendly"],
      purposes: { '로고': 52, '레이저 각인': 18, '간판': 38, '포스터': 76, 'SNS': 99, '청첩장': 70 },
    },
  },
  {
    id: 24, name: "East Sea Dokdo", cssClass: "preview-east-sea-dokdo",
    score: 67, tags: ["전통", "강렬", "붓글씨"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "빠른 붓터치와 강한 한국적 인상이 특징인 디스플레이 손글씨.",
    goodFor: ["포스터", "간판", "로고"],
    reasons: [],
    profile: {
      moods: { warm: 48, emotional: 68, cute: 20, formal: 20, strong: 85, modern: 25, traditional: 96, playful: 62, friendly: 50, luxury: 35 },
      styles: ["붓글씨", "디스플레이"], readability: 45, smallText: 30, displayStrength: 95, popularity: 62,
      laser: { stroke: 48, smallText: 28, counter: 35, simplicity: 45 },
      vibeTags: ["traditional", "culture", "handwritten", "impact", "local", "signage"],
      purposes: { '로고': 82, '레이저 각인': 34, '간판': 88, '포스터': 96, 'SNS': 72, '청첩장': 54 },
    },
  },
  {
    id: 25, name: "Dokdo", cssClass: "preview-dokdo",
    score: 66, tags: ["전통", "강렬", "붓글씨"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "거친 붓의 힘이 느껴지는 한글 디스플레이. 전통·지역 행사 제목에 강함.",
    goodFor: ["포스터", "간판", "로고"],
    reasons: [],
    profile: {
      moods: { warm: 42, emotional: 58, cute: 18, formal: 18, strong: 92, modern: 22, traditional: 98, playful: 65, friendly: 42, luxury: 30 },
      styles: ["붓글씨", "디스플레이"], readability: 42, smallText: 28, displayStrength: 97, popularity: 60,
      laser: { stroke: 50, smallText: 26, counter: 34, simplicity: 48 },
      vibeTags: ["traditional", "handwritten", "impact", "campaign", "local", "street"],
      purposes: { '로고': 80, '레이저 각인': 36, '간판': 90, '포스터': 98, 'SNS': 70, '청첩장': 45 },
    },
  },
  {
    id: 26, name: "Black And White Picture", cssClass: "preview-bw-picture",
    score: 64, tags: ["감성", "손글씨", "전통"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "붓과 펜 사이의 독특한 질감을 가진 감성 디스플레이 폰트.",
    goodFor: ["포스터", "SNS", "청첩장"],
    reasons: [],
    profile: {
      moods: { warm: 82, emotional: 92, cute: 45, formal: 20, strong: 45, modern: 35, traditional: 70, playful: 55, friendly: 75, luxury: 45 },
      styles: ["손글씨", "디스플레이"], readability: 50, smallText: 32, displayStrength: 88, popularity: 55,
      laser: { stroke: 38, smallText: 26, counter: 40, simplicity: 42 },
      vibeTags: ["handwritten", "emotional", "poetic", "culture", "traditional"],
      purposes: { '로고': 70, '레이저 각인': 28, '간판': 58, '포스터': 88, 'SNS': 84, '청첩장': 86 },
    },
  },
  {
    id: 27, name: "Nanum Brush Script", cssClass: "preview-nanum-brush",
    score: 70, tags: ["감성", "전통", "붓글씨"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "네이버 나눔 계열의 자연스러운 붓글씨. 감성·전통·웨딩 포인트에 적합.",
    goodFor: ["청첩장", "포스터", "SNS"],
    reasons: [],
    profile: {
      moods: { warm: 92, emotional: 98, cute: 42, formal: 20, strong: 38, modern: 28, traditional: 82, playful: 45, friendly: 86, luxury: 58 },
      styles: ["붓글씨", "손글씨"], readability: 52, smallText: 32, displayStrength: 86, popularity: 72,
      laser: { stroke: 32, smallText: 24, counter: 38, simplicity: 40 },
      vibeTags: ["handwritten", "warm", "emotional", "traditional", "wedding", "poetic"],
      purposes: { '로고': 72, '레이저 각인': 26, '간판': 54, '포스터': 84, 'SNS': 88, '청첩장': 96 },
    },
  },
  {
    id: 28, name: "Nanum Gothic Coding", cssClass: "preview-nanum-coding",
    score: 77, tags: ["현대적", "미니멀", "가독성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "고정폭 기반의 또렷한 고딕. 숫자·영문 혼합과 작은 레이저 각인에 강함.",
    goodFor: ["레이저 각인", "로고", "간판"],
    reasons: [],
    profile: {
      moods: { warm: 30, emotional: 22, cute: 10, formal: 88, strong: 45, modern: 88, traditional: 20, playful: 18, friendly: 35, luxury: 48 },
      styles: ["고딕"], readability: 95, smallText: 96, displayStrength: 68, popularity: 68,
      laser: { stroke: 96, smallText: 98, counter: 92, simplicity: 96 },
      vibeTags: ["tech", "clean", "minimal", "readable", "modern", "formal"],
      purposes: { '로고': 88, '레이저 각인': 99, '간판': 88, '포스터': 78, 'SNS': 72, '청첩장': 42 },
    },
  },
  {
    id: 29, name: "Gasoek One", cssClass: "preview-gasoek",
    score: 72, tags: ["강렬", "현대적", "디스플레이"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "꽉 찬 네모꼴과 두꺼운 획으로 강한 인상을 주는 한글 디스플레이.",
    goodFor: ["간판", "포스터", "레이저 각인"],
    reasons: [],
    profile: {
      moods: { warm: 18, emotional: 20, cute: 18, formal: 28, strong: 100, modern: 78, traditional: 38, playful: 82, friendly: 25, luxury: 42 },
      styles: ["고딕", "디스플레이"], readability: 52, smallText: 42, displayStrength: 100, popularity: 66,
      laser: { stroke: 96, smallText: 58, counter: 78, simplicity: 94 },
      vibeTags: ["impact", "poster", "signage", "brand", "modern", "campaign"],
      purposes: { '로고': 92, '레이저 각인': 90, '간판': 99, '포스터': 99, 'SNS': 86, '청첩장': 22 },
    },
  },
  {
    id: 30, name: "Grandiflora One", cssClass: "preview-grandiflora",
    score: 68, tags: ["고급", "감성", "전통"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "아르누보에서 영감을 받은 극세 장식 세리프. 웨딩·럭셔리·문화 타이틀에 특화.",
    goodFor: ["청첩장", "로고", "포스터"],
    reasons: [],
    profile: {
      moods: { warm: 74, emotional: 92, cute: 18, formal: 60, strong: 12, modern: 58, traditional: 82, playful: 18, friendly: 55, luxury: 100 },
      styles: ["명조", "디스플레이"], readability: 54, smallText: 24, displayStrength: 96, popularity: 55,
      laser: { stroke: 12, smallText: 10, counter: 28, simplicity: 30 },
      vibeTags: ["luxury", "premium", "editorial", "poetic", "wedding", "culture"],
      purposes: { '로고': 92, '레이저 각인': 12, '간판': 32, '포스터': 86, 'SNS': 70, '청첩장': 99 },
    },
  },
  {
    id: 31, name: "Dongle", cssClass: "preview-dongle",
    score: 78, tags: ["귀여운", "현대적", "친근한"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "둥글고 친근한 표정의 한글 디스플레이. 캐주얼한 SNS와 로컬 브랜드에 적합.",
    goodFor: ["SNS", "간판", "포스터"],
    reasons: [],
    profile: {
      moods: { warm: 82, emotional: 55, cute: 90, formal: 18, strong: 45, modern: 62, traditional: 22, playful: 90, friendly: 98, luxury: 18 },
      styles: ["고딕", "디스플레이"], readability: 72, smallText: 60, displayStrength: 92, popularity: 70,
      laser: { stroke: 72, smallText: 62, counter: 68, simplicity: 80 },
      vibeTags: ["cute", "playful", "friendly", "local", "food", "youth"],
      purposes: { '로고': 78, '레이저 각인': 68, '간판': 84, '포스터': 90, 'SNS': 98, '청첩장': 60 },
    },
  },
  {
    id: 32, name: "Bagel Fat One", cssClass: "preview-bagel-fat",
    score: 76, tags: ["귀여운", "강렬", "디스플레이"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "매우 두껍고 둥근 획이 특징인 귀여운 디스플레이. 짧은 굿즈·포스터·간판 문구에 강함.",
    goodFor: ["포스터", "간판", "SNS"],
    reasons: [],
    profile: {
      moods: { warm: 68, emotional: 40, cute: 98, formal: 12, strong: 88, modern: 68, traditional: 18, playful: 98, friendly: 85, luxury: 18 },
      styles: ["고딕", "디스플레이"], readability: 58, smallText: 48, displayStrength: 100, popularity: 72,
      laser: { stroke: 94, smallText: 60, counter: 78, simplicity: 92 },
      vibeTags: ["cute", "playful", "impact", "poster", "food", "campaign"],
      purposes: { '로고': 88, '레이저 각인': 88, '간판': 96, '포스터': 99, 'SNS': 96, '청첩장': 38 },
    },
  },
  {
    id: 33, name: "Diphylleia", cssClass: "preview-diphylleia",
    score: 68, tags: ["감성", "고급", "전통"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "감성적인 가사와 꽃의 이미지를 반영한 섬세한 붓 계열 세리프.",
    goodFor: ["청첩장", "포스터", "SNS"],
    reasons: [],
    profile: {
      moods: { warm: 86, emotional: 100, cute: 18, formal: 48, strong: 35, modern: 42, traditional: 78, playful: 22, friendly: 64, luxury: 88 },
      styles: ["명조", "붓글씨"], readability: 64, smallText: 38, displayStrength: 88, popularity: 52,
      laser: { stroke: 28, smallText: 22, counter: 38, simplicity: 42 },
      vibeTags: ["emotional", "poetic", "editorial", "traditional", "luxury", "wedding"],
      purposes: { '로고': 82, '레이저 각인': 22, '간판': 48, '포스터': 86, 'SNS': 78, '청첩장': 98 },
    },
  },
  {
    id: 34, name: "Orbit", cssClass: "preview-orbit",
    score: 77, tags: ["현대적", "미니멀", "기술적"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "코딩 폰트의 인상을 한글에 옮긴 기하학적·미래적 서체. 작은 UI와 테크 브랜딩에 적합.",
    goodFor: ["로고", "레이저 각인", "간판"],
    reasons: [],
    profile: {
      moods: { warm: 18, emotional: 22, cute: 8, formal: 72, strong: 52, modern: 100, traditional: 18, playful: 20, friendly: 30, luxury: 72 },
      styles: ["고딕", "디스플레이"], readability: 92, smallText: 96, displayStrength: 80, popularity: 60,
      laser: { stroke: 92, smallText: 96, counter: 88, simplicity: 94 },
      vibeTags: ["tech", "modern", "clean", "minimal", "brand", "readable"],
      purposes: { '로고': 98, '레이저 각인': 97, '간판': 88, '포스터': 84, 'SNS': 78, '청첩장': 42 },
    },
  },
  {
    id: 35, name: "Gothic A1", cssClass: "preview-gothic-a1",
    score: 83, tags: ["현대적", "미니멀", "가독성"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "폭넓은 웨이트와 안정적인 가독성을 가진 한글 고딕. 범용 UI·간판·각인에 적합.",
    goodFor: ["레이저 각인", "로고", "간판"],
    reasons: [],
    profile: {
      moods: { warm: 38, emotional: 30, cute: 15, formal: 82, strong: 48, modern: 90, traditional: 30, playful: 28, friendly: 52, luxury: 55 },
      styles: ["고딕", "미니멀"], readability: 95, smallText: 94, displayStrength: 74, popularity: 82,
      laser: { stroke: 93, smallText: 94, counter: 90, simplicity: 93 },
      vibeTags: ["clean", "modern", "readable", "minimal", "formal", "brand"],
      purposes: { '로고': 92, '레이저 각인': 97, '간판': 92, '포스터': 86, 'SNS': 84, '청첩장': 56 },
    },
  },
  {
    id: 36, name: "Gugi", cssClass: "preview-gugi",
    score: 73, tags: ["강렬", "귀여운", "현대적"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "굵고 독특한 조형을 가진 한글 디스플레이. 로컬·게임·이벤트 분위기에 강함.",
    goodFor: ["포스터", "간판", "로고"],
    reasons: [],
    profile: {
      moods: { warm: 42, emotional: 34, cute: 72, formal: 12, strong: 88, modern: 72, traditional: 35, playful: 92, friendly: 62, luxury: 22 },
      styles: ["고딕", "디스플레이"], readability: 58, smallText: 48, displayStrength: 98, popularity: 65,
      laser: { stroke: 86, smallText: 56, counter: 70, simplicity: 90 },
      vibeTags: ["impact", "playful", "poster", "signage", "brand", "local"],
      purposes: { '로고': 92, '레이저 각인': 82, '간판': 96, '포스터': 98, 'SNS': 90, '청첩장': 34 },
    },
  },
  {
    id: 37, name: "Batang", cssClass: "preview-batang",
    score: 70, tags: ["전통", "고급", "신뢰"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "클래식한 한국어 바탕체 인상을 가진 세리프. 전통·공식·인쇄 문구에 적합.",
    goodFor: ["청첩장", "포스터", "로고"],
    reasons: [],
    profile: {
      moods: { warm: 55, emotional: 64, cute: 8, formal: 96, strong: 28, modern: 30, traditional: 100, playful: 10, friendly: 28, luxury: 78 },
      styles: ["명조"], readability: 82, smallText: 68, displayStrength: 68, popularity: 62,
      laser: { stroke: 54, smallText: 56, counter: 62, simplicity: 68 },
      vibeTags: ["traditional", "formal", "editorial", "culture", "wedding"],
      purposes: { '로고': 72, '레이저 각인': 54, '간판': 58, '포스터': 76, 'SNS': 52, '청첩장': 90 },
    },
  },
  {
    id: 38, name: "Dotum", cssClass: "preview-dotum",
    score: 72, tags: ["현대적", "가독성", "미니멀"],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: "400",
    description: "오래 검증된 한국어 고딕 계열. 작은 글자와 정보성 문구에서 높은 안정성을 보임.",
    goodFor: ["레이저 각인", "간판", "로고"],
    reasons: [],
    profile: {
      moods: { warm: 35, emotional: 28, cute: 10, formal: 90, strong: 38, modern: 74, traditional: 48, playful: 20, friendly: 45, luxury: 36 },
      styles: ["고딕"], readability: 94, smallText: 95, displayStrength: 62, popularity: 60,
      laser: { stroke: 94, smallText: 96, counter: 90, simplicity: 94 },
      vibeTags: ["readable", "clean", "formal", "minimal"],
      purposes: { '로고': 80, '레이저 각인': 98, '간판': 90, '포스터': 72, 'SNS': 76, '청첩장': 52 },
    },
  },
  {
    id: 39, name: 'Gulim', cssClass: 'preview-gulim',
    score: 72, tags: ['현대적', '가독성', '친근한'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '400',
    description: '둥근 인상의 전통 한국어 고딕 계열. 정보성 문구와 레트로·로컬 간판에 안정적입니다.',
    goodFor: ['간판', '레이저 각인', 'SNS'], reasons: [],
    profile: {
      moods: { warm: 58, emotional: 36, cute: 35, formal: 72, strong: 35, modern: 60, traditional: 58, playful: 45, friendly: 70, luxury: 30 },
      styles: ['고딕'], readability: 91, smallText: 90, displayStrength: 64, popularity: 58,
      laser: { stroke: 90, smallText: 90, counter: 88, simplicity: 91 },
      vibeTags: ['friendly', 'readable', 'retro', 'local', 'clean'],
      purposes: { '로고': 72, '레이저 각인': 92, '간판': 90, '포스터': 74, 'SNS': 80, '청첩장': 48 },
    },
  },
  {
    id: 40, name: 'GulimChe', cssClass: 'preview-gulimche',
    score: 70, tags: ['레트로', '가독성', '각인용'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '400',
    description: '고정폭 느낌이 강한 굴림 계열. 번호·영문 혼합 각인과 레트로 정보 디자인에 유용합니다.',
    goodFor: ['레이저 각인', '간판', '포스터'], reasons: [],
    profile: {
      moods: { warm: 40, emotional: 26, cute: 20, formal: 78, strong: 42, modern: 52, traditional: 58, playful: 35, friendly: 48, luxury: 22 },
      styles: ['고딕'], readability: 88, smallText: 92, displayStrength: 62, popularity: 48,
      laser: { stroke: 94, smallText: 94, counter: 90, simplicity: 94 },
      vibeTags: ['retro', 'readable', 'formal', 'street', 'local'],
      purposes: { '로고': 64, '레이저 각인': 96, '간판': 86, '포스터': 72, 'SNS': 62, '청첩장': 38 },
    },
  },
  {
    id: 41, name: 'DotumChe', cssClass: 'preview-dotumche',
    score: 71, tags: ['미니멀', '가독성', '각인용'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '400',
    description: '각 글자 폭이 안정적인 돋움 계열. 작은 글자·전화번호·영문 혼합 각인에 강합니다.',
    goodFor: ['레이저 각인', '간판', '로고'], reasons: [],
    profile: {
      moods: { warm: 28, emotional: 20, cute: 8, formal: 92, strong: 38, modern: 68, traditional: 48, playful: 18, friendly: 35, luxury: 28 },
      styles: ['고딕', '미니멀'], readability: 95, smallText: 97, displayStrength: 60, popularity: 50,
      laser: { stroke: 96, smallText: 98, counter: 92, simplicity: 96 },
      vibeTags: ['readable', 'clean', 'formal', 'minimal', 'tech'],
      purposes: { '로고': 76, '레이저 각인': 99, '간판': 88, '포스터': 68, 'SNS': 68, '청첩장': 40 },
    },
  },
  {
    id: 42, name: 'BatangChe', cssClass: 'preview-batangche',
    score: 69, tags: ['전통', '고급', '각인용'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '400',
    description: '고정폭 성격을 가진 바탕 계열. 전통적인 분위기의 이름·기념 문구에 어울립니다.',
    goodFor: ['청첩장', '레이저 각인', '포스터'], reasons: [],
    profile: {
      moods: { warm: 50, emotional: 62, cute: 6, formal: 94, strong: 28, modern: 28, traditional: 98, playful: 8, friendly: 26, luxury: 76 },
      styles: ['명조'], readability: 80, smallText: 72, displayStrength: 66, popularity: 44,
      laser: { stroke: 68, smallText: 72, counter: 72, simplicity: 74 },
      vibeTags: ['traditional', 'formal', 'editorial', 'culture', 'wedding'],
      purposes: { '로고': 70, '레이저 각인': 70, '간판': 56, '포스터': 74, 'SNS': 48, '청첩장': 88 },
    },
  },
  {
    id: 43, name: 'Gungsuh', cssClass: 'preview-gungsuh',
    score: 70, tags: ['전통', '붓글씨', '강렬'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '400',
    description: '붓의 인상이 강한 전통 계열. 문화행사·전통 간판·짧은 타이틀에서 존재감이 큽니다.',
    goodFor: ['간판', '포스터', '로고'], reasons: [],
    profile: {
      moods: { warm: 55, emotional: 82, cute: 5, formal: 78, strong: 72, modern: 18, traditional: 100, playful: 18, friendly: 30, luxury: 74 },
      styles: ['붓글씨', '디스플레이'], readability: 62, smallText: 40, displayStrength: 92, popularity: 52,
      laser: { stroke: 52, smallText: 38, counter: 54, simplicity: 42 },
      vibeTags: ['traditional', 'culture', 'impact', 'poster', 'signage', 'poetic'],
      purposes: { '로고': 82, '레이저 각인': 48, '간판': 92, '포스터': 90, 'SNS': 60, '청첩장': 78 },
    },
  },
  {
    id: 44, name: 'GungsuhChe', cssClass: 'preview-gungsuhche',
    score: 67, tags: ['전통', '붓글씨', '레트로'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '400',
    description: '전통 궁서의 고정폭 계열. 짧은 문화·레트로 문구와 특정 각인 스타일에 적합합니다.',
    goodFor: ['포스터', '간판', '청첩장'], reasons: [],
    profile: {
      moods: { warm: 48, emotional: 78, cute: 4, formal: 82, strong: 66, modern: 12, traditional: 100, playful: 12, friendly: 24, luxury: 70 },
      styles: ['붓글씨', '디스플레이'], readability: 58, smallText: 42, displayStrength: 88, popularity: 40,
      laser: { stroke: 58, smallText: 44, counter: 58, simplicity: 48 },
      vibeTags: ['traditional', 'retro', 'culture', 'poster', 'formal'],
      purposes: { '로고': 76, '레이저 각인': 54, '간판': 86, '포스터': 86, 'SNS': 48, '청첩장': 80 },
    },
  },
  {
    id: 45, name: '42dot Sans', cssClass: 'preview-42dot-sans',
    score: 86, tags: ['현대적', '미니멀', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '500',
    description: '42dot이 설계한 현대적 산세리프. UI·브랜드·차량/테크 성격의 짧은 문구에 강합니다.',
    goodFor: ['로고', '레이저 각인', '간판'], reasons: [],
    profile: {
      moods: { warm: 36, emotional: 25, cute: 10, formal: 88, strong: 54, modern: 99, traditional: 14, playful: 28, friendly: 42, luxury: 70 },
      styles: ['고딕', '미니멀'], readability: 95, smallText: 94, displayStrength: 80, popularity: 70,
      laser: { stroke: 95, smallText: 94, counter: 92, simplicity: 96 },
      vibeTags: ['modern', 'clean', 'minimal', 'tech', 'brand', 'readable'],
      purposes: { '로고': 97, '레이저 각인': 97, '간판': 92, '포스터': 84, 'SNS': 82, '청첩장': 52 },
    },
  },
  {
    id: 46, name: 'Asta Sans', cssClass: 'preview-asta-sans',
    score: 84, tags: ['현대적', '미니멀', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '500',
    description: '화면 본문과 브랜드 문구에 균형 있게 사용할 수 있는 현대적인 한글 산세리프.',
    goodFor: ['로고', '레이저 각인', 'SNS'], reasons: [],
    profile: {
      moods: { warm: 42, emotional: 32, cute: 14, formal: 84, strong: 52, modern: 94, traditional: 24, playful: 30, friendly: 55, luxury: 62 },
      styles: ['고딕', '미니멀'], readability: 95, smallText: 94, displayStrength: 76, popularity: 62,
      laser: { stroke: 94, smallText: 95, counter: 91, simplicity: 94 },
      vibeTags: ['clean', 'minimal', 'modern', 'readable', 'formal', 'brand'],
      purposes: { '로고': 92, '레이저 각인': 97, '간판': 90, '포스터': 86, 'SNS': 88, '청첩장': 58 },
    },
  },
  {
    id: 47, name: 'Moirai One', cssClass: 'preview-moirai-one',
    score: 72, tags: ['강렬', '귀여운', '디스플레이'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: 'Google Fonts', weight: '400',
    description: '선으로 짠 듯한 독특한 형태가 짧은 로고와 문화 행사 제목에서 돋보이는 디스플레이 폰트.',
    goodFor: ['로고', '포스터', '간판'], reasons: [],
    profile: {
      moods: { warm: 35, emotional: 48, cute: 74, formal: 12, strong: 84, modern: 88, traditional: 35, playful: 94, friendly: 58, luxury: 55 },
      styles: ['디스플레이'], readability: 45, smallText: 24, displayStrength: 99, popularity: 58,
      laser: { stroke: 32, smallText: 20, counter: 48, simplicity: 38 },
      vibeTags: ['impact', 'playful', 'poster', 'culture', 'brand', 'modern'],
      purposes: { '로고': 96, '레이저 각인': 25, '간판': 82, '포스터': 96, 'SNS': 88, '청첩장': 48 },
    },
  },
  {
    id: 48, name: 'Pretendard', cssClass: 'preview-pretendard',
    score: 94, tags: ['현대적', '미니멀', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 CDN', weight: '500',
    description: '한국어 디지털 환경에 최적화된 범용 산세리프. UI, 본문, 브랜드 문구 모두에 안정적.',
    goodFor: ['로고', '레이저 각인', '간판', 'SNS'], reasons: [],
    profile: {
      moods: { warm: 48, emotional: 32, cute: 12, formal: 88, strong: 50, modern: 98, traditional: 20, playful: 28, friendly: 58, luxury: 70 },
      styles: ['고딕', '미니멀'], readability: 98, smallText: 98, displayStrength: 80, popularity: 98,
      laser: { stroke: 96, smallText: 98, counter: 94, simplicity: 96 },
      vibeTags: ['clean', 'minimal', 'modern', 'readable', 'formal', 'brand', 'tech'],
      purposes: { '로고': 97, '레이저 각인': 98, '간판': 94, '포스터': 90, 'SNS': 94, '청첩장': 62 },
    },
  },
  {
    id: 49, name: 'SUIT', cssClass: 'preview-suit',
    score: 91, tags: ['현대적', '미니멀', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 CDN', weight: '500',
    description: '반복되는 UI와 본문 환경에서 높은 완성도를 유지하도록 설계된 깔끔한 한글 산세리프.',
    goodFor: ['로고', '레이저 각인', 'SNS'], reasons: [],
    profile: {
      moods: { warm: 45, emotional: 30, cute: 12, formal: 90, strong: 48, modern: 98, traditional: 18, playful: 24, friendly: 52, luxury: 72 },
      styles: ['고딕', '미니멀'], readability: 98, smallText: 98, displayStrength: 78, popularity: 88,
      laser: { stroke: 95, smallText: 98, counter: 94, simplicity: 96 },
      vibeTags: ['clean', 'minimal', 'modern', 'readable', 'formal', 'tech', 'brand'],
      purposes: { '로고': 96, '레이저 각인': 98, '간판': 92, '포스터': 88, 'SNS': 93, '청첩장': 58 },
    },
  },
  {
    id: 50, name: 'Wanted Sans', cssClass: 'preview-wanted-sans',
    score: 90, tags: ['현대적', '강렬', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 CDN', weight: '600',
    description: '기하학적인 인상과 읽기 쉬운 구조를 함께 갖춘 제목·본문 겸용 브랜드 산세리프.',
    goodFor: ['로고', '간판', '포스터'], reasons: [],
    profile: {
      moods: { warm: 38, emotional: 28, cute: 16, formal: 84, strong: 72, modern: 98, traditional: 18, playful: 38, friendly: 48, luxury: 75 },
      styles: ['고딕', '미니멀'], readability: 96, smallText: 94, displayStrength: 88, popularity: 84,
      laser: { stroke: 94, smallText: 94, counter: 92, simplicity: 95 },
      vibeTags: ['modern', 'brand', 'clean', 'readable', 'impact', 'tech'],
      purposes: { '로고': 99, '레이저 각인': 96, '간판': 96, '포스터': 94, 'SNS': 90, '청첩장': 55 },
    },
  },
  {
    id: 51, name: 'Spoqa Han Sans Neo', cssClass: 'preview-spoqa',
    score: 89, tags: ['현대적', '가독성', '친근한'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 CDN', weight: '400',
    description: '숫자와 다국어 조화가 좋고 작은 화면에서도 균일하게 읽히는 서비스용 산세리프.',
    goodFor: ['SNS', '레이저 각인', '로고'], reasons: [],
    profile: {
      moods: { warm: 55, emotional: 34, cute: 18, formal: 86, strong: 42, modern: 94, traditional: 20, playful: 28, friendly: 68, luxury: 60 },
      styles: ['고딕', '미니멀'], readability: 98, smallText: 98, displayStrength: 72, popularity: 86,
      laser: { stroke: 94, smallText: 98, counter: 94, simplicity: 95 },
      vibeTags: ['clean', 'modern', 'readable', 'friendly', 'formal', 'tech'],
      purposes: { '로고': 92, '레이저 각인': 97, '간판': 88, '포스터': 86, 'SNS': 96, '청첩장': 62 },
    },
  },
  {
    id: 52, name: 'Maru Buri', cssClass: 'preview-maru-buri',
    score: 86, tags: ['감성', '고급', '가독성'],
    license: 'NAVER Open Font License', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 배포', weight: '400',
    description: '화면에서 긴 글을 편안하게 읽도록 만든 네이버의 부리계열 본문 글꼴.',
    goodFor: ['청첩장', '포스터', 'SNS'], reasons: [],
    profile: {
      moods: { warm: 82, emotional: 90, cute: 12, formal: 86, strong: 28, modern: 65, traditional: 82, playful: 18, friendly: 62, luxury: 92 },
      styles: ['명조'], readability: 94, smallText: 82, displayStrength: 78, popularity: 82,
      laser: { stroke: 58, smallText: 62, counter: 68, simplicity: 70 },
      vibeTags: ['editorial', 'poetic', 'traditional', 'readable', 'luxury', 'wedding'],
      purposes: { '로고': 82, '레이저 각인': 58, '간판': 64, '포스터': 88, 'SNS': 78, '청첩장': 98 },
    },
  },
  {
    id: 53, name: 'Nanum Square', cssClass: 'preview-nanum-square',
    score: 87, tags: ['현대적', '강렬', '가독성'],
    license: 'NAVER Open Font License', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 배포', weight: '700',
    description: '제목을 선명하게 만드는 네이버의 직선적인 산세리프. 브랜드와 간판에 강함.',
    goodFor: ['로고', '간판', '포스터'], reasons: [],
    profile: {
      moods: { warm: 42, emotional: 30, cute: 18, formal: 82, strong: 78, modern: 94, traditional: 20, playful: 36, friendly: 50, luxury: 66 },
      styles: ['고딕', '미니멀'], readability: 92, smallText: 88, displayStrength: 92, popularity: 88,
      laser: { stroke: 94, smallText: 90, counter: 90, simplicity: 94 },
      vibeTags: ['modern', 'brand', 'clean', 'impact', 'signage', 'readable'],
      purposes: { '로고': 97, '레이저 각인': 95, '간판': 98, '포스터': 95, 'SNS': 88, '청첩장': 52 },
    },
  },
  {
    id: 54, name: 'Gmarket Sans', cssClass: 'preview-gmarket-sans',
    score: 86, tags: ['현대적', '강렬', '친근한'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 배포', weight: '500',
    description: '기하학적이고 또렷한 인상에 자연스러운 필순을 더한 대중적인 브랜드 산세리프.',
    goodFor: ['로고', '포스터', '간판'], reasons: [],
    profile: {
      moods: { warm: 52, emotional: 32, cute: 24, formal: 68, strong: 82, modern: 94, traditional: 18, playful: 58, friendly: 70, luxury: 55 },
      styles: ['고딕', '디스플레이'], readability: 90, smallText: 84, displayStrength: 94, popularity: 90,
      laser: { stroke: 94, smallText: 86, counter: 88, simplicity: 94 },
      vibeTags: ['modern', 'brand', 'impact', 'poster', 'friendly', 'signage'],
      purposes: { '로고': 98, '레이저 각인': 94, '간판': 98, '포스터': 98, 'SNS': 92, '청첩장': 48 },
    },
  },
  {
    id: 55, name: 'D2Coding', cssClass: 'preview-d2coding',
    score: 85, tags: ['기술적', '미니멀', '가독성'],
    license: 'SIL OFL 1.1', commercial: true, modifiable: true, redistribute: true,
    downloadCount: '공식 웹폰트', weight: '400',
    description: '한글·영문·숫자의 구분과 정렬에 최적화된 네이버 고정폭 폰트.',
    goodFor: ['레이저 각인', '로고', '간판'], reasons: [],
    profile: {
      moods: { warm: 22, emotional: 18, cute: 8, formal: 82, strong: 48, modern: 94, traditional: 18, playful: 20, friendly: 30, luxury: 52 },
      styles: ['고딕', '미니멀'], readability: 98, smallText: 99, displayStrength: 72, popularity: 84,
      laser: { stroke: 96, smallText: 99, counter: 94, simplicity: 96 },
      vibeTags: ['tech', 'modern', 'clean', 'minimal', 'readable', 'formal'],
      purposes: { '로고': 90, '레이저 각인': 99, '간판': 90, '포스터': 82, 'SNS': 82, '청첩장': 42 },
    },
  },
]


const DYNAMIC_GOOGLE_FONT_SPECS: Record<string, string> = {
  'preview-noto-serif': 'Noto+Serif+KR:wght@400;700',
  'preview-hahmlet': 'Hahmlet:wght@400;600;700',
  'preview-gowun-batang': 'Gowun+Batang',
  'preview-gowun-dodum': 'Gowun+Dodum',
  'preview-song-myung': 'Song+Myung',
  'preview-yeon-sung': 'Yeon+Sung',
  'preview-gaegu': 'Gaegu',
  'preview-single-day': 'Single+Day',
  'preview-gamja-flower': 'Gamja+Flower',
  'preview-kirang': 'Kirang+Haerang',
  'preview-stylish': 'Stylish',
  'preview-sunflower': 'Sunflower:wght@300;500;700',
  'preview-hi-melody': 'Hi+Melody',
  'preview-poor-story': 'Poor+Story',
  'preview-cute-font': 'Cute+Font',
  'preview-east-sea-dokdo': 'East+Sea+Dokdo',
  'preview-dokdo': 'Dokdo',
  'preview-bw-picture': 'Black+And+White+Picture',
  'preview-nanum-brush': 'Nanum+Brush+Script',
  'preview-nanum-coding': 'Nanum+Gothic+Coding:wght@400;700',
  'preview-gasoek': 'Gasoek+One',
  'preview-grandiflora': 'Grandiflora+One',
  'preview-dongle': 'Dongle',
  'preview-bagel-fat': 'Bagel+Fat+One',
  'preview-diphylleia': 'Diphylleia',
  'preview-orbit': 'Orbit',
  'preview-gothic-a1': 'Gothic+A1:wght@400;700',
  'preview-gugi': 'Gugi',
  'preview-gulim': 'Gulim',
  'preview-42dot-sans': '42dot+Sans:wght@400;500;700',
  'preview-dotum': 'Dotum',
  'preview-asta-sans': 'Asta+Sans:wght@400;500;700',
  'preview-moirai-one': 'Moirai+One',
}

const DYNAMIC_FONT_STYLESHEETS: Record<string, string> = {
  'preview-pretendard': 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css',
  'preview-suit': 'https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/static/woff2/SUIT.css',
  'preview-wanted-sans': 'https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/static/split/WantedSans.min.css',
  'preview-spoqa': 'https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css',
  'preview-maru-buri': 'https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri/MaruBuri.css',
  'preview-nanum-square': 'https://cdn.jsdelivr.net/gh/hiun/NanumSquare/nanumsquare.css',
  'preview-gmarket-sans': 'https://cdn.jsdelivr.net/gh/fonts-archive/GmarketSans/GmarketSans.css',
}

const PURPOSES: Purpose[] = ['자동', '로고', '레이저 각인', '간판', '포스터', 'SNS', '청첩장']
const MOOD_FILTERS: FilterTag[] = ['감성', '귀여운', '고급', '강렬', '현대적']
const STYLE_FILTERS: FilterTag[] = ['고딕', '명조', '손글씨', '붓글씨', '디스플레이']
const SORT_OPTIONS: SortOption[] = ['추천순', '감성순', '가독성순', '각인용', '인기순']
const DOWNLOAD_FORMATS: { key: DownloadFormat; label: string; desc: string }[] = [
  { key: 'png', label: 'PNG', desc: '흰 배경 포함 PNG 이미지' },
  { key: 'transparent-png', label: '투명 PNG', desc: '배경 없는 투명 PNG' },
  { key: 'svg', label: 'SVG', desc: '편집 가능한 SVG 텍스트' },
  { key: 'svg-path', label: '고정형 SVG', desc: '폰트 없이 모양 유지' },
]
const DOWNLOAD_SIZES = ['1920×400', '1200×300', '800×200', '400×100', '커스텀']

const DOWNLOAD_DIMENSIONS: Record<string, [number, number]> = {
  '1920×400': [1920, 400],
  '1200×300': [1200, 300],
  '800×200': [800, 200],
  '400×100': [400, 100],
  '커스텀': [1920, 400],
}

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

const safeFileName = (value: string) => value
  .trim()
  .replace(/[\\/:*?"<>|]+/g, '-')
  .replace(/\s+/g, '-')
  .slice(0, 60) || 'fontpick'

const resolveFontFamily = (cssClass: string) => {
  const probe = document.createElement('span')
  probe.className = cssClass
  probe.textContent = '가A'
  probe.style.position = 'fixed'
  probe.style.left = '-9999px'
  document.body.appendChild(probe)
  const family = getComputedStyle(probe).fontFamily
  probe.remove()
  return family || 'sans-serif'
}

const renderTextCanvas = async (
  text: string,
  font: FontData,
  width: number,
  height: number,
  transparent: boolean,
) => {
  const family = resolveFontFamily(font.cssClass)
  await document.fonts.load(`${font.weight} 64px ${family}`, text)
  await document.fonts.ready

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('이 브라우저에서는 이미지 캔버스를 만들 수 없습니다.')

  if (!transparent) {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }

  let size = Math.max(20, Math.floor(height * 0.46))
  context.font = `${font.weight} ${size}px ${family}`
  const maxWidth = width * 0.88
  const measured = context.measureText(text).width
  if (measured > maxWidth) {
    size = Math.max(12, Math.floor(size * (maxWidth / measured)))
    context.font = `${font.weight} ${size}px ${family}`
  }
  context.fillStyle = '#0f172a'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, width / 2, height / 2, maxWidth)
  return { canvas, family, size }
}

const exportFontArtwork = async (
  text: string,
  font: FontData,
  format: DownloadFormat,
  sizeLabel: string,
) => {
  const [width, height] = DOWNLOAD_DIMENSIONS[sizeLabel] ?? DOWNLOAD_DIMENSIONS['1920×400']
  const baseName = `${safeFileName(text)}-${safeFileName(font.name)}-${width}x${height}`

  if (format === 'png' || format === 'transparent-png') {
    const { canvas } = await renderTextCanvas(text, font, width, height, format === 'transparent-png')
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('PNG 파일 생성에 실패했습니다.')
    return { blob, fileName: `${baseName}.png` }
  }

  if (format === 'svg-path') {
    const { canvas } = await renderTextCanvas(text, font, width, height, true)
    const dataUrl = canvas.toDataURL('image/png')
    const fixedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${escapeXml(text)} · ${escapeXml(font.name)}</title><image href="${dataUrl}" width="${width}" height="${height}"/></svg>`
    return {
      blob: new Blob([fixedSvg], { type: 'image/svg+xml;charset=utf-8' }),
      fileName: `${baseName}-fixed.svg`,
    }
  }

  const family = resolveFontFamily(font.cssClass)
  await document.fonts.load(`${font.weight} 64px ${family}`, text)
  const fontSize = Math.max(20, Math.floor(height * 0.46))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${escapeXml(text)} · ${escapeXml(font.name)}</title><rect width="100%" height="100%" fill="#ffffff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#0f172a" font-family="${escapeXml(family)}" font-size="${fontSize}" font-weight="${escapeXml(font.weight)}">${escapeXml(text)}</text></svg>`
  return {
    blob: new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
    fileName: `${baseName}.svg`,
  }
}

const MOOD_LABELS: Record<MoodKey, string> = {
  warm: '따뜻함', emotional: '감성', cute: '귀여움', formal: '정중함', strong: '강렬함',
  modern: '현대적', traditional: '전통적', playful: '활기', friendly: '친근함', luxury: '고급감',
}

const MOOD_KEYWORDS: Record<MoodKey, string[]> = {
  warm: ['수고', '사랑', '고마워', '감사', '행복', '좋은 하루', '함께', '축하', '환영', '응원'],
  emotional: ['기억', '그리움', '마음', '오늘도', '오래', '순간', '추억', '사랑', '바램', '소원'],
  cute: ['귀여', '아기', '아이', '생일', '친구', '냥', '멍', '토끼', '하트'],
  formal: ['안내', '공지', '귀하', '환영합니다', '감사합니다', '결혼합니다', '초대합니다', '기념'],
  strong: ['축제', '맥주', '화이팅', '파이팅', '최고', '맛집', 'sale', 'open', 'festival', 'event'],
  modern: ['design', 'studio', 'atelier', 'brand', 'saegim', 'tech', 'lab', 'coffee', 'cafe'],
  traditional: ['전통', '한국', '한옥', '문화', '마을', '민화', '한지', '부산', '감천'],
  playful: ['축제', '맥주', '파티', '놀자', '즐거', '이벤트', 'festival', 'party', 'event'],
  friendly: ['안녕', '수고', '고마워', '우리', '함께', '친구', '좋은', '환영', '사랑'],
  luxury: ['프리미엄', '명품', '고급', '기념', '웨딩', 'wedding', 'atelier', 'signature'],
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value))

const detectPurpose = (text: string, moods: MoodProfile, latinRatio: number, length: number): EffectivePurpose => {
  const lower = text.toLowerCase()
  const has = (words: string[]) => words.some(word => lower.includes(word))

  if (has(['레이저', '각인', 'engrave', 'engraving'])) return '레이저 각인'
  if (has(['청첩', '결혼', '웨딩', 'wedding', '초대합니다', 'save the date'])) return '청첩장'
  if (has(['인스타', 'instagram', 'sns', '릴스', '피드'])) return 'SNS'
  if (has(['축제', 'festival', '행사', '공연', '콘서트', '이벤트', 'event', '맥주'])) return '포스터'
  if (has(['간판', '매장', '맛집', '카페', '공방', '문화마을', '마을', '식당', 'bakery', 'cafe'])) return '간판'
  if (has(['로고', '브랜드', 'studio', 'atelier', 'company', 'brand'])) return '로고'
  if (latinRatio > 0.65 && length <= 12) return '로고'
  if (length <= 6 && moods.modern + moods.strong >= 120) return '로고'
  if (moods.warm + moods.emotional + moods.friendly >= 140) return 'SNS'
  return '포스터'
}

const VIBE_MOOD_BOOSTS: Partial<Record<VibeTag, Partial<Record<MoodKey, number>>>> = {
  warm: { warm: 14, emotional: 5, friendly: 5 },
  emotional: { emotional: 16, warm: 5 },
  friendly: { friendly: 14, warm: 5 },
  cute: { cute: 18, playful: 8, friendly: 5 },
  playful: { playful: 16, strong: 5 },
  handwritten: { emotional: 10, warm: 8 },
  modern: { modern: 14 },
  clean: { modern: 5, formal: 4 },
  brand: { modern: 8, luxury: 3 },
  tech: { modern: 14, formal: 5 },
  editorial: { emotional: 8, formal: 4, luxury: 5 },
  poetic: { emotional: 14, warm: 4 },
  traditional: { traditional: 18, formal: 4 },
  culture: { traditional: 8, emotional: 4 },
  luxury: { luxury: 18, formal: 7 },
  premium: { luxury: 12, modern: 4 },
  impact: { strong: 18, playful: 4 },
  campaign: { strong: 12, playful: 8 },
  poster: { strong: 10, playful: 6 },
  local: { traditional: 6, friendly: 6 },
  retro: { traditional: 10, playful: 4 },
  food: { friendly: 8, playful: 8, warm: 4 },
  wedding: { emotional: 12, warm: 10, luxury: 8, formal: 8 },
  formal: { formal: 12 },
}

const analyzeText = (rawText: string): TextAnalysis => {
  const text = rawText.trim()
  const lower = text.toLowerCase()
  const compact = text.replace(/\s/g, '')
  const vibe = analyzeKoreanVibe(text)
  const base: MoodProfile = {
    warm: 30, emotional: 28, cute: 18, formal: 28, strong: 22,
    modern: 40, traditional: 18, playful: 22, friendly: 35, luxury: 22,
  }

  ;(Object.keys(MOOD_KEYWORDS) as MoodKey[]).forEach(key => {
    const hits = MOOD_KEYWORDS[key].filter(word => lower.includes(word)).length
    base[key] = clamp(base[key] + hits * 18)
  })

  for (const tag of vibe.tags) {
    const boosts = VIBE_MOOD_BOOSTS[tag]
    if (!boosts) continue
    for (const [key, value] of Object.entries(boosts) as [MoodKey, number][]) {
      base[key] = clamp(base[key] + value)
    }
  }

  if (/[!！]/.test(text)) {
    base.strong = clamp(base.strong + 14)
    base.playful = clamp(base.playful + 12)
  }
  if (/[♡♥❤✨😊🎉🎂]/.test(text)) {
    base.warm = clamp(base.warm + 12)
    base.cute = clamp(base.cute + 15)
    base.playful = clamp(base.playful + 10)
  }

  const latinCount = (text.match(/[A-Za-z]/g) || []).length
  const visibleCount = Math.max((text.match(/[^\s]/g) || []).length, 1)
  const latinRatio = latinCount / visibleCount
  const uppercaseLatin = (text.match(/[A-Z]/g) || []).length
  if (latinRatio > 0.55) base.modern = clamp(base.modern + 24)
  if (uppercaseLatin >= 3) {
    base.modern = clamp(base.modern + 12)
    base.strong = clamp(base.strong + 8)
  }
  if (compact.length >= 16) {
    base.formal = clamp(base.formal + 10)
    base.strong = clamp(base.strong - 6)
  }

  const keywordPurpose = detectPurpose(text, base, latinRatio, compact.length)
  const detectedPurpose = vibe.suggestedPurpose && vibe.confidence >= 58 ? vibe.suggestedPurpose : keywordPurpose
  return {
    moods: base,
    detectedPurpose,
    length: compact.length,
    latinRatio,
    hasDigits: /\d/.test(text),
    hasSymbols: /[^\w\s가-힣]/.test(text),
    vibe,
  }
}

const PURPOSE_SEARCH_TERMS: Record<EffectivePurpose, string[]> = {
  '로고': ['logo', 'brand', 'identity', 'display', 'modern'],
  '레이저 각인': ['laser', 'engraving', 'stroke', 'smalltext', 'counter', 'simple', 'durable'],
  '간판': ['signage', 'sign', 'display', 'bold', 'readable'],
  '포스터': ['poster', 'headline', 'display', 'bold', 'expressive', 'impact', 'campaign'],
  'SNS': ['social', 'friendly', 'casual', 'expressive', 'content'],
  '청첩장': ['wedding', 'invitation', 'elegant', 'emotional', 'warm'],
}

const fontSearchDocument = (font: FontData) => {
  const moodTerms = (Object.keys(font.profile.moods) as MoodKey[]).flatMap(key => {
    const strength = font.profile.moods[key]
    const repeats = strength >= 85 ? 3 : strength >= 65 ? 2 : strength >= 45 ? 1 : 0
    return Array.from({ length: repeats }, () => key)
  })

  const purposeTerms = (Object.keys(font.profile.purposes) as EffectivePurpose[]).flatMap(key => {
    const strength = font.profile.purposes[key]
    const repeats = strength >= 90 ? 3 : strength >= 75 ? 2 : strength >= 60 ? 1 : 0
    return Array.from({ length: repeats }, () => PURPOSE_SEARCH_TERMS[key]).flat()
  })

  const laserTerms = font.profile.laser.stroke >= 85 && font.profile.laser.smallText >= 80
    ? ['laser', 'engraving', 'stroke', 'smalltext']
    : []

  const readabilityTerms = font.profile.readability >= 88 ? ['readable', 'body', 'smalltext'] : []
  const displayTerms = font.profile.displayStrength >= 88 ? ['display', 'headline', 'bold'] : []

  return [
    font.name,
    ...font.tags,
    ...font.goodFor,
    ...font.profile.styles,
    ...font.profile.vibeTags,
    ...moodTerms,
    ...purposeTerms,
    ...laserTerms,
    ...readabilityTerms,
    ...displayTerms,
  ].join(' ')
}

const semanticQuery = (analysis: TextAnalysis, purpose: EffectivePurpose) => {
  const topMoods = (Object.keys(analysis.moods) as MoodKey[])
    .filter(key => analysis.moods[key] >= 55)
    .sort((a, b) => analysis.moods[b] - analysis.moods[a])
    .slice(0, 4)

  const lengthTerms = analysis.length <= 7
    ? ['short', 'display', 'headline']
    : analysis.length >= 14
      ? ['long', 'readable', 'body', 'smalltext']
      : ['readable']

  const scriptTerms = analysis.latinRatio > 0.55 ? ['latin', 'modern'] : ['korean']

  return [
    ...topMoods,
    ...analysis.vibe.tags,
    analysis.vibe.profile,
    ...PURPOSE_SEARCH_TERMS[purpose],
    ...PURPOSE_SEARCH_TERMS[purpose],
    ...lengthTerms,
    ...scriptTerms,
  ].join(' ')
}

const semanticScores = (fonts: FontData[], analysis: TextAnalysis, purpose: EffectivePurpose) => {
  const ranked = rankBM25(
    fonts.map(font => ({ item: font.id, text: fontSearchDocument(font) })),
    semanticQuery(analysis, purpose),
  )
  return new Map(ranked.map(result => [result.item, result.normalizedScore]))
}

const moodMatchScore = (analysis: MoodProfile, font: MoodProfile) => {
  const keys = Object.keys(analysis) as MoodKey[]
  const important = keys.filter(key => analysis[key] >= 45)
  const selected = important.length ? important : keys
  const weighted = selected.reduce((sum, key) => sum + (analysis[key] / 100) * font[key], 0)
  const weight = selected.reduce((sum, key) => sum + analysis[key] / 100, 0)
  return weight ? weighted / weight : 50
}

const laserAverage = (laser: LaserProfile) => (laser.stroke + laser.smallText + laser.counter + laser.simplicity) / 4

const topMoodMatches = (analysis: MoodProfile, font: MoodProfile) =>
  (Object.keys(analysis) as MoodKey[])
    .map(key => ({ key, value: (analysis[key] / 100) * font[key] }))
    .sort((a, b) => b.value - a.value)

const buildReasons = (font: FontData, analysis: TextAnalysis, purpose: EffectivePurpose): string[] => {
  const reasons: string[] = []
  const add = (reason: string) => { if (!reasons.includes(reason)) reasons.push(reason) }

  if (purpose === '레이저 각인') {
    const laserReasons: { key: LaserKey; label: string }[] = [
      { key: 'stroke', label: '획 안정성이 높아 각인에 유리' },
      { key: 'smallText', label: '작은 글자에서도 형태가 잘 유지됨' },
      { key: 'counter', label: '내부 공간이 넓어 뭉침 위험이 낮음' },
      { key: 'simplicity', label: '윤곽이 단순해 벡터 각인에 유리' },
    ]
    laserReasons
      .sort((a, b) => font.profile.laser[b.key] - font.profile.laser[a.key])
      .slice(0, 2)
      .forEach(item => add(item.label))
  }

  if (analysis.length >= 14 && font.profile.readability >= 82) add('긴 문구에서도 가독성을 유지함')
  if (analysis.length <= 7 && font.profile.displayStrength >= 85) add('짧은 문구에서 개성이 잘 드러남')
  if (font.profile.purposes[purpose] >= 88) add(`${purpose} 용도와 특히 잘 맞음`)

  const matchedVibe = analysis.vibe.tags.find(tag => font.profile.vibeTags.includes(tag))
  if (matchedVibe) add(`${vibeLabel(matchedVibe)} 성격이 문구와 잘 맞음`)

  const mood = topMoodMatches(analysis.moods, font.profile.moods)[0]
  if (mood && mood.value >= 28) add(`${MOOD_LABELS[mood.key]} 분위기와 잘 맞음`)

  if (font.profile.readability >= 90) add('작은 크기에서도 가독성이 우수함')
  if (reasons.length < 3) add('상업용 라이선스가 확인된 폰트')
  if (reasons.length < 3) add('한글 문구를 안정적으로 표현함')
  return reasons.slice(0, 3)
}

const scoreFonts = (fonts: FontData[], analysis: TextAnalysis, purpose: EffectivePurpose): FontData[] => {
  const semantic = semanticScores(fonts, analysis, purpose)

  return fonts.map(font => {
    const mood = moodMatchScore(analysis.moods, font.profile.moods)
    const purposeScore = font.profile.purposes[purpose]
    const lengthFit = analysis.length >= 14
      ? font.profile.readability
      : analysis.length <= 7
        ? (font.profile.displayStrength * 0.65 + font.profile.readability * 0.35)
        : (font.profile.readability * 0.7 + font.profile.displayStrength * 0.3)
    const laser = laserAverage(font.profile.laser)
    const semanticScore = semantic.get(font.id) ?? 0

    let raw: number
    if (purpose === '레이저 각인') {
      const codingAdjustment = font.name === 'Nanum Gothic Coding'
        ? (analysis.hasDigits || analysis.latinRatio > 0.25 ? 3 : analysis.length <= 7 ? -5 : -3)
        : 0
      raw = mood * 0.05 + purposeScore * 0.22 + lengthFit * 0.06 + laser * 0.45 + font.score * 0.05 + font.profile.popularity * 0.02 + semanticScore * 0.15 + codingAdjustment
    } else if (purpose === '포스터') {
      raw = mood * 0.16 + purposeScore * 0.28 + font.profile.displayStrength * 0.20 + font.profile.smallText * 0.01 + font.score * 0.04 + font.profile.popularity * 0.04 + semanticScore * 0.27
    } else if (purpose === '간판') {
      raw = mood * 0.15 + purposeScore * 0.28 + font.profile.displayStrength * 0.15 + font.profile.readability * 0.10 + font.score * 0.04 + font.profile.popularity * 0.04 + semanticScore * 0.24
    } else if (purpose === '로고') {
      raw = mood * 0.16 + purposeScore * 0.28 + font.profile.displayStrength * 0.14 + font.profile.readability * 0.05 + font.score * 0.04 + font.profile.popularity * 0.04 + semanticScore * 0.29
    } else if (purpose === '청첩장') {
      raw = mood * 0.28 + purposeScore * 0.27 + lengthFit * 0.07 + font.profile.smallText * 0.02 + font.score * 0.04 + font.profile.popularity * 0.04 + semanticScore * 0.28
    } else {
      raw = mood * 0.28 + purposeScore * 0.25 + lengthFit * 0.09 + font.profile.smallText * 0.04 + font.score * 0.05 + font.profile.popularity * 0.06 + semanticScore * 0.23
    }

    const score = Math.round(clamp(raw))
    return { ...font, score, reasons: buildReasons(font, analysis, purpose) }
  })
}

const filterMatches = (font: FontData, filter: FilterTag) => {
  if (font.tags.some(tag => tag.includes(filter)) || font.profile.styles.includes(filter)) return true
  if (filter === '감성') return font.profile.moods.emotional >= 65
  if (filter === '귀여운') return font.profile.moods.cute >= 65
  if (filter === '고급') return font.profile.moods.luxury >= 65
  if (filter === '강렬') return font.profile.moods.strong >= 70
  if (filter === '현대적') return font.profile.moods.modern >= 70
  if (filter === '전통') return font.profile.moods.traditional >= 70
  return false
}

const sortFonts = (fonts: FontData[], sortBy: SortOption) => [...fonts].sort((a, b) => {
  if (sortBy === '감성순') return (b.profile.moods.emotional + b.profile.moods.warm) - (a.profile.moods.emotional + a.profile.moods.warm)
  if (sortBy === '가독성순') return b.profile.readability - a.profile.readability
  if (sortBy === '각인용') return laserAverage(b.profile.laser) - laserAverage(a.profile.laser)
  if (sortBy === '인기순') return b.profile.popularity - a.profile.popularity
  return b.score - a.score
})

const getAnalysisHighlights = (analysis: TextAnalysis) =>
  (Object.keys(analysis.moods) as MoodKey[])
    .map(key => ({ label: MOOD_LABELS[key], value: analysis.moods[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)

const ScoreRing = ({ score }: { score: number }) => (
  <div
    className="relative flex flex-col items-center gap-0.5 cursor-default"
    title="문구 분위기 · 용도 · 가독성 · 제작 적합도를 종합한 점수"
  >
    <div className="relative w-11 h-11 flex items-center justify-center">
      <svg className="absolute inset-0" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#E2E8F0" strokeWidth="3" />
        <circle
          cx="22" cy="22" r="18" fill="none" stroke="#1D4ED8" strokeWidth="3"
          strokeDasharray={`${(score / 100) * 113.1} 113.1`}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="font-mono text-[11px] font-semibold text-slate-800">{score}%</span>
    </div>
    <span className="text-[9px] text-slate-400 leading-none">적합도</span>
  </div>
)

const LicenseBadge = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${ok ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
    <span>{ok ? '✓' : '—'}</span>{label}
  </span>
)

const TagChip = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-base cursor-pointer
      ${active
        ? 'bg-slate-900 text-white border-slate-900'
        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
      }`}
  >
    {label}
  </button>
)

interface FontCardProps {
  font: FontData
  previewText: string
  liked: boolean
  selected: boolean
  onLike: () => void
  onSelect: () => void
  onCompare: () => void
  onDownload: (format: DownloadFormat) => void
}

const FontCard = ({ font, previewText, liked, selected, onLike, onSelect, onCompare, onDownload }: FontCardProps) => (
  <div className={`group bg-white border rounded-xl overflow-hidden transition-base hover:shadow-md hover:-translate-y-0.5 ${selected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
    <div className="px-5 pt-5 pb-4 bg-slate-50 border-b border-slate-100 min-h-[100px] flex items-center justify-center">
      <p
        className={`${font.cssClass} text-center leading-tight text-slate-900 break-all`}
        style={{ fontSize: '2.25rem', fontWeight: font.weight as any }}
      >
        {previewText}
      </p>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate">{font.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{font.license}</p>
        </div>
        <ScoreRing score={font.score} />
      </div>
      <div className="flex flex-wrap gap-1">
        {font.tags.map(t => (
          <span key={t} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{t}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        <LicenseBadge ok={font.commercial} label="상업용" />
        <LicenseBadge ok={font.modifiable} label="수정" />
        <LicenseBadge ok={font.redistribute} label="재배포" />
      </div>
      <div className="pt-1 space-y-0.5 border-t border-slate-100">
        {font.reasons.slice(0, 3).map(r => (
          <p key={r} className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-blue-500 font-bold leading-none">✓</span>{r}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-1.5 pt-1">
        <button
          onClick={() => onDownload('png')}
          className="flex-1 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-base"
        >
          PNG
        </button>
        <button
          onClick={() => onDownload('svg')}
          className="flex-1 py-2 text-xs font-semibold border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-base"
        >
          SVG
        </button>
        <button
          onClick={onCompare}
          className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-base"
          title="비교하기"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 16 16">
            <path d="M2 4h5M2 8h5M2 12h5M9 4h5M9 8h5M9 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          onClick={onLike}
          className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-base"
        >
          <svg className={`w-3.5 h-3.5 ${liked ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} viewBox="0 0 16 16" fill="none">
            <path d="M8 13.5S2 9.5 2 5.5A3 3 0 0 1 8 3.9 3 3 0 0 1 14 5.5c0 4-6 8-6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={onSelect}
          className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-base ${selected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
          title="선택"
        >
          <svg className={`w-3.5 h-3.5 ${selected ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 16 16">
            <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)

const AdBanner = ({ className = '' }: { className?: string }) => (
  <div className={`bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center ${className}`}>
    <p className="text-xs text-slate-300 font-mono">AD</p>
  </div>
)

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [inputText, setInputText] = useState('')
  const [purpose, setPurpose] = useState<Purpose>('자동')
  const [activeFilters, setActiveFilters] = useState<FilterTag[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('추천순')
  const [likedFonts, setLikedFonts] = useState<number[]>([])
  const [selectedFonts, setSelectedFonts] = useState<number[]>([])
  const [compareFont, setCompareFont] = useState<FontData | null>(null)
  const [downloadFont, setDownloadFont] = useState<FontData | null>(null)
  const [fontSize, setFontSize] = useState(56)
  const [bgMode, setBgMode] = useState<'white' | 'dark' | 'transparent'>('white')
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('png')
  const [downloadSize, setDownloadSize] = useState('1920×400')
  const [downloadDone, setDownloadDone] = useState(false)
  const [downloadBusy, setDownloadBusy] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadFileName, setDownloadFileName] = useState('')

  const previewText = inputText.trim() || '가나다라마바사'
  const analysis = analyzeText(previewText)
  const effectivePurpose: EffectivePurpose = purpose === '자동' ? analysis.detectedPurpose : purpose
  const approvedFonts = filterCommerciallyApproved(FONTS)
  const rankedFonts = scoreFonts(approvedFonts, analysis, effectivePurpose)
  const analysisHighlights = getAnalysisHighlights(analysis)
  const displayFonts = sortFonts(
    rankedFonts.filter(font => activeFilters.length === 0 || activeFilters.every(filter => filterMatches(font, filter))),
    sortBy,
  ).slice(0, 8)


  const fontsNeededForCurrentScreen = [
    ...displayFonts,
    ...(downloadFont ? [downloadFont] : []),
    ...(compareFont ? [compareFont] : []),
  ]

  const dynamicFontKey = [...new Set(fontsNeededForCurrentScreen
    .map(font => DYNAMIC_GOOGLE_FONT_SPECS[font.cssClass])
    .filter(Boolean))]
    .sort()
    .join('|')

  const dynamicStylesheetKey = [...new Set(fontsNeededForCurrentScreen
    .map(font => DYNAMIC_FONT_STYLESHEETS[font.cssClass])
    .filter(Boolean))]
    .sort()
    .join('|')

  useEffect(() => {
    if (!dynamicFontKey) {
      document.getElementById('fontpick-google-fonts')?.remove()
      return
    }
    const specs = dynamicFontKey.split('|')
    const id = 'fontpick-google-fonts'
    const existing = document.getElementById(id) as HTMLLinkElement | null
    const link = existing ?? document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?${specs.map(spec => `family=${spec}`).join('&')}&display=swap`
    if (!existing) document.head.appendChild(link)
  }, [dynamicFontKey])

  useEffect(() => {
    const activeUrls = dynamicStylesheetKey ? dynamicStylesheetKey.split('|') : []
    document.querySelectorAll<HTMLLinkElement>('link[data-fontpick-font="external"]').forEach(link => {
      if (!activeUrls.includes(link.href)) link.remove()
    })
    for (const href of activeUrls) {
      const id = `fontpick-css-${href.replace(/[^a-z0-9]+/gi, '-').slice(-120)}`
      if (document.getElementById(id)) continue
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = href
      link.crossOrigin = 'anonymous'
      link.dataset.fontpickFont = 'external'
      document.head.appendChild(link)
    }
  }, [dynamicStylesheetKey])

  useEffect(() => () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
  }, [downloadUrl])

  const toggleFilter = (f: FilterTag) => {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }
  const toggleLike = (id: number) => {
    setLikedFonts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  const toggleSelect = (id: number) => {
    setSelectedFonts(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) return [...prev.slice(1), id]
      return [...prev, id]
    })
  }

  const handleSearch = () => {
    if (!inputText.trim()) return
    setScreen('results')
  }

  const goCompare = (font: FontData) => {
    setCompareFont(font)
    setScreen('compare')
  }
  const goDownload = (font: FontData, format: DownloadFormat = 'png') => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setDownloadFont(font)
    setDownloadFormat(format)
    setDownloadDone(false)
    setDownloadError('')
    setDownloadUrl('')
    setDownloadFileName('')
    setScreen('download')
  }

  const handleFileDownload = async (font: FontData) => {
    setDownloadBusy(true)
    setDownloadError('')
    try {
      const file = await exportFontArtwork(previewText, font, downloadFormat, downloadSize)
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
      const url = URL.createObjectURL(file.blob)
      setDownloadUrl(url)
      setDownloadFileName(file.fileName)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = file.fileName
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setDownloadDone(true)
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : '파일 생성 중 오류가 발생했습니다.')
    } finally {
      setDownloadBusy(false)
    }
  }

  const Header = ({ minimal = false }: { minimal?: boolean }) => (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={() => setScreen('landing')} className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs leading-none">가</span>
          </div>
          <span className="font-display font-semibold text-slate-900 text-[15px]">폰트픽</span>
          <span className="font-body text-[10px] text-slate-400 hidden sm:block">FontPick</span>
        </button>
        {!minimal && (
          <nav className="hidden md:flex items-center gap-1">
            {['폰트 찾기', '추천', '라이선스', '가이드'].map(item => (
              <button
                key={item}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-base"
              >
                {item}
              </button>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2">
          {screen === 'results' && selectedFonts.length > 0 && (
            <button
              onClick={() => goCompare(rankedFonts.find(f => f.id === selectedFonts[0])!)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-base"
            >
              <span>비교하기</span>
              <span className="bg-slate-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">{selectedFonts.length}</span>
            </button>
          )}
          <button
            onClick={() => setScreen('landing')}
            className="px-4 py-1.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-base"
          >
            무료 시작
          </button>
        </div>
      </div>
    </header>
  )

  // ── LANDING ───────────────────────────────────────────────────────────────
  if (screen === 'landing') return (
    <div className="min-h-screen bg-white font-body">
      <Header />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-6 border border-blue-100">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          상업용 라이선스 확인 폰트만 추천
        </div>
        <h1 className="font-display text-4xl md:text-[52px] font-bold text-slate-900 leading-[1.15] tracking-tight mb-5">
          내 문구에 가장 어울리는<br className="hidden md:block" />
          <span className="text-blue-700"> 폰트</span>를 찾아보세요
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          상업적으로 사용 가능한 폰트를 자동 추천하고<br className="hidden md:block" />
          PNG / SVG로 바로 다운로드하세요
        </p>

        {/* Main input */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-base">
          <div className="flex items-center px-5 py-4 gap-3">
            <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 20 20">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="문구를 입력하세요 · 예) 강남구 맛집, 홍길동 결혼합니다"
              className="flex-1 text-base text-slate-900 placeholder:text-slate-400 outline-none bg-transparent font-body"
            />
            <button
              onClick={handleSearch}
              disabled={!inputText.trim()}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-base disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              자동 추천 →
            </button>
          </div>
        </div>

        {/* Purpose chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {PURPOSES.map(p => (
            <TagChip
              key={p}
              label={p === '자동' ? (purpose === '자동' && inputText ? `✨ 자동 분석 · ${analysis.detectedPurpose} 추천` : '✨ 자동 분석') : p}
              active={purpose === p}
              onClick={() => setPurpose(p)}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400">사용 목적을 선택하면 더 정확한 폰트를 추천해드려요</p>
      </section>

      {/* Ad banner */}
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <AdBanner className="h-16" />
      </div>

      {/* Live preview strip */}
      <section className="border-y border-slate-100 py-8 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-slate-400 font-mono mb-4 text-center tracking-widest uppercase">Font Preview</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FONTS.slice(0, 4).map(f => (
              <div key={f.id} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-sm transition-base">
                <p className={`${f.cssClass} text-2xl text-slate-900 mb-2 leading-tight`} style={{ fontWeight: f.weight as any }}>
                  {inputText || '안녕하세요'}
                </p>
                <p className="text-xs text-slate-500">{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase text-center mb-10">왜 폰트픽인가요?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: '✓', title: '상업용 무료 폰트만', desc: '모든 추천 폰트는 상업적 사용이 허가된 공개 라이선스 폰트입니다.' },
            { icon: '◎', title: '분위기 기반 자동 추천', desc: '입력한 문구의 맥락과 사용 목적을 분석해 어울리는 폰트를 추천합니다.' },
            { icon: '↓', title: 'PNG / SVG 다운로드', desc: '바로 사용 가능한 고해상도 이미지와 벡터 파일로 즉시 내보내기.' },
            { icon: '⊙', title: '레이저 각인용 필터', desc: '균일한 획과 선명한 윤곽을 가진 레이저 각인 최적 폰트만 필터링.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-base">
              <span className="font-mono text-blue-700 text-lg block mb-3">{icon}</span>
              <h3 className="font-display font-semibold text-slate-900 text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample CTA */}
      <section className="bg-slate-900 py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">지금 바로 내 문구에 맞는 폰트를 찾아보세요</h2>
          <p className="text-slate-400 text-sm mb-6">회원가입 없이 무료로 이용 가능합니다</p>
          <button
            onClick={() => { setInputText(''); setScreen('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-base"
          >
            무료로 시작하기 →
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        <p>© 2026 폰트픽 FontPick · 상업용 무료 폰트 자동 추천 서비스 ·
          <button className="underline ml-1 hover:text-slate-600">라이선스 안내</button>
        </p>
      </footer>
    </div>
  )

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === 'results') return (
    <div className="min-h-screen bg-slate-50 font-body">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Top bar */}
        <div className="mb-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-3 p-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex items-center gap-2 flex-1 max-w-md">
                <span className="text-xs text-slate-500">문구</span>
                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 text-sm font-medium text-slate-900 outline-none bg-transparent"
                />
              </div>
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-700">{displayFonts.length}개</span> 폰트 추천
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 md:pb-0">
              {SORT_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-base ${sortBy === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {/* Analysis strip */}
          <div className={`px-4 py-2.5 border-t flex items-center gap-2 flex-wrap ${purpose === '레이저 각인' ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'}`}>
            {effectivePurpose === '레이저 각인' ? (
              <>
                <span className="text-[11px] font-semibold text-orange-700">레이저 각인 분석</span>
                <span className="text-slate-300 text-xs">·</span>
                {['획 안정성', '작은 글자 가독성', '내부 공간', '단순한 윤곽'].map(c => (
                  <span key={c} className="text-[11px] text-orange-600 flex items-center gap-0.5">
                    <span className="font-bold">✓</span>{c}
                  </span>
                ))}
                <span className="text-slate-300 text-xs">·</span>
                <span className="text-[11px] text-orange-500">기준 반영</span>
              </>
            ) : (
              <>
                <span className="text-[11px] font-semibold text-slate-500">문구 분석</span>
                <span className="text-slate-300 text-xs">·</span>
                {analysisHighlights.map(({ label, value }) => (
                  <span key={label} className="text-[11px] text-slate-600">
                    {label} <span className="font-semibold text-slate-800">{value}%</span>
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-44 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl p-4 sticky top-20">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">분위기</p>
              <div className="flex flex-col gap-1 mb-4">
                {MOOD_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`text-left px-3 py-1.5 rounded-lg text-sm transition-base ${activeFilters.includes(f) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">스타일</p>
              <div className="flex flex-col gap-1">
                {STYLE_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`text-left px-3 py-1.5 rounded-lg text-sm transition-base ${activeFilters.includes(f) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="mt-3 w-full text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  필터 초기화
                </button>
              )}
            </div>
            <AdBanner className="h-48 mt-4" />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 lg:hidden">
              {[...MOOD_FILTERS, ...STYLE_FILTERS].map(f => (
                <TagChip key={f} label={f} active={activeFilters.includes(f)} onClick={() => toggleFilter(f)} />
              ))}
            </div>

            <p className="text-sm text-slate-500 mb-4">
              <span className="font-semibold text-slate-900">&ldquo;{previewText}&rdquo;</span>과 잘 어울리는 폰트
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayFonts.map(font => (
                <FontCard
                  key={font.id}
                  font={font}
                  previewText={previewText}
                  liked={likedFonts.includes(font.id)}
                  selected={selectedFonts.includes(font.id)}
                  onLike={() => toggleLike(font.id)}
                  onSelect={() => toggleSelect(font.id)}
                  onCompare={() => goCompare(font)}
                  onDownload={format => goDownload(font, format)}
                />
              ))}
            </div>

            {displayFonts.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <p className="text-3xl mb-3">🔍</p>
                <p className="font-medium">선택한 필터에 맞는 폰트가 없습니다</p>
                <button onClick={() => setActiveFilters([])} className="mt-3 text-sm text-blue-600 underline">필터 초기화</button>
              </div>
            )}

            <AdBanner className="h-20 mt-5" />
          </div>
        </div>
      </div>
    </div>
  )

  // ── COMPARE ───────────────────────────────────────────────────────────────
  if (screen === 'compare') {
    const compareFonts = selectedFonts.length > 0
      ? rankedFonts.filter(f => selectedFonts.includes(f.id))
      : compareFont ? [compareFont] : [rankedFonts[0]]

    const bgClass = bgMode === 'dark' ? 'bg-slate-900' : bgMode === 'transparent' ? 'checkerboard' : 'bg-white'
    const textClass = bgMode === 'dark' ? 'text-white' : 'text-slate-900'

    return (
      <div className="min-h-screen bg-slate-50 font-body">
        <Header minimal />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen('results')} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-base">
              ← 결과로 돌아가기
            </button>
            <span className="text-slate-200">|</span>
            <h1 className="font-display font-semibold text-slate-900">폰트 비교</h1>
          </div>

          {/* Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-48">
              <label className="text-xs text-slate-500 whitespace-nowrap">글자 크기</label>
              <input
                type="range" min={24} max={120} value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="flex-1 accent-slate-900"
              />
              <span className="font-mono text-xs text-slate-600 w-10 text-right">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">배경</span>
              {(['white', 'dark', 'transparent'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setBgMode(m)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-base ${bgMode === m ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {m === 'white' ? '흰색' : m === 'dark' ? '다크' : '투명'}
                </button>
              ))}
            </div>
            <button
              onClick={() => goDownload(compareFonts[0])}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-base"
            >
              다운로드
            </button>
          </div>

          {/* Comparison grid */}
          <div className={`grid gap-1 ${compareFonts.length === 1 ? 'grid-cols-1' : compareFonts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {compareFonts.map(font => (
              <div key={font.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className={`p-6 ${bgClass} min-h-40 flex items-center justify-center border-b border-slate-100`}>
                  <p
                    className={`${font.cssClass} ${textClass} text-center leading-tight break-all`}
                    style={{ fontSize: `${fontSize}px`, fontWeight: font.weight as any }}
                  >
                    {previewText}
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-slate-900">{font.name}</p>
                    <ScoreRing score={font.score} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{font.description}</p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-slate-400 mb-1">적합한 용도</p>
                      <div className="flex flex-wrap gap-1">
                        {font.goodFor.map(g => (
                          <span key={g} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px]">{g}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">라이선스</p>
                      <div className="flex flex-wrap gap-1">
                        <LicenseBadge ok={font.commercial} label="상업용" />
                        <LicenseBadge ok={font.modifiable} label="수정" />
                        <LicenseBadge ok={font.redistribute} label="재배포" />
                      </div>
                    </div>
                  </div>
                  {/* Sample text rows */}
                  <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                    {['한글 가나다라마바사아자차카타파하', 'ABCDEFGabcdefg', '0123456789', '!@#$%&'].map(sample => (
                      <p key={sample} className={`${font.cssClass} text-xs text-slate-600 truncate`} style={{ fontWeight: font.weight as any }}>
                        {sample}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AdBanner className="h-16 mt-5" />
        </div>
      </div>
    )
  }

  // ── DOWNLOAD ──────────────────────────────────────────────────────────────
  if (screen === 'download') {
    const font = downloadFont || rankedFonts[0]
    return (
      <div className="min-h-screen bg-slate-50 font-body">
        <Header minimal />
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen('results')} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-base">
              ← 결과로 돌아가기
            </button>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-start gap-3 mb-6">
            <span className="text-amber-500 mt-0.5 text-base">⚠</span>
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-0.5">상업적 사용 전 라이선스를 다시 확인해 주세요</p>
              <p className="text-xs text-amber-700">
                {font.name} 폰트는 <strong>{font.license}</strong> 라이선스입니다.
                상업적 사용 {font.commercial ? '가능' : '불가'} · 수정 {font.modifiable ? '가능' : '불가'} · 재배포 {font.redistribute ? '가능' : '불가'}
              </p>
            </div>
          </div>

          {!downloadDone ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Preview */}
              <div className="bg-slate-50 border-b border-slate-200 p-8 flex items-center justify-center min-h-36">
                <p className={`${font.cssClass} text-4xl text-slate-900 text-center leading-tight`} style={{ fontWeight: font.weight as any }}>
                  {previewText}
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{font.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{font.license}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <LicenseBadge ok={font.commercial} label="상업용" />
                    <LicenseBadge ok={font.modifiable} label="수정" />
                  </div>
                </div>

                {/* Format */}
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">내보내기 포맷</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {DOWNLOAD_FORMATS.map(fmt => (
                      <button
                        key={fmt.key}
                        onClick={() => setDownloadFormat(fmt.key)}
                        className={`p-3 border rounded-xl text-left transition-base ${downloadFormat === fmt.key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <p className={`font-mono text-sm font-semibold mb-0.5 ${downloadFormat === fmt.key ? 'text-white' : 'text-slate-900'}`}>{fmt.label}</p>
                        <p className={`text-[11px] leading-snug ${downloadFormat === fmt.key ? 'text-slate-300' : 'text-slate-500'}`}>{fmt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">내보내기 크기</p>
                  <div className="flex flex-wrap gap-2">
                    {DOWNLOAD_SIZES.map(s => (
                      <button
                        key={s}
                        onClick={() => setDownloadSize(s)}
                        className={`px-3.5 py-2 border rounded-lg text-sm font-mono transition-base ${downloadSize === s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleFileDownload(font)}
                  disabled={downloadBusy}
                  className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-wait transition-base text-sm"
                >
                  {downloadBusy ? '파일 만드는 중…' : `${font.name} · ${downloadFormat.toUpperCase()} · ${downloadSize} 다운로드`}
                </button>
                {downloadError && (
                  <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {downloadError}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Download done */
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-display font-bold text-slate-900 text-xl mb-2">다운로드 완료!</h2>
              <p className="text-slate-500 text-sm mb-1">
                <strong>{font.name}</strong> · {downloadFormat.toUpperCase()} · {downloadSize}
              </p>
              <p className="text-xs text-slate-400 mb-7">자동 저장이 시작되지 않으면 아래의 ‘파일 저장’ 버튼을 눌러주세요</p>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-left mb-6">
                <p className="text-sm font-semibold text-green-900 mb-1.5">사용 가이드</p>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>✓ 다운로드한 파일은 상업적 프로젝트에 자유롭게 사용 가능합니다</li>
                  <li>✓ {font.license} 라이선스 범위 내에서 사용해 주세요</li>
                  {font.modifiable ? <li>✓ 파일 수정 및 변형이 허용됩니다</li> : <li>— 원본 파일의 수정 및 변형은 허용되지 않습니다</li>}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => { setDownloadDone(false); setDownloadError('') }}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-base"
                >
                  다른 포맷으로 다운로드
                </button>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={downloadFileName}
                    className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold text-center rounded-xl hover:bg-blue-700 transition-base"
                  >
                    파일 저장
                  </a>
                )}
                <button
                  onClick={() => setScreen('results')}
                  className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-base"
                >
                  다른 폰트 찾기
                </button>
              </div>
            </div>
          )}
          <AdBanner className="h-16 mt-5" />
        </div>
      </div>
    )
  }

  return null
}
