import json
import re
import shutil
import time
from abc import ABC, abstractmethod
from pathlib import Path

from v2.controllers.types import CONTROLLERS
from v2.engine.actors import IDLE, STOPPED, WORKING
from v2.engine.record import Record
from v2.engine.transcript import Turn
from v2.resources.base import SYSTEM

STATUS = {"SessionStart": IDLE, "Stop": IDLE, "UserPromptSubmit": WORKING, "PreToolUse": WORKING,
          "PostToolUse": WORKING, "SessionEnd": STOPPED}
EVENTS = tuple(STATUS)
WRITES = ("Edit", "Write", "MultiEdit", "NotebookEdit")
WRITING_COMMANDS = re.compile(r"(^|[;&|]\s*)(rm|mv|cp|git (commit|push|rm|mv)|sed -i|tee|touch|mkdir|npm install|pip install)\b|>>?\s*\S")


def gate_file(root: Path, env: str, session: str) -> Path:
    return root / "runtime" / f"gate-{env}-{session}.json"


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
        if event == "PreToolUse" and self.writes(payload):
            return self.refusal(self.gate(root, env, row.title))
        if event == "SessionStart":
            return self.handover(self.start(root, env))
        return {}

    def start(self, root: Path, env: str) -> str:
        f = root / "runtime" / f"start-{env}.md"
        return f.read_text() if f.is_file() else ""

    def handover(self, text: str) -> dict:
        return {"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": text}} if text else {}

    def gate(self, root: Path, env: str, session: str) -> str:
        try:
            holds = json.loads(gate_file(root, env, session).read_text())
        except (OSError, ValueError):
            return ""
        return "; ".join(why for why in holds.values() if why)

    def writes(self, payload: dict) -> bool:
        tool = payload.get("tool_name") or ""
        if tool in WRITES:
            return True
        return tool == "Bash" and bool(WRITING_COMMANDS.search(str((payload.get("tool_input") or {}).get("command") or "")))

    def refusal(self, why: str) -> dict:
        return {"decision": "block", "reason": why} if why else {}

    def context(self, payload: dict) -> float | None:
        return None

    def transcript(self, path: Path) -> list:
        turns = []
        try:
            raw = Path(path).read_text().splitlines()
        except OSError:
            return turns
        for i, line in enumerate(raw, 1):
            try:
                turn = self.turn(json.loads(line))
            except ValueError:
                continue
            if turn:
                turns.append(Turn(i, *turn))
        return turns

    def turn(self, row: dict) -> tuple[str, str] | None:
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
