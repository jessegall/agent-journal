import json
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from typing import ClassVar

from engine.fields import Loaded
from engine.transcript import Turn
from providers.payload import AgentCall, AskCall, AskedQuestion, BashCall, Dispatch, FetchCall, Hook, PERMISSION, ReadCall, STATUS, SearchCall, SkillCall, UsageWindow, WriteCall, FileEdit
from resources.base import Refused
from engine.stored import read_json, tail, write_text

RECENT: dict[str, tuple] = {}
FOLDS: dict[tuple, tuple] = {}
TRANSCRIPTS: dict[str, tuple] = {}
SEAM = 256
RECENT_BYTES = 1_000_000
RECENT_ROWS = 1000
EDITS_BYTES = 8_000_000
LEGACY = ".journal/hook.py"


def journal_hook(text: str) -> bool:
    return LEGACY in text or ("/hook.sh " in text and "/.journal" in text)


def parsed(line: str):
    try:
        return json.loads(line)
    except ValueError:
        return None


@dataclass(frozen=True)
class Decision(Loaded):
    decision: str = ""


class Provider(ABC):
    name = ""
    question_tools = frozenset()
    tool_kinds: ClassVar[dict] = {"Bash": BashCall, "Read": ReadCall, "NotebookRead": ReadCall, "Edit": WriteCall, "MultiEdit": WriteCall, "Write": WriteCall,
                                  "NotebookEdit": WriteCall, "Grep": SearchCall, "Glob": SearchCall, "WebSearch": SearchCall, "WebFetch": FetchCall,
                                  "Skill": SkillCall, "Agent": AgentCall, "Task": AgentCall}
    briefing_file = ""
    skill_home = ""
    link_skills = False
    retired_skill_homes = ()
    sleeping_tools = ()
    edit_mark = b""
    controls = {"groups": [], "note": "This CLI does not expose model controls."}

    @classmethod
    def control_options(cls, current_model: str = "") -> dict:
        return cls.controls

    @classmethod
    def control_choice(cls, action: str, value: str, current_model: str = "") -> dict:
        configured = cls.control_options(current_model)
        group = next((group for group in configured.get("groups", []) if group["key"] == action), None)
        selected = next((item for item in (group or {}).get("choices", []) if item["value"] == value), None)
        if not selected:
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

    def refused(self, response: dict) -> bool:
        return Decision.from_json(response).decision == "block"

    def context(self, hook: Hook) -> float | None:
        return None

    def usage(self, path: Path, now: float | None = None) -> list[UsageWindow] | None:
        return None

    def dispatch(self, tool) -> Dispatch | None:
        return None

    def shell_command(self, tool) -> str | None:
        return tool.command if isinstance(tool, BashCall) else None

    def shell_wrapper(self, script: Path) -> dict:
        return {}

    def unwrapped_command(self, command: str) -> str:
        return command

    def shell_runs(self, path: Path) -> list[tuple[float, str]]:
        return []

    def skill_load(self, name: str) -> str:
        return f"Skill: {name}"

    def question(self, tool) -> bool:
        return tool.name in self.question_tools

    def asked_questions(self, tool) -> list[AskedQuestion]:
        return [question for question in tool.questions if question.text] if isinstance(tool, AskCall) else []

    def session(self, path: Path | None) -> dict:
        return {}

    def inbox(self, hook: Hook) -> str:
        return ""

    def model(self, hook: Hook) -> str:
        return hook.model

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return ""

    def recent(self, path: Path | None) -> list[dict]:
        try:
            size = Path(path).stat().st_size
        except (OSError, TypeError):
            return []
        held = RECENT.get(str(path))
        if held and held[0] == size:
            return held[1]
        if held and held[0] < size <= held[0] + RECENT_BYTES:
            with Path(path).open("rb") as source:
                source.seek(held[0])
                raw = source.read(size - held[0])
            whole = raw[:raw.rfind(b"\n") + 1]
            added = [self.row_of(row) for row in (parsed(line) for line in whole.decode(errors="replace").splitlines()) if isinstance(row, dict)]
            rows = (held[1] + added)[-RECENT_ROWS:]
            RECENT[str(path)] = (held[0] + len(whole), rows)
            return rows
        rows = [self.row_of(row) for row in (parsed(line) for line in tail(path, RECENT_BYTES)) if isinstance(row, dict)][-RECENT_ROWS:]
        RECENT[str(path)] = (size, rows)
        return rows

    def entries(self, path: Path | None) -> list[tuple[int, dict]]:
        try:
            raw = Path(path).read_text().splitlines()
        except (OSError, TypeError):
            return []
        found = []
        for i, line in enumerate(raw, 1):
            try:
                row = json.loads(line)
            except ValueError:
                continue
            if isinstance(row, dict):
                found.append((i, self.row_of(row)))
        return found

    def settling(self, path: Path) -> bool:
        return False

    def transcript(self, path: Path) -> list:
        try:
            size = Path(path).stat().st_size
        except (OSError, TypeError):
            return []
        held = TRANSCRIPTS.get(str(path))
        offset, count, turns, seam = held if held and held[0] <= size else (0, 0, [], b"")
        with Path(path).open("rb") as source:
            source.seek(max(0, offset - len(seam)))
            if source.read(len(seam)) != seam:
                offset, count, turns, seam = 0, 0, [], b""
            source.seek(offset)
            raw = source.read(size - offset)
        if raw:
            whole = raw[:raw.rfind(b"\n") + 1]
            lines = whole.split(b"\n")[:-1]
            turns = self.refine(turns + self.read_turns(lines, count))
            count += len(lines)
            TRANSCRIPTS[str(path)] = (offset + len(whole), count, turns, (seam + whole)[-SEAM:])
        return turns

    def tail(self, path: Path, span: int = RECENT_BYTES) -> list:
        try:
            with Path(path).open("rb") as source:
                start = max(0, source.seek(0, 2) - span)
                source.seek(start)
                raw = source.read()
        except (OSError, TypeError):
            return []
        lines = raw[:raw.rfind(b"\n") + 1].split(b"\n")[:-1]
        return self.refine(self.read_turns(lines[1:] if start else lines, 0))

    def read_turns(self, lines: list[bytes], count: int) -> list:
        turns = []
        for i, line in enumerate(lines, count + 1):
            row = parsed(line.decode(errors="replace"))
            turn = self.turn(self.row_of(row)) if isinstance(row, dict) else None
            if turn:
                turns.append(Turn(i, *turn))
        return turns

    def refine(self, turns: list[Turn]) -> list[Turn]:
        return turns

    def row_of(self, raw: dict):
        return raw

    def turn(self, row: dict) -> tuple[str, str] | None:
        return None

    def tools(self, path: Path) -> list[dict]:
        return [use for _, row in self.entries(path) for use in self.tool_uses(row)]

    def tool_uses(self, row: dict) -> list[dict]:
        return []

    def crew(self, path: Path) -> dict:
        return {}

    def stop_instruction(self, task: str) -> str:
        return f"stop task {task} now"

    def conversation_file(self, conversation: str) -> Path | None:
        return None

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        return None

    def is_subagent(self, hook) -> bool:
        return False

    def thoughts(self, transcript: Path, offset: int) -> tuple[list[tuple[str, str]], int]:
        return [], offset

    def file_edits(self, transcript: Path, offset: int) -> tuple[list[FileEdit], int]:
        try:
            with Path(transcript).open("rb") as source:
                size = source.seek(0, 2)
                start = offset if 0 < offset <= size else max(0, size - EDITS_BYTES)
                source.seek(start)
                raw = source.read(size - start)
        except (OSError, TypeError):
            return [], offset
        whole = raw[:raw.rfind(b"\n") + 1]
        lines = whole.split(b"\n")[:-1]
        cut = lines[1:] if start and start != offset else lines
        rows = (parsed(line.decode(errors="replace")) for line in cut if self.edit_mark in line)
        return [edit for row in rows if isinstance(row, dict) for edit in self.edits_in(row)], start + len(whole)

    def edits_in(self, raw: dict) -> list[FileEdit]:
        return []

    def status(self, hook) -> str:
        return "idle" if hook.tool.name in self.sleeping_tools else STATUS[hook.event]

    def facts(self, row, hook, root: Path) -> dict:
        context = self.context(hook)
        return {"event": hook.event, "tool": hook.tool.name, **self.session(hook.transcript), "file": hook.tool.paths[0] if hook.tool.paths else "",
                "cwd": hook.cwd or row.cwd or "", "at": time.time(),
                "provider": self.name, "uses": int(row.uses) + (hook.event == "PreToolUse"), "transcript": str(hook.transcript) if hook.transcript else row.transcript,
                "inbox": self.inbox(hook) or row.inbox or "", "model": self.model(hook) or row.model or "",
                "effort": self.effort(Path(hook.cwd or root.parent), hook.transcript), "started": row.started or time.time(),
                "context": row.context or 0 if context is None else context, "asking": self.asking(hook),
                "last_message": hook.last_message or row.last_message or ""}

    def asking(self, hook) -> dict:
        return {"tool": hook.tool.name, "call": hook.tool.text[:300], "at": time.time()} if hook.event == PERMISSION else {}

    def read_ahead(self, path: Path) -> None:
        self.transcript(path)
        self.loaded_skills(path)
        self.recent(path)

    def loaded_skills(self, path: Path) -> dict[str, float]:
        return dict(self.folded(path, self.skill_loads, dict))

    def starts_window(self, row: dict) -> bool:
        return False

    def skill_loads(self, loads: dict, row: dict) -> dict:
        if self.starts_window(row):
            loads.clear()
        for use in self.tool_uses(row):
            if use.name == "Skill" and use.skill:
                loads[use.skill] = use.at
        return loads

    def folded(self, path: Path, fold, start):
        key = (str(path), fold.__name__)
        try:
            size = Path(path).stat().st_size
        except (OSError, TypeError):
            return start()
        offset, state = FOLDS.get(key) or (0, start())
        if size < offset:
            offset, state = 0, start()
        if size > offset:
            with Path(path).open("rb") as source:
                source.seek(offset)
                raw = source.read(size - offset)
            whole = raw[:raw.rfind(b"\n") + 1]
            for line in whole.decode(errors="replace").splitlines():
                row = parsed(line)
                if isinstance(row, dict):
                    state = fold(state, self.row_of(row))
            offset += len(whole)
        FOLDS[key] = (offset, state)
        return state

    @abstractmethod
    def present(self, project: Path) -> bool: ...

    def settings(self, project: Path) -> dict:
        return read_json(self.config(project), {})

    def hook_files(self, project: Path) -> list[Path]:
        return [self.config(project)]

    def hooks(self, project: Path) -> dict:
        return self.settings(project).get("hooks", {})

    def hooks_elsewhere(self, project: Path) -> list[dict]:
        found = []
        for f in self.hook_files(project):
            if f == self.config(project):
                continue
            hooks = (read_json(f, {}) or {}).get("hooks") or {}
            if hooks:
                shown = f"~/{f.relative_to(Path.home())}" if f.is_relative_to(Path.home()) and not f.is_relative_to(project) else str(f.relative_to(project))
                found.append({"path": shown, "hooks": hooks})
        return found

    def set_hooks(self, project: Path, hooks: dict) -> dict:
        for event, blocks in hooks.items():
            if not isinstance(blocks, list) or not all(isinstance(b, dict) and isinstance(b.get("hooks"), list) and all(isinstance(h, dict) and str(h.get("command", "")).strip() for h in b["hooks"]) for b in blocks):
                raise ValueError(f"{event}: every block needs a list of hooks, each with a command")
        had = self.settings(project)
        had["hooks"] = {event: blocks for event, blocks in hooks.items() if blocks}
        self.save(project, had)
        return had["hooks"]

    def save(self, project: Path, settings: dict) -> Path:
        f = self.config(project)
        f.parent.mkdir(parents=True, exist_ok=True)
        write_text(f, json.dumps(settings, indent=2) + "\n")
        return f

    def wire(self, project: Path, command: str) -> Path:
        had = self.settings(project)
        hooks = had.setdefault("hooks", {})
        name, root = command.split("/hook.", 1)[1].split()[1:3]
        ours = f" {name} {root}"
        for event, blocks in self.wiring(command)["hooks"].items():
            mine = [b for b in hooks.get(event, []) if command in json.dumps(b) or not (("/hook." in json.dumps(b) and ours in json.dumps(b)) or LEGACY in json.dumps(b))]
            if not any(command in json.dumps(b) for b in mine):
                mine.extend(blocks)
            hooks[event] = mine
        return self.save(project, had)
