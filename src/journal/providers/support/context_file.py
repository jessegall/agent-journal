import json
from pathlib import Path

from journal.providers.support.agent_status import AgentStatus
from journal.providers.support.rate_window import RateWindow


class ContextFile:
    """What a program reports about a session through the journal's status script, not a hook: the script writes one file per session, Claude Code's status line feeds it and Codex has none, and this reads the latest whole one."""

    def __init__(self, home: Path) -> None:
        self.home = home
        self._whole: dict[str, dict] = {}

    def build(self, session: str) -> float | None:
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

    def windows(self, session: str) -> tuple[RateWindow, ...]:
        limits = self.status(session).get("rate_limits", {})
        return tuple(RateWindow(key, label, limits[key].get("used_percentage", 0), limits[key].get("resets_at", 0)) for key, label in (("five_hour", "5h"), ("seven_day", "7d")) if isinstance(limits.get(key), dict))

    def reading(self, session: str) -> AgentStatus:
        return AgentStatus(self.model(session), self.effort(session), self.build(session), self.windows(session))
