import catalog from './externalFonts.generated.json' with { type: 'json' }

export interface ExternalFontRuntime {
  id: string
  provider: string
  canonicalName: string
  displayName: string
  category: string
  officialSourceUrl: string
  officialLicenseUrl: string
  fontFamily?: string
  fontFileUrl?: string
  stylesheetUrl?: string
}

export const EXTERNAL_FONT_CATALOG = catalog as ExternalFontRuntime[]

export const externalFontName = (font: ExternalFontRuntime): string => {
  if (font.provider === 'naver') return font.displayName
  if (font.provider === 'baemin') return `배민 ${font.displayName}`
  return font.canonicalName.replace(/\s+Variable$/, '')
}

export const normalizeFontName = (name: string): string => name
  .toLowerCase()
  .replace(/variable/g, '')
  .replace(/[^a-z0-9가-힣]/g, '')
