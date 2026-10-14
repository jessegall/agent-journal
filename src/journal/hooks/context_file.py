import json
from pathlib import Path


class ContextFile:
    """Claude reports its context through its statusline script, not a hook: the script writes one file per session, and this reads the latest figure."""

    def __init__(self, home: Path) -> None:
        self.home = home

    def of(self, session: str) -> float | None:
        path = self.home / f"{session}.json"
        if not path.is_file():
            return None
        status = json.loads(path.read_text() or "{}")
        used = status.get("context_window", {}).get("used_percentage")
        return used / 100 if used is not None else None
