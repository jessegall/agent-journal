from pathlib import Path

from v2.providers.base import EVENTS, Provider


class Codex(Provider):
    name = "codex"

    def config(self, project: Path) -> Path:
        return project / ".codex" / "hooks.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}]
                          for event in EVENTS}}
