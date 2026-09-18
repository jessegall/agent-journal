import shutil
from pathlib import Path

from v2.providers.base import EVENTS, Provider


class Codex(Provider):
    name = "codex"

    def present(self, project: Path) -> bool:
        return (project / ".codex").is_dir() or shutil.which("codex") is not None

    def config(self, project: Path) -> Path:
        return project / ".codex" / "hooks.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}]
                          for event in EVENTS}}
