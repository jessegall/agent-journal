import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from engine.sessions import Sessions  # noqa: E402
from providers import PROVIDERS  # noqa: E402


def default_env(root: Path) -> str:
    f = root / "runtime" / "env"
    return os.environ.get("JOURNAL_ENV") or (f.read_text().strip() if f.is_file() else "main")


def main(argv: list[str]) -> int:
    provider = PROVIDERS[argv[0]]()
    root = Path(argv[1])
    try:
        payload = json.load(sys.stdin)
    except ValueError:
        return 0
    sessions = Sessions(root)
    session = provider.session_of(payload)
    env = sessions.environment(session) or sessions.bind(session, default_env(root), pid=os.getppid())["environment"]
    sessions.touch(session)
    out = provider.handle(root, env, payload)
    if out:
        print(json.dumps(out))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
