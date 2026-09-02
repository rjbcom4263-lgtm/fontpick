# FontPick 55개 폰트 컬렉션

검증 기준일: 2026-09-02

## 추천 풀

- Google Fonts 한글 지원 기준선: 47개
- 별도 공식 배포처에서 검증한 외부 폰트: 8개
- 현재 추천 풀 합계: 55개

이번 통합에서 추가된 Google Fonts 7개는 `Gulim`, `GulimChe`, `DotumChe`, `BatangChe`, `Gungsuh`, `GungsuhChe`, `42dot Sans`입니다.

`Gulim`과 `42dot Sans`는 Google Fonts CSS API로 동적 로딩합니다. CSS API가 제공하지 않는 나머지 5개는 Google Fonts 공식 저장소의 TTF를 `@font-face`로 연결했습니다.

## 수집 데이터

- `GOOGLE_KOREAN_47.json`: Google Fonts 한글 47개 기준선
- `EXTERNAL_FONT_CANDIDATES.json`: 외부 후보 목록
- `NAVER_FONT_COLLECTION.json`: 네이버 계열 수집 자료
- `BAEMIN_FONT_COLLECTION.json`: 배민 계열 수집 자료

외부 후보 JSON은 연구·검토 자료입니다. 파일에 `APPROVED` 표시가 있더라도 앱의 `src/recommendation/licenseGate.ts`에 별도 검증 기록과 실제 웹폰트 경로가 추가되기 전에는 프로덕션 추천에 포함되지 않습니다.

내부 수량·필수 필드 검사는 `npm run validate:fonts`로 실행합니다.
