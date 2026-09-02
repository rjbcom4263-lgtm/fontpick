# Step 2 — Korean Vibe signal integration

Source reviewed: `seulkikaang/korean-vibe-fonts`.

## Findings

- 35 curated Korean webfonts plus 429 fonts-archive expansion entries are documented.
- The recommender maps Korean/English phrases to semantic tags, chooses a broad profile, then ranks curated candidates by tag overlap and text role.
- A separate situation guide provides 17 scenario-first recipes.
- The archive expansion itself warns that upstream licenses should be re-checked before production redistribution or embedding.

## FontPick implementation

We independently implemented `src/recommendation/koreanVibe.ts`:

1. Normalize Korean copy.
2. Extract semantic tags such as warm, emotional, local, retro, poster, brand, wedding, etc.
3. Group signals into product/editorial/playful/impact profiles.
4. Infer a purpose only when evidence is strong.
5. Feed vibe tags into the Step 1 BM25 semantic query.
6. Give each current FontPick font its own vibe tags so semantic intent can affect rank and recommendation reasons.

## Licensing decision

The reviewed repository does not declare a repository-wide license in GitHub metadata. FontPick therefore does not copy its code/catalog wholesale. We use it as a research/reference architecture and will verify each font against its upstream publisher/license source before adding production font assets.

## Next

Add 15–25 independently verified Korean fonts, balanced across UI sans, display, serif/editorial, handwriting, rounded/playful, and engraving-friendly groups.
