# FontPick 48-font expansion

## Added families

- Asta Sans
- Moirai One
- Pretendard
- SUIT
- Wanted Sans
- Spoqa Han Sans Neo
- Maru Buri
- Nanum Square
- Gmarket Sans
- D2Coding

All ten families pass the commercial safety gate for commercial use, web preview and generated graphic output. FontPick does not offer direct TTF, OTF, WOFF or WOFF2 downloads.

## Selection policy

- Prefer official SIL OFL or official open-font license sources.
- Require a working HTTPS license or official policy URL.
- Require a working webfont source before enabling a family.
- Load only stylesheets required by the current TOP 8.
- Exclude families that require separate server-embedding approval.

KoPub World was reviewed but not added because its official guidance requires separate approval for server embedding in a web service.

## Verification

- Production font pool: 48
- License-gate unit tests: 7/7 passing
- TypeScript: passing
- Vite production build: passing
- Browser recommendation smoke tests: logo, laser engraving, poster, wedding and SNS
- Browser console errors: 0

See `FONT_EXPANSION_10_AUDIT.json` for per-family sources.
