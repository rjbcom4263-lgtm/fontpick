import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = JSON.parse(await readFile(path.join(root, 'EXTERNAL_FONT_CANDIDATES.json'), 'utf8'))

const naverHtml = await fetch('https://hangeul.naver.com/fonts/search?f=clova').then(response => {
  if (!response.ok) throw new Error(`NAVER catalog request failed: ${response.status}`)
  return response.text()
})

const clean = value => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const naverRuntimeByName = new Map()
for (const match of naverHtml.matchAll(/<li\b[^>]*data-download[^>]*>([\s\S]*?)<\/li>/g)) {
  const block = match[1]
  const name = block.match(/data-name="([^"]+)"/)?.[1]
  const family = block.match(/data-id="([^"]+)"/)?.[1]
  const url = block.match(/class="btn-download"[^>]*data-url="([^"]+)"/)?.[1]
  if (name && family && url) naverRuntimeByName.set(clean(name), { family, url })
}

const naverBase = {
  'naver-nanum-gothic-eco': ['NanumGothicEco', 'https://hangeul.pstatic.net/hangeul_static/css/nanum-gothic-eco.css'],
  'naver-nanum-myeongjo-eco': ['NanumMyeongjoEco', 'https://hangeul.pstatic.net/hangeul_static/css/nanum-myeongjo-eco.css'],
  'naver-nanum-myeongjo-yethangul': ['NanumMyeongjoYetHangul', 'https://hangeul.pstatic.net/hangeul_static/css/NanumMyeongjoYetHangul.css'],
  'naver-nanum-barun-gothic': ['NanumBarunGothic', 'https://hangeul.pstatic.net/hangeul_static/css/nanum-barun-gothic.css'],
  'naver-nanum-barun-gothic-yethangul': ['NanumBarunGothicYetHangul', 'https://hangeul.pstatic.net/hangeul_static/css/NanumBarunGothicYetHangul.css'],
  'naver-nanum-barun-pen': ['NanumBarunpen', 'https://hangeul.pstatic.net/hangeul_static/css/nanum-barun-pen.css'],
  'naver-nanum-square-neo': ['NanumSquareNeo', 'https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css'],
  'naver-nanum-square-round': ['NanumSquareRound', 'https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'],
  'naver-nanum-human': ['NanumHuman', 'https://hangeul.pstatic.net/hangeul_static/css/NanumHuman.css'],
}

const baemin = {
  'baemin-bm-kkubulim': ['BM Kkubulim', 'BMKkubulimTTF.ttf'],
  'baemin-bm-hanna-pro': ['BM HANNA Pro', 'BMHANNAPro.ttf'],
  'baemin-bm-hanna-air': ['BM HANNA Air', 'BMHANNAAir_ttf.ttf'],
  'baemin-bm-hanna-11yrs': ['BM HANNA 11yrs old', 'BMHANNA_11yrs_ttf.ttf'],
  'baemin-bm-euljiro-oraeorae': ['BM Euljiro oraeorae', 'BMEuljirooraeorae.ttf'],
  'baemin-bm-euljiro-10-years-later': ['BM Euljiro 10 years later', 'BMEuljiro10yearslater.ttf'],
  'baemin-bm-euljiro': ['BM EULJIRO', 'BMEULJIROTTF.ttf'],
}

const otherRuntime = {
  'suite-suite-variable': {
    fontFamily: 'SUITE',
    stylesheetUrl: 'https://cdn.jsdelivr.net/gh/sun-typeface/SUITE@2/fonts/static/woff2/SUITE.css',
  },
  'line-line-seed-sans-kr': {
    fontFamily: 'LINE Seed Sans KR',
    stylesheetUrl: 'https://cdn.jsdelivr.net/npm/@kfonts/line-seed-sans-kr@0.1.0/index.min.css',
  },
}

const output = source.fonts
  .filter(font => font.status === 'APPROVED' && !font.duplicateOfGoogleFonts)
  .map(font => {
    const runtime = {
      id: font.id,
      provider: font.provider,
      canonicalName: font.canonicalName,
      displayName: font.displayName,
      category: font.category,
      officialSourceUrl: font.officialSourceUrl,
      officialLicenseUrl: font.officialLicenseUrl,
    }

    if (font.provider === 'naver' && font.id.startsWith('naver-nanum-handwriting-')) {
      const found = naverRuntimeByName.get(clean(font.displayName))
      if (!found) throw new Error(`Missing NAVER runtime mapping for ${font.displayName}`)
      return { ...runtime, fontFamily: found.family, fontFileUrl: found.url }
    }

    if (naverBase[font.id]) {
      const [fontFamily, stylesheetUrl] = naverBase[font.id]
      return { ...runtime, fontFamily, stylesheetUrl }
    }

    if (baemin[font.id]) {
      const [fontFamily, file] = baemin[font.id]
      return {
        ...runtime,
        fontFamily,
        fontFileUrl: `https://woowahan-cdn.woowahan.com/static/fonts/${file}`,
      }
    }

    return { ...runtime, ...(otherRuntime[font.id] ?? {}) }
  })

const clovaCount = output.filter(font => font.id.startsWith('naver-nanum-handwriting-') && font.fontFileUrl).length
if (output.length !== 135 || clovaCount !== 109) {
  throw new Error(`Unexpected generated counts: external=${output.length}, clova=${clovaCount}`)
}

await writeFile(
  path.join(root, 'src', 'data', 'externalFonts.generated.json'),
  `${JSON.stringify(output, null, 2)}\n`,
  'utf8',
)

console.log(`Generated ${output.length} unique external fonts (${clovaCount} NAVER Clova handwriting fonts).`)
