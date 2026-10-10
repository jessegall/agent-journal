import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
SOURCE = HERE / "web" / "src"
CLIENT = SOURCE / "api"
ROUTER = SOURCE / "route.js"
FETCH = re.compile(r"\bfetch\(")
BOUND_FETCH = re.compile(r"[(\[,{]\s*fetch\s*[,)\]}=:]|\b(?:const|let|var|function)\s+fetch\b")
ENDPOINTS = re.compile(r"""new EventSource\(|https?://(?:127\.0\.0\.1|localhost)|["'`]/api\b|["'`]/\$\{|["'`]/(?:journals|services|plugins|pages|manifest|identity|agents|agent-hooks|agent-controls|upstream|upgrade|stop|extension|summary)\b|["'`]\./(?:file|files|export|attach)/""")


def names_endpoint(line: str, binds_fetch: bool) -> bool:
    """A line names an endpoint by a path or an event source, or by the browser's fetch, unless the file binds a `fetch` of its own, such as a function it is handed."""
    return bool(ENDPOINTS.search(line) or (not binds_fetch and FETCH.search(line)))


def problems() -> list[str]:
    found = []
    for path in sorted(SOURCE.rglob("*")):
        if path.suffix not in (".js", ".vue", ".ts") or CLIENT in path.parents or path == ROUTER:
            continue
        text = path.read_text()
        binds_fetch = bool(BOUND_FETCH.search(text))
        found += [f"{path.relative_to(HERE)}:{n} names an endpoint outside web/src/api" for n, line in enumerate(text.splitlines(), 1) if names_endpoint(line, binds_fetch)]
    return found


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "only the API client names an endpoint")
    sys.exit(1 if found else 0)
