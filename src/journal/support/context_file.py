import json
from pathlib import Path


class ContextFile:
    """Claude reports its context, model and effort through its statusline script, not a hook: the script writes one file per session, and this reads the latest."""

    def __init__(self, home: Path) -> None:
        self.home = home
        self._whole: dict[str, dict] = {}
        """The last whole reading per session: the statusline writes its file while this reads it, so a read may catch it half written."""

    def of(self, session: str) -> float | None:
        used = self.status(session).get("context_window", {}).get("used_percentage")
        return used / 100 if used is not None else None

    def status(self, session: str) -> dict:
        path = self.home / f"{session}.json"
        if not path.is_file():
            return {}
        try:
            self._whole[session] = json.loads(path.read_text() or "{}")
        except json.JSONDecodeError:
            return self._whole.get(session, {})
        return self._whole[session]

    def model(self, session: str) -> str:
        return self.status(session).get("model", {}).get("display_name", "")

    def effort(self, session: str) -> str:
        return self.status(session).get("effort", {}).get("level", "")

    def usage(self, session: str) -> list[dict]:
        """Claude's plan windows as the statusline reports them: how much is used and when each resets."""
        limits = self.status(session).get("rate_limits", {})
        return [{"key": key, "label": label, "used": limits[key].get("used_percentage", 0), "resets": limits[key].get("resets_at", 0)}
                for key, label in (("five_hour", "5h"), ("seven_day", "7d")) if isinstance(limits.get(key), dict)]
