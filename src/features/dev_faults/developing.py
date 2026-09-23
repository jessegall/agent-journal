import os
from pathlib import Path

READ: dict[str, tuple] = {}
DEVELOPING = "DEVELOPMENT_MODE"


def developing(project: Path) -> bool:
    value = os.environ.get(DEVELOPING, "") or declared(project / ".env")
    return value.strip().strip("'\"").lower() in ("1", "true", "yes", "on")


def declared(env: Path) -> str:
    try:
        mark = env.stat().st_mtime_ns
    except OSError:
        return ""
    held = READ.get(str(env))
    if not held or held[0] != mark:
        held = READ[str(env)] = (mark, next((line.split("=", 1)[1] for line in env.read_text().splitlines() if line.strip().startswith(f"{DEVELOPING}=")), ""))
    return held[1]
