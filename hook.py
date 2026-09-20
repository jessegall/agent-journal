import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import features  # noqa: E402
from engine.hooks import answer  # noqa: E402
from engine.sessions import ACTIVE_ENV  # noqa: E402
from providers import PROVIDERS  # noqa: E402


def main(argv: list[str]) -> int:
    if os.environ.get(ACTIVE_ENV) != "1":
        return 0
    provider = PROVIDERS[argv[0]]()
    root = Path(argv[1])
    try:
        raw = json.load(sys.stdin)
    except ValueError:
        return 0
    features.load(root)
    out = answer(provider, root, raw, os.getppid(), os.environ.get("JOURNAL_ENV", ""))
    if out:
        print(json.dumps(out))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
