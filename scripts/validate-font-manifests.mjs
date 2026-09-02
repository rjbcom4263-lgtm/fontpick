import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));

const google = read('GOOGLE_KOREAN_47.json');
const external = read('EXTERNAL_FONT_CANDIDATES.json');
const naver = read('NAVER_FONT_COLLECTION.json');
const baemin = read('BAEMIN_FONT_COLLECTION.json');

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(google.count === 47 && google.families.length === 47, 'Google Korean master must contain 47 families.');
assert(new Set(google.families.map(x => x.familyName)).size === 47, 'Google family names must be unique.');
assert(naver.clovaHandwritingCount === 109 && naver.clovaHandwritingFamilies.length === 109, 'NAVER Clova collection must contain 109 families.');
assert(baemin.fontFamilyCount === 11 && baemin.currentDownloadableFontFamilies.length === 11, 'Baemin current downloadable font family list must contain 11 families.');
assert(external.externalCollectedCount === external.fonts.length, 'External collected count mismatch.');

const approved = external.fonts.filter(x => x.status === 'APPROVED');
const uniqueApproved = approved.filter(x => !x.duplicateOfGoogleFonts);
assert(approved.length === external.externalApprovedCount, 'External APPROVED count mismatch.');
assert(uniqueApproved.length === external.externalApprovedUniqueAfterGoogleDedup, 'External unique APPROVED count mismatch.');

for (const f of approved) {
  assert(f.commercialUse === true, `${f.displayName}: approved but commercialUse is not true.`);
  assert(f.webUse === true, `${f.displayName}: approved but webUse is not true.`);
  assert(f.generatedOutputUse === true, `${f.displayName}: approved but generatedOutputUse is not true.`);
  assert(f.svgPathOutput === true, `${f.displayName}: approved but svgPathOutput is not true.`);
  assert(/^https:\/\//.test(f.officialSourceUrl), `${f.displayName}: missing HTTPS official source.`);
  assert(/^https:\/\//.test(f.officialLicenseUrl), `${f.displayName}: missing HTTPS official license.`);
}

for (const c of external.reviewCollections || []) {
  assert(c.engineAction === 'DO_NOT_LOAD', `${c.name}: REVIEW collection must not load into production.`);
}

const report = {
  googleIntegrated: google.families.length,
  externalCollected: external.fonts.length,
  externalApproved: approved.length,
  externalUniqueApprovedAfterGoogleDedup: uniqueApproved.length,
  naverNormalizedFamilies: naver.normalizedFamilyCount,
  clovaHandwriting: naver.clovaHandwritingFamilies.length,
  baeminCurrentFontFamilies: baemin.currentDownloadableFontFamilies.length,
  errors,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
