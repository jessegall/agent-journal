import json
import re
from datetime import datetime
from pathlib import Path
from typing import ClassVar, Iterator

from journal.support.chain import Chain
from journal.support.command_part import CommandPart
from journal.support.reads import Reads
from journal.support.tool_call import ToolCall
from journal.support.writes import Writes
from journal.features.shell.support.output_reads import OutputReads
from journal.support.decision import Decision
from journal.support.hook import Hook
from journal.support.hook_kind import HookKind
from journal.support.response import Response
from journal.models.entry import Entry
from journal.support.file_lines import FileLines
from journal.support.tool_input import ToolInput
from journal.events.agent.peer_message import PeerMessage
from journal.providers.support.turn import Turn
from journal.providers.support.file_writes import FileWrites

CONTEXT_HOOKS = (HookKind.SESSION_START, HookKind.USER_PROMPT, HookKind.PRE_TOOL_USE, HookKind.POST_TOOL_USE)


TAIL_BYTES = 400_000
PATH_KEYS = ("file_path", "path", "notebook_path")

VERSION_3_HOOKS = ("/.journal/src/hook.sh", "/.journal/hook.py", "/.journal/journal hook")

class Provider:
    """One agent program, Claude or Codex: the few things the journal has to know about it and nothing else."""

    name: ClassVar[str]
    home: ClassVar[str]
    settings_file: ClassVar[str]
    edit_tools: ClassVar[frozenset[str]]
    read_tool: ClassVar[str]
    shell_tool: ClassVar[str] = "Bash"
    prompt_flags: ClassVar[tuple[str, ...]] = ()
    settings_extras: ClassVar[dict] = {}
    foreign_settings: ClassVar[tuple[str, ...]] = ()
    hook_kinds: ClassVar[tuple[HookKind, ...]] = tuple(HookKind)
    controls: ClassVar[dict] = {"groups": [], "note": ""}

    def transcript(self, project: Path, session: str) -> Path | None: ...

    def latest_session(self, project: Path, start: float) -> str:
        return ""

    def subagent_transcript(self, project: Path, parent: str, agent_id: str) -> Path | None:
        return None

    def turns(self, path: Path) -> list[Turn]:
        return self.turn_rows(self.json_lines(path))

    def turn_rows(self, rows: Iterator[tuple[int, dict]]) -> list[Turn]: ...

    @staticmethod
    def json_lines(path: Path) -> Iterator[tuple[int, dict]]:
        text = path.read_text(errors="replace")
        return Provider.rows(text[: text.rfind("\n") + 1], 0)

    @staticmethod
    def rows(text: str, previous: int) -> Iterator[tuple[int, dict]]:
        for number, line in enumerate(text.splitlines(), previous + 1):
            if line.startswith("{"):
                yield number, json.loads(line)

    @staticmethod
    def seconds(stamp: str) -> float:
        return datetime.fromisoformat(stamp.replace("Z", "+00:00")).timestamp() if stamp else 0.0

    def turn_thoughts(self, project: Path, session: str) -> list[str]:
        return []

    def earlier_texts(self, project: Path, session: str, read: int, deadline: float) -> FileWrites:
        path = self.transcript(project, session)
        if path is None or read < 0:
            return FileWrites([], [], read)
        with path.open("rb") as file:
            file.seek(read)
            raw = file.read()
        rows, time = [], read
        for line in raw[:raw.rfind(b"\n") + 1].splitlines(keepends=True):
            row = json.loads(line) if line.startswith(b"{") else {}
            if self.seconds(str(row.get("timestamp", ""))) >= deadline:
                break
            rows.append(row)
            time += len(line)
        return self.edited_files(rows, time)

    def authored_texts(self, project: Path, session: str, read: int) -> FileWrites:
        path = self.transcript(project, session)
        if path is None:
            return FileWrites([], [], read)
        size = path.stat().st_size
        if read > size:
            return FileWrites([], [], size)
        if read < 0:
            read = self.last_line_start(path, size)
        with path.open("rb") as file:
            file.seek(read)
            raw = file.read()
        full = raw.rfind(b"\n") + 1
        lines = [json.loads(line) for line in raw[:full].decode(errors="replace").splitlines() if line.startswith("{")]
        return self.edited_files(lines, read + full)

    def edited_files(self, rows: list[dict], time: int) -> FileWrites:
        return FileWrites([text for row in rows for text in self.texts(row)], [arrived for row in rows for arrived in self.peer_messages(row)], time)

    def texts(self, line: dict) -> list[str]:
        return []

    def peer_messages(self, line: dict) -> list[PeerMessage]:
        return []

    @staticmethod
    def last_line_start(path: Path, size: int) -> int:
        with path.open("rb") as file:
            file.seek(max(0, size - TAIL_BYTES))
            tail = file.read()
        body = tail[:-1] if tail.endswith(b"\n") else tail
        cut = body.rfind(b"\n")
        return max(0, size - TAIL_BYTES) + cut + 1 if cut != -1 else max(0, size - TAIL_BYTES)

    def resume(self, session: str) -> tuple[str, ...]: ...

    def worker_command(self, brief: str, model: str, resume: str) -> list[str]:
        ...

    def worker_outcome(self, output: str, err: str) -> tuple[str, str]:
        return output.strip() or err.strip(), ""

    def answer(self, hook: Hook, decision: Decision) -> Response:
        kind = hook.kind
        if kind == HookKind.STOP and (not decision.allowed or decision.context):
            return Response(200, {"decision": "block", "reason": "\n".join(part for part in (decision.reason, decision.context) if part)})
        if not decision.allowed:
            return Response(409, {"error": decision.reason})
        if not decision.context:
            return Response(200, {})
        if kind in CONTEXT_HOOKS:
            return Response(200, {"hookSpecificOutput": {"hookEventName": kind.value, "additionalContext": decision.context}})
        return Response(200, {})

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"hooks": [{"type": "command", "command": command}]}] for kind in self.hook_kinds}

    def wire_hooks(self, project: Path, script: Path, command: str) -> Path:
        for counterpart in self.foreign_settings:
            self.unwired(project / self.home / counterpart)
        path = project / self.home / self.settings_file
        settings = json.loads(path.read_text()) if path.is_file() else {}
        hooks = {kind: [b for b in blocks if not self.journal_paths(b)] for kind, blocks in (settings.get("hooks") or {}).items()}
        for kind, blocks in self.hook_block(command).items():
            hooks[kind] = [*hooks.get(kind, []), *blocks]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({**settings, **self.settings_extras, "hooks": {k: v for k, v in hooks.items() if v}}, indent=2) + "\n")
        return path

    def unwired(self, path: Path) -> None:
        if not path.is_file():
            return
        settings = json.loads(path.read_text())
        hooks = {kind: [b for b in blocks if not self.journal_paths(b)] for kind, blocks in (settings.get("hooks") or {}).items()}
        if hooks == settings.get("hooks", {}):
            return
        settings["hooks"] = {k: v for k, v in hooks.items() if v}
        path.write_text(json.dumps({k: v for k, v in settings.items() if v or k != "hooks"}, indent=2) + "\n")

    @staticmethod
    def journal_paths(block: dict) -> bool:
        text = json.dumps(block)
        return "journal/hooks/hook.sh" in text or any(old in text for old in VERSION_3_HOOKS)

    def hooks_trusted(self, project: Path) -> bool:
        return True

    def read_paths(self, tool: str, input: dict) -> tuple[str, ...]:
        if tool == self.read_tool:
            return tuple(p for p in (ToolInput.parsed(input).file,) if p)
        return Reads.build(ToolInput.parsed(input).command) if tool == self.shell_tool else ()

    def file_lines(self, tool: str, input: dict) -> int:
        value = ToolInput.parsed(input)
        if tool != self.read_tool or not value.file or value.limit or value.offset:
            return 0
        return FileLines.build(Path(value.file).expanduser())

    def edited_paths(self, tool: str, input: dict) -> list[str]:
        if tool == self.shell_tool:
            return Writes.targets(ToolInput.parsed(input).command)
        return [value for key, value in input.items() if key in PATH_KEYS and isinstance(value, str)] if tool in self.edit_tools else []

    def skill_loaded(self, tool: str, input: dict) -> str:
        return ToolInput.parsed(input).skill if tool == "Skill" else ""

    def writes(self, tool: str, input: dict) -> bool:
        return tool in self.edit_tools or (tool == self.shell_tool and Writes.build(ToolInput.parsed(input).command))

    def call(self, tool: str, input: dict) -> ToolCall:
        command = ToolInput.parsed(input).command if tool == self.shell_tool else ""
        return ToolCall(tool=tool, input=input, command=command, parts=tuple(self.parts(command)), is_journal=bool(command) and Chain.is_journal_line(command), writes=self.writes(tool, input),
                        edited_paths=tuple(self.edited_paths(tool, input)), read_paths=self.read_paths(tool, input), file_lines=self.file_lines(tool, input), skill_loaded=self.skill_loaded(tool, input), work=Chain.work(command) if command else "")

    @staticmethod
    def parts(command: str) -> list[CommandPart]:
        recorded = [part for part in Chain.parts(command) if part.recorded] if command else []
        return [CommandPart(text=part.text, is_journal=Chain.is_journal(part.text), writes=Writes.part(part.text), files=tuple(Writes.part_targets(part.text) or Reads.part(part.text)), reads_output=OutputReads.is_one(part.text), read_shape=OutputReads.shape(part.text) if OutputReads.is_one(part.text) else part.text) for part in recorded]

    @staticmethod
    def folder_name(project: Path) -> str:
        return re.sub(r"[^A-Za-z0-9]", "-", str(project.resolve()))
