import json
import re
import shutil
import time
from abc import ABC, abstractmethod
from pathlib import Path

from engine.transcript import Turn
from providers.payload import Hook
from resources.types import AgentRow, COMMAND, RUNNING

WRITES = ("Edit", "Write", "MultiEdit", "NotebookEdit")
WRITING_COMMANDS = re.compile(r"(^|[;&|]\s*)(rm|mv|cp|git (commit|push|rm|mv)|sed -i|tee|touch|mkdir|npm install|pip install)\b|(?<![\d&])>>?\s*(?!/dev/null|&)\S")
RING = 12
JOURNAL_COMMAND = re.compile(r"(^|[;&|]\s*)(\S*journal(\.py)?)\s")


class Provider(ABC):
    name = ""
    question_tools = frozenset()
    briefing_file = ""
    skill_home = ""
    link_skills = False
    retired_skill_homes = ()
    controls = {"groups": [], "note": "This CLI does not expose model controls."}
    usage_note = "This CLI does not expose plan usage."

    @classmethod
    def control_options(cls, current_model: str = "") -> dict:
        return cls.controls

    @classmethod
    def control_choice(cls, action: str, value: str, current_model: str = "") -> dict:
        configured = cls.control_options(current_model)
        group = next((group for group in configured.get("groups", []) if group["key"] == action), None)
        selected = next((item for item in (group or {}).get("choices", []) if item["value"] == value), None)
        if not selected:
            from resources.base import Refused
            raise Refused(f"{cls.name or 'this agent'} does not support {action} {value!r}")
        return {"action": action, **selected}

    @abstractmethod
    def config(self, project: Path) -> Path: ...

    @abstractmethod
    def wiring(self, command: str) -> dict: ...

    def compacted(self, hook: Hook) -> bool:
        return False

    def response(self, event: str = "", text: str = "", blocked: str = "") -> dict:
        if blocked:
            return {"decision": "block", "reason": blocked}
        return {"hookSpecificOutput": {"hookEventName": event, "additionalContext": text}} if text else {}

    def writes(self, hook: Hook) -> bool:
        if hook.tool.name in WRITES:
            return True
        return hook.tool.name == "Bash" and not JOURNAL_COMMAND.search(hook.command) and bool(WRITING_COMMANDS.search(hook.command))

    def shell(self, row, hook: Hook) -> dict:
        doing = hook.tool.doing.strip()[:400]
        running = dict(row.running)
        if hook.event == "UserPromptSubmit":
            return {AgentRow.running: {}, AgentRow.commands: list(row.commands)}
        if hook.event == "PreToolUse" and doing:
            now = time.time()
            changed = running.get(RUNNING.changed)
            running = {RUNNING.what: doing, RUNNING.tool: hook.tool.name, RUNNING.at: now, **({RUNNING.changed: changed} if changed else {})}
            return {AgentRow.running: running, AgentRow.commands: (list(row.commands) + [{COMMAND.what: doing, COMMAND.tool: hook.tool.name, COMMAND.at: now}])[-RING:]}
        if running and not running.get(RUNNING.done):
            running[RUNNING.done] = time.time()
        return {AgentRow.running: running, AgentRow.commands: list(row.commands)}

    def context(self, hook: Hook) -> float | None:
        return None

    def usage(self, path: Path, now: float | None = None) -> dict | None:
        return None

    def dispatch(self, tool) -> dict:
        return {}

    def question(self, tool) -> bool:
        return tool.name in self.question_tools

    def session(self, path: Path | None) -> dict:
        return {}

    def model(self, hook: Hook) -> str:
        return hook.model

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
        return self.refine(turns)

    def refine(self, turns: list[Turn]) -> list[Turn]:
        return turns

    def turn(self, row: dict) -> tuple[str, str] | None:
        return None

    def tools(self, path: Path) -> list[dict]:
        try:
            raw = Path(path).read_text().splitlines()
        except OSError:
            return []
        found = []
        for line in raw:
            try:
                found.extend(self.tool_uses(json.loads(line)))
            except ValueError:
                continue
        return found

    def tool_uses(self, row: dict) -> list[dict]:
        return []

    def crew(self, path: Path) -> dict:
        uses = self.tools(path)
        skills = sorted({str((u.get("input") or {}).get("skill") or "") for u in uses if u.get("name") == "Skill"} - {""})
        shells = sum(1 for u in uses if u.get("name") == "Bash" and (u.get("input") or {}).get("run_in_background"))
        subagents = sum(1 for u in uses if u.get("name") in ("Agent", "Task"))
        return {"skills": skills, "shells": shells, "subagents": subagents, "shell_rows": [], "subagent_rows": []}

    def loaded_skills(self, path: Path) -> dict[str, float]:
        return {str((use.get("input") or {}).get("skill")): float(use.get("at") or 0) for use in self.tools(path)
                if use.get("name") == "Skill" and (use.get("input") or {}).get("skill")}

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
