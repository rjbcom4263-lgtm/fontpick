export type LicenseStatus = 'APPROVED' | 'REVIEW' | 'BLOCKED'
export type RedistributionPolicy = 'allowed-with-license' | 'not-offered' | 'blocked'

export interface CommercialLicenseRecord {
  fontName: string
  status: LicenseStatus
  licenseType: string
  commercialUse: boolean
  webUse: boolean
  generatedOutputUse: boolean
  fontFileRedistribution: RedistributionPolicy
  officialLicenseUrl: string
  verifiedAt: string
  notes: string
}

export const COMMERCIAL_LICENSES: Record<string, CommercialLicenseRecord> = {
  'Noto Sans KR': {
    fontName: 'Noto Sans KR', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/notosanskr/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL: use/embed/modify/redistribute allowed under license terms; font itself may not be sold by itself.',
  },
  '나눔고딕': {
    fontName: '나눔고딕', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/nanumgothic/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL with Reserved Font Names; generated documents/graphics are not required to be OFL.',
  },
  '나눔명조': {
    fontName: '나눔명조', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/nanummyeongjo/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL with Reserved Font Names; generated documents/graphics are not required to be OFL.',
  },
  'Black Han Sans': {
    fontName: 'Black Han Sans', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/blackhansans/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL: commercial use and generated graphics allowed; do not sell font software by itself.',
  },
  'Do Hyeon': {
    fontName: 'Do Hyeon', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/dohyeon/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL: modification and redistribution are allowed subject to OFL conditions.',
  },
  'Jua': {
    fontName: 'Jua', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/jua/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL: commercial use and generated graphics allowed; redistribution remains under OFL.',
  },
  'IBM Plex Sans KR': {
    fontName: 'IBM Plex Sans KR', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/IBM/plex/blob/master/LICENSE.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL with Reserved Font Name Plex; generated documents/graphics are outside the font license requirement.',
  },
  '나눔펜스크립트': {
    fontName: '나눔펜스크립트', status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/nanumpenscript/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'OFL with Reserved Font Names; modification and redistribution are allowed under OFL conditions.',
  },
  "Noto Serif KR": {
    fontName: "Noto Serif KR", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/notoserifkr/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Hahmlet": {
    fontName: "Hahmlet", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/hahmlet/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Gowun Batang": {
    fontName: "Gowun Batang", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/gowunbatang/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Gowun Dodum": {
    fontName: "Gowun Dodum", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/gowundodum/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Song Myung": {
    fontName: "Song Myung", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/songmyung/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Yeon Sung": {
    fontName: "Yeon Sung", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/yeonsung/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Gaegu": {
    fontName: "Gaegu", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/gaegu/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Single Day": {
    fontName: "Single Day", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/singleday/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Gamja Flower": {
    fontName: "Gamja Flower", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/gamjaflower/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Kirang Haerang": {
    fontName: "Kirang Haerang", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/kiranghaerang/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Stylish": {
    fontName: "Stylish", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/stylish/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Sunflower": {
    fontName: "Sunflower", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/sunflower/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Hi Melody": {
    fontName: "Hi Melody", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/himelody/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Poor Story": {
    fontName: "Poor Story", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/poorstory/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Cute Font": {
    fontName: "Cute Font", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/cutefont/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "East Sea Dokdo": {
    fontName: "East Sea Dokdo", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/eastseadokdo/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Dokdo": {
    fontName: "Dokdo", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/dokdo/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Black And White Picture": {
    fontName: "Black And White Picture", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/blackandwhitepicture/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Nanum Brush Script": {
    fontName: "Nanum Brush Script", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/nanumbrushscript/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Nanum Gothic Coding": {
    fontName: "Nanum Gothic Coding", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/nanumgothiccoding/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Gasoek One": {
    fontName: "Gasoek One", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/gasoekone/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Grandiflora One": {
    fontName: "Grandiflora One", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/grandifloraone/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Dongle": {
    fontName: "Dongle", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/dongle/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Bagel Fat One": {
    fontName: "Bagel Fat One", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/bagelfatone/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Diphylleia": {
    fontName: "Diphylleia", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/diphylleia/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Orbit": {
    fontName: "Orbit", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/orbit/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Gothic A1": {
    fontName: "Gothic A1", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/gothica1/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Gugi": {
    fontName: "Gugi", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/gugi/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Batang": {
    fontName: "Batang", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/batang/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },
  "Dotum": {
    fontName: "Dotum", status: 'APPROVED', licenseType: 'SIL OFL 1.1',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'allowed-with-license',
    officialLicenseUrl: 'https://github.com/google/fonts/blob/main/ofl/dotum/OFL.txt',
    verifiedAt: '2026-09-02',
    notes: 'Google Fonts official OFL family; commercial use, web embedding, generated graphics and redistribution are allowed subject to OFL terms.',
  },

}

export const isLicenseRecordApproved = (record?: CommercialLicenseRecord): boolean => Boolean(
  record &&
  record.status === 'APPROVED' &&
  record.commercialUse &&
  record.webUse &&
  record.generatedOutputUse &&
  /^https:\/\//.test(record.officialLicenseUrl) &&
  /^\d{4}-\d{2}-\d{2}$/.test(record.verifiedAt),
)

export const isCommerciallyApproved = (fontName: string): boolean =>
  isLicenseRecordApproved(COMMERCIAL_LICENSES[fontName])

export const getLicenseRecord = (fontName: string) => COMMERCIAL_LICENSES[fontName]

export const filterCommerciallyApproved = <T extends { name: string }>(fonts: T[]): T[] =>
  fonts.filter(font => isCommerciallyApproved(font.name))
