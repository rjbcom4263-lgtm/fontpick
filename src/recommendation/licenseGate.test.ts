import test from 'node:test'
import assert from 'node:assert/strict'
import {
  COMMERCIAL_LICENSES,
  filterCommerciallyApproved,
  isCommerciallyApproved,
  isLicenseRecordApproved,
} from './licenseGate.ts'

test('all 38 production fonts are APPROVED for commercial web/output use', () => {
  const names = Object.keys(COMMERCIAL_LICENSES)
  assert.equal(names.length, 38)
  for (const name of names) {
    assert.equal(isCommerciallyApproved(name), true, `${name} should be approved`)
    assert.equal(COMMERCIAL_LICENSES[name].status, 'APPROVED')
  }
})

test('unknown font fails closed', () => {
  assert.equal(isCommerciallyApproved('Unknown Mystery Font'), false)
})

test('REVIEW/BLOCKED/unknown fonts never enter recommendation pool', () => {
  const candidates = [
    { name: 'Do Hyeon', score: 60 },
    { name: 'Unknown Mystery Font', score: 100 },
    { name: 'Jua', score: 55 },
  ]
  const filtered = filterCommerciallyApproved(candidates)
  assert.deepEqual(filtered.map(x => x.name), ['Do Hyeon', 'Jua'])
  assert.equal(filtered.some(x => x.score === 100), false)
})

test('APPROVED gate requires commercial + web + generated output permission', () => {
  const all = Object.values(COMMERCIAL_LICENSES)
  assert.equal(all.every(x => x.commercialUse && x.webUse && x.generatedOutputUse), true)
})


test('REVIEW and BLOCKED records fail even when permission flags are true', () => {
  const base = {
    fontName: 'Mock',
    licenseType: 'Mock License',
    commercialUse: true,
    webUse: true,
    generatedOutputUse: true,
    fontFileRedistribution: 'not-offered' as const,
    officialLicenseUrl: 'https://example.com/license',
    verifiedAt: '2026-09-02',
    notes: 'test',
  }
  assert.equal(isLicenseRecordApproved({ ...base, status: 'REVIEW' }), false)
  assert.equal(isLicenseRecordApproved({ ...base, status: 'BLOCKED' }), false)
  assert.equal(isLicenseRecordApproved({ ...base, status: 'APPROVED' }), true)
})

test('APPROVED record without evidence fails closed', () => {
  const record = {
    fontName: 'Mock', status: 'APPROVED' as const, licenseType: 'Mock',
    commercialUse: true, webUse: true, generatedOutputUse: true,
    fontFileRedistribution: 'not-offered' as const,
    officialLicenseUrl: '', verifiedAt: '', notes: 'test',
  }
  assert.equal(isLicenseRecordApproved(record), false)
})

test('current approved records preserve official license URLs and verification date', () => {
  for (const record of Object.values(COMMERCIAL_LICENSES)) {
    assert.match(record.officialLicenseUrl, /^https:\/\//)
    assert.equal(record.verifiedAt, '2026-09-02')
  }
})
