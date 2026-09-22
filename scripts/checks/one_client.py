import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
SOURCE = HERE / "web" / "src"
CLIENT = SOURCE / "api"
ROUTER = SOURCE / "route.js"
ENDPOINTS = re.compile(r"""\bfetch\(|new EventSource\(|https?://(?:127\.0\.0\.1|localhost)|["'`]/api\b|["'`]/\$\{|["'`]/(?:journals|services|plugins|pages|manifest|identity|agents|agent-hooks|agent-controls|upstream|upgrade|stop|extension|summary)\b""")


def problems() -> list[str]:
    return [f"{path.relative_to(HERE)}:{n} names an endpoint outside web/src/api" for path in sorted(SOURCE.rglob("*"))
            if path.suffix in (".js", ".vue", ".ts") and CLIENT not in path.parents and path != ROUTER
            for n, line in enumerate(path.read_text().splitlines(), 1) if ENDPOINTS.search(line)]


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "only the API client names an endpoint")
    sys.exit(1 if found else 0)
