import json
from pathlib import Path


class ContextFile:
    """Claude reports its context, model and effort through its statusline script, not a hook: the script writes one file per session, and this reads the latest."""

    def __init__(self, home: Path) -> None:
        self.home = home

    def of(self, session: str) -> float | None:
        used = self.status(session).get("context_window", {}).get("used_percentage")
        return used / 100 if used is not None else None

    def status(self, session: str) -> dict:
        path = self.home / f"{session}.json"
        if not path.is_file():
            return {}
        return json.loads(path.read_text() or "{}")

    def model(self, session: str) -> str:
        return self.status(session).get("model", {}).get("display_name", "")

    def effort(self, session: str) -> str:
        return self.status(session).get("effort", {}).get("level", "")
