import os
from pathlib import Path

DEVELOPING = "DEVELOPMENT_MODE"


def developing(project: Path) -> bool:
    value = os.environ.get(DEVELOPING, "")
    try:
        value = value or next((line.split("=", 1)[1] for line in (project / ".env").read_text().splitlines() if line.strip().startswith(f"{DEVELOPING}=")), "")
    except OSError:
        pass
    return value.strip().strip("'\"").lower() in ("1", "true", "yes", "on")
