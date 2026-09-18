from pathlib import Path

from v2.providers.base import EVENTS, Provider


class Claude(Provider):
    name = "claude"

    def config(self, project: Path) -> Path:
        return project / ".claude" / "settings.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"hooks": [{"type": "command", "command": command}]}] for event in EVENTS}}
