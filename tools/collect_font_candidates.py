from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

from scrapling.fetchers import Fetcher


USER_AGENT = "FontPickResearchBot/1.0"


def robots_allows(url: str) -> bool:
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    parser = RobotFileParser(robots_url)
    try:
        parser.read()
    except Exception as exc:
        print(f"robots.txt 확인 실패: {robots_url} ({exc})", file=sys.stderr)
        return False
    return parser.can_fetch(USER_AGENT, url)


def text_from(node, selector: str) -> str:
    matches = node.css(selector)
    parts: list[str] = []
    for match in matches:
        value = getattr(match, "text", "")
        if value:
            parts.append(str(value).strip())
    return " ".join(part for part in parts if part).strip()


def link_from(node, selector: str, base_url: str) -> str:
    matches = node.css(selector)
    if not matches:
        return ""
    href = matches[0].attrib.get("href", "")
    return urljoin(base_url, href) if href else ""


def collect(args: argparse.Namespace) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []
    for url in args.url:
        if not robots_allows(url):
            print(f"robots.txt 정책 때문에 건너뜀: {url}", file=sys.stderr)
            continue

        page = Fetcher.get(url, stealthy_headers=False)
        items = page.css(args.item_selector)
        for item in items:
            name = text_from(item, args.name_selector)
            if not name:
                continue
            records.append(
                {
                    "displayName": name,
                    "source": args.source,
                    "sourcePageUrl": url,
                    "detailUrl": link_from(item, args.link_selector, url),
                    "licenseTextObserved": text_from(item, args.license_selector)
                    if args.license_selector
                    else "",
                    "status": "REVIEW",
                    "engineAction": "DO_NOT_LOAD",
                    "collectedAt": datetime.now(timezone.utc).isoformat(),
                    "collector": "Scrapling",
                }
            )
    return records


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="공개 폰트 페이지에서 후보만 수집합니다. 결과는 항상 REVIEW입니다."
    )
    parser.add_argument("--url", action="append", required=True, help="수집할 공개 페이지 URL")
    parser.add_argument("--source", required=True, help="공급처 표시명")
    parser.add_argument("--item-selector", required=True, help="폰트 카드/행 CSS 선택자")
    parser.add_argument("--name-selector", required=True, help="카드 안 폰트명 CSS 선택자")
    parser.add_argument("--link-selector", default="a", help="카드 안 상세 링크 CSS 선택자")
    parser.add_argument("--license-selector", default="", help="선택적 라이선스 문구 CSS 선택자")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("font-collector-output/font-candidates.json"),
        help="결과 JSON 경로",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    records = collect(args)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "count": len(records),
        "statusPolicy": "REVIEW_ONLY",
        "fonts": records,
    }
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(records)}개 후보 저장: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
