import json
import shutil
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
        uses = int(row.data.get("uses") or 0) + (event == "PreToolUse")
        context = self.context(payload)
        agents.update(row.n, status=STATUS[event], event=event, tool=payload.get("tool_name") or "",
                      at=time.time(), provider=self.name, uses=uses,
                      context=row.data.get("context") or 0 if context is None else context)
        return {}

    def context(self, payload: dict) -> float | None:
        return None

    @abstractmethod
    def present(self, project: Path) -> bool: ...

    def wire(self, project: Path, command: str) -> Path:
        f = self.config(project)
        f.parent.mkdir(parents=True, exist_ok=True)
        try:
            had = json.loads(f.read_text())
        except (OSError, ValueError):
            had = {}
        hooks = had.setdefault("hooks", {})
        for event, blocks in self.wiring(command)["hooks"].items():
            mine = hooks.setdefault(event, [])
            if not any(command in json.dumps(b) for b in mine):
                mine.extend(blocks)
        f.write_text(json.dumps(had, indent=2) + "\n")
        return f
