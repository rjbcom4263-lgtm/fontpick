# FontPick 로컬 테스트 방법

## 가장 쉬운 방법 (Windows)
1. ZIP 압축을 풉니다.
2. 폴더 안의 `start.bat`을 더블클릭합니다.
3. 처음 실행 때만 `npm install`이 진행됩니다.
4. 터미널에 표시되는 주소(기본 `http://localhost:5173`)를 브라우저에서 엽니다.

## 직접 실행
```bash
npm install
npm run dev
```

## 포함된 기능
- 총 55개 폰트 추천 풀 (Google Fonts 한글 47개 + 외부 검증 8개)
- 상업 안전 화이트리스트 (`APPROVED`만 추천)
- 한국어 vibe 분석
- BM25 메타데이터 랭킹
- 용도별 추천: 자동 / 로고 / 레이저 각인 / 간판 / 포스터 / SNS / 청첩장
- 레이저 각인 전용 점수 보정
- 추천 결과 TOP 8 동적 폰트 로딩
- 라이선스 감사 자료 및 회귀 테스트 결과 포함

Google Fonts 47개 기준선과 외부 후보 데이터는 `FONT_COLLECTION_55.md`에서 확인할 수 있습니다.

외부 폰트 후보 사이트를 수집할 때는 Scrapling 기반의 검토용 수집기를 사용할 수 있습니다. 자세한 실행법은 `FONT_COLLECTOR.md`를 참고하세요. 수집 결과는 항상 `REVIEW`이며 자동으로 추천 풀에 들어가지 않습니다.

## 참고
- 신규 폰트 미리보기는 Google Fonts에서 동적으로 불러오므로 인터넷 연결이 필요합니다.
- Node.js LTS 버전 설치가 필요합니다.

## Firebase Hosting 배포

```bash
npm run deploy
```

기본 Firebase 프로젝트는 `fontpick-saegim`, 배포 대상 폴더는 `dist`입니다.
