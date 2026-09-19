import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import features  # noqa: E402
from engine.sessions import ACTIVE_ENV, Sessions  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from providers.payload import Hook  # noqa: E402


def default_env(root: Path) -> str:
    f = root / "runtime" / "env"
    return os.environ.get("JOURNAL_ENV") or (f.read_text().strip() if f.is_file() else "main")


def main(argv: list[str]) -> int:
    if os.environ.get(ACTIVE_ENV) != "1":
        return 0
    provider = PROVIDERS[argv[0]]()
    root = Path(argv[1])
    try:
        raw = json.load(sys.stdin)
    except ValueError:
        return 0
    sessions = Sessions(root)
    session = Hook.read(raw).session
    env = sessions.environment(session) or sessions.bind(session, default_env(root), pid=os.getppid())["environment"]
    sessions.touch(session)
    features.load()
    out = provider.handle(root, env, raw)
    if out:
        print(json.dumps(out))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
