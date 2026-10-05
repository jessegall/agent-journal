import os
from pathlib import Path
from engine.memo import Memo

READ = Memo()
DEVELOPING = "DEVELOPMENT_MODE"


def developing(project: Path) -> bool:
    value = os.environ.get(DEVELOPING, "") or declared(project / ".env")
    return value.strip().strip("'\"").lower() in ("1", "true", "yes", "on")


def declared(env: Path) -> str:
    try:
        mark = env.stat().st_mtime_ns
    except OSError:
        return ""
    return READ.get(str(env), mark, lambda: next((line.split("=", 1)[1] for line in env.read_text().splitlines() if line.strip().startswith(f"{DEVELOPING}=")), ""))
