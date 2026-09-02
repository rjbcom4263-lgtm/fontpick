# FontPick — 30-font commercial-safe expansion

## Result
- Existing fonts: 8
- New fonts: 30
- Total fonts: 38
- Commercial APPROVED: 38/38
- Regression scenarios: 42
- Invariant failures: 0
- Unique fonts reaching #1: 17
- Unique fonts appearing in TOP 8: 35

## Added fonts
Noto Serif KR, Hahmlet, Gowun Batang, Gowun Dodum, Song Myung, Yeon Sung, Gaegu, Single Day, Gamja Flower, Kirang Haerang, Stylish, Sunflower, Hi Melody, Poor Story, Cute Font, East Sea Dokdo, Dokdo, Black And White Picture, Nanum Brush Script, Nanum Gothic Coding, Gasoek One, Grandiflora One, Dongle, Bagel Fat One, Diphylleia, Orbit, Gothic A1, Gugi, Batang, Dotum.

## Commercial safety policy
Every production font must pass the fail-closed license gate: APPROVED status, commercial use, web use, generated-output use, an official HTTPS license URL, and a verification date. Unknown, REVIEW, or BLOCKED fonts never enter the recommendation pool.

The 30 additions are sourced from the Google Fonts open-source catalog and point to the family-specific OFL license in the official google/fonts repository.

## Performance change
The 30 new Korean webfonts are not all loaded on first paint. Only fonts that enter the current TOP 8 are requested dynamically from Google Fonts. This keeps the font catalog scalable without forcing 38 Korean families to load at startup.

## Laser-specific correction
Nanum Gothic Coding receives a boost for Latin/digit-heavy engraving but a penalty for pure Hangul copy, preventing it from dominating all laser recommendations. Short Hangul favors Do Hyeon/other stable display faces; long Hangul favors readable Gothic families.
