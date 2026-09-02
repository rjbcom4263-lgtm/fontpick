# Scrapling 폰트 후보 수집기

Scrapling은 외부 폰트 사이트의 공개 페이지에서 이름, 상세 링크, 라이선스 문구 후보를 수집하는 개발 도구로만 사용합니다. 크롤링 결과는 모두 `REVIEW`와 `DO_NOT_LOAD`로 저장되며, 라이선스 검토와 웹폰트 URL 확인 전에는 추천 풀에 들어가지 않습니다.

## 설치

```powershell
python -m venv .venv-font-collector
.\.venv-font-collector\Scripts\python.exe -m pip install -r requirements-font-collector.txt
```

## 실행 예시

대상 사이트의 실제 CSS 선택자를 확인한 뒤 실행합니다.

```powershell
.\.venv-font-collector\Scripts\python.exe tools\collect_font_candidates.py `
  --url "https://example.com/fonts" `
  --source "Example Foundry" `
  --item-selector ".font-card" `
  --name-selector ".font-name" `
  --link-selector "a.details"
```

출력 기본 경로는 `font-collector-output/font-candidates.json`입니다. 사이트의 이용약관과 robots.txt를 지키며, 로그인·보호 페이지 우회 기능은 사용하지 않습니다.
