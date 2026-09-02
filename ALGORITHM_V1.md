# FontPick Recommendation Engine V1

## Implemented
- Real-time Korean/English text mood analysis
- Automatic purpose detection: logo / laser engraving / sign / poster / SNS / invitation
- Dynamic font score calculation (not fixed mock scores)
- Laser-specific scoring: stroke stability, small-text readability, counter space, outline simplicity
- Dynamic recommendation reasons
- Working sort modes: recommendation / emotion / readability / engraving / popularity
- Working mood/style filters
- Auto-analysis label reflects detected purpose
- Analysis strip shows live top-three text traits

## Current scope
The engine is intentionally validated against the 8 fonts already present in the Figma prototype. Expand the font database after tuning the scoring behavior.

## Next steps
1. Expand to ~100 commercially usable Korean fonts with verified license metadata.
2. Add actual PNG/SVG/SVG Path exporters.
3. Store anonymous selection/download signals to tune weights.
4. Add optional AI re-ranking after the rule-based engine is stable.

## Step 2 update
Korean-language vibe signals from `src/recommendation/koreanVibe.ts` now feed automatic purpose inference, mood analysis, BM25 semantic ranking, and recommendation reasons.
