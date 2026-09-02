# FontPick Step 1 — google-fonts-skill BM25 adaptation

## What we adopted
- BM25 ranking over enriched font metadata.
- Search documents built from mood, purpose, style, readability and laser-related terms.
- BM25 score is blended into FontPick's existing recommendation score.

## What we intentionally changed
- Original tokenizer: `[a-z0-9]+` only.
- FontPick tokenizer: Unicode letters/numbers (`/[\p{L}\p{N}]+/gu`) so Korean metadata is supported.
- Original `single` mode favors `Body_Suitable`; FontPick does not apply that restriction because logo, poster, signage and laser engraving often need display fonts.
- Original Quality_Tier/Best_For heuristics are not treated as ground truth.

## Current weight blend
General purposes:
- Mood match 25%
- Purpose fit 20%
- Text-length fit 10%
- Small-text readability 5%
- Existing base quality 10%
- Popularity 10%
- BM25 semantic metadata match 20%

Laser engraving:
- Mood match 5%
- Purpose fit 22%
- Text-length fit 6%
- Laser morphology profile 45%
- Existing base quality 5%
- Popularity 2%
- BM25 semantic metadata match 15%

## Next
The next repository to inspect should be `korean-vibe-fonts`, specifically to improve Korean mood/style metadata and expand the Korean font catalog.
