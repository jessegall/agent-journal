import json
import time
from abc import ABC, abstractmethod
from pathlib import Path

from v2.controllers.types import CONTROLLERS
from v2.engine.actors import IDLE, STOPPED, WORKING
from v2.engine.record import Record
from v2.resources.base import SYSTEM

STATUS = {"SessionStart": IDLE, "Stop": IDLE, "UserPromptSubmit": WORKING, "PreToolUse": WORKING,
          "PostToolUse": WORKING, "SessionEnd": STOPPED}
EVENTS = tuple(STATUS)


class Provider(ABC):
    name = ""

    @abstractmethod
    def config(self, project: Path) -> Path: ...

    @abstractmethod
    def wiring(self, command: str) -> dict: ...

    def session_of(self, payload: dict) -> str:
        return Path(str(payload.get("transcript_path") or payload.get("session_id") or "")).stem

    def handle(self, root: Path, env: str, payload: dict) -> dict:
        event = payload.get("hook_event_name") or ""
        if event not in STATUS:
            return {}
        agents = CONTROLLERS["agent"](Record(root, env), actor=SYSTEM)
        row = agents.by_session(self.session_of(payload))
        agents.update(row.n, status=STATUS[event], event=event, tool=payload.get("tool_name") or "",
                      at=time.time(), provider=self.name)
        return {}

    def wire(self, project: Path, command: str) -> Path:
        f = self.config(project)
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps(self.wiring(command), indent=2) + "\n")
        return f
