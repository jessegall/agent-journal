import io
import re
import sys
import tokenize
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
WORDS = frozenset({"said", "says", "heard", "spoke", "told", "shown", "became", "quiet_enough"})
SKIPPED = frozenset({".venv", "node_modules", ".journal", ".claude", "web", "dist", "__pycache__", ".git"})
SCRIPT = re.compile(r"<script[^>]*>(.*?)</script>", re.S)
JS_NAME = re.compile(r"\b(?:const|let|var|function)\s+(" + "|".join(WORDS) + r")\b|\.(" + "|".join(WORDS) + r")\b(?!\s*[:=]\s*[\"'`])")


def python_names(path: Path) -> list[tuple[int, str]]:
    try:
        tokens = list(tokenize.generate_tokens(io.StringIO(path.read_text()).readline))
    except (tokenize.TokenError, SyntaxError):
        return []
    return [(t.start[0], t.string) for t in tokens if t.type == tokenize.NAME and t.string in WORDS]


def script_names(path: Path) -> list[tuple[int, str]]:
    text = path.read_text()
    code = "\n".join(SCRIPT.findall(text)) if path.suffix == ".vue" else text
    offset = text[:text.find(code)].count("\n") if code and path.suffix == ".vue" else 0
    return [(n + offset, next(g for g in found.groups() if g)) for n, line in enumerate(code.splitlines(), 1) for found in JS_NAME.finditer(line)]


def problems() -> list[str]:
    python = [p for p in HERE.rglob("*.py") if not SKIPPED & set(p.relative_to(HERE).parts)]
    viewer = [p for p in (HERE / "web" / "src").rglob("*") if p.suffix in (".js", ".vue")]
    return [f"{path.relative_to(HERE)}:{n} names something '{word}'; name it for what it holds"
            for path, names in [*((p, python_names(p)) for p in sorted(python)), *((p, script_names(p)) for p in sorted(viewer))]
            for n, word in names]


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "no prose words are used as names")
    sys.exit(1 if found else 0)
