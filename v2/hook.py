import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from v2.providers import PROVIDERS  # noqa: E402


def main(argv: list[str]) -> int:
    provider = PROVIDERS[argv[0]]()
    root = Path(argv[1])
    env = os.environ.get("JOURNAL_ENV") or (root / "runtime" / "env").read_text().strip() if (root / "runtime" / "env").is_file() else "main"
    try:
        payload = json.load(sys.stdin)
    except ValueError:
        return 0
    out = provider.handle(root, env, payload)
    if out:
        print(json.dumps(out))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
