# FontPick Commercial Safety Test

Date: 2026-09-02

## Policy
- Recommendation pool is fail-closed: only `APPROVED` records enter scoring.
- Unknown, `REVIEW`, or `BLOCKED` fonts are excluded before BM25/scoring.
- MVP does not offer TTF/OTF/WOFF font-file download; it focuses on preview and generated PNG/SVG/SVG Path outputs.
- Current production whitelist: 8 fonts, all SIL OFL 1.1 from Google Fonts or IBM Plex official repository.

## Test results
- 5 unit tests passed, 0 failed.
- All 8 production fonts: APPROVED.
- Unknown font: denied (fail closed).
- Mock unknown font with score 100: excluded before recommendation ranking.
- License URL and verification date required for every approved record.

## Corrections made
- Do Hyeon: `redistribute` corrected from false to true (OFL allows redistribution under its conditions).
- Nanum Pen Script: `modifiable` corrected from false to true (OFL allows modification under its conditions).

## Important limitation
This is an engineering/license-audit control, not a guarantee against every possible legal dispute. For every new font, FontPick should verify the upstream license and keep the source URL/date before changing status to APPROVED.
