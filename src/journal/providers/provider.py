import json
import re
import shlex
from abc import ABC, abstractmethod
from datetime import datetime
from pathlib import Path
from typing import Callable, ClassVar, Iterator

from journal.support.tool_call import ToolCall
from journal.support.operation import Operation
from journal.models.mcp_server import McpServer
from journal.providers.support.agent_status import AgentStatus
from journal.providers.support.context_file import ContextFile
from journal.providers.support.hooks_ready import HooksReady
from journal.providers.support.profile import Profile
from journal.support.undecoded_tool import UndecodedTool
from journal.support.alias_call import AliasCall
from journal.support.chain import Chain
from journal.support.command_part import CommandPart
from journal.support.reads import Reads
from journal.support.writes import Writes
from journal.features.shell.support.output_reads import OutputReads
from journal.providers.support.profile_view import ProfileView
from journal.support.decision import Decision
from journal.support.hook import Hook
from journal.support.hook_kind import HookKind
from journal.support.response import Response
from journal.events.agent.peer_message import PeerMessage
from journal.providers.support.turn import Turn
from journal.providers.support.file_writes import FileWrites
from journal.providers.support.capability import Capability
from journal.providers.support.worker_outcome import WorkerOutcome
from journal.support.choice import Choice
from journal.providers.support.status_line import StatusLine

CONTEXT_HOOKS = (HookKind.SESSION_START, HookKind.USER_PROMPT, HookKind.PRE_TOOL_USE, HookKind.POST_TOOL_USE)


TAIL_BYTES = 400_000
HOOK_SCRIPT = Path(__file__).resolve().parents[1] / "hooks" / "hook.sh"
PATH_KEYS = ("file_path", "path", "notebook_path")

VERSION_3_HOOKS = ("/.journal/src/hook.sh", "/.journal/hook.py", "/.journal/journal hook")

class Provider(ABC):
    """One agent program, Claude Code or Codex: everything the journal knows about it, and nowhere else."""

    name: ClassVar[str]
    home: ClassVar[str]
    settings_file: ClassVar[str]
    prompt_flags: ClassVar[tuple[str, ...]]
    session_variable: ClassVar[str]
    user_line_key: ClassVar[str] = ""
    inherited_markers: ClassVar[tuple[str, ...]]
    question_model: ClassVar[str]
    settings_files: ClassVar[tuple[str, ...]]
    settings_extras: ClassVar[dict] = {}
    foreign_settings: ClassVar[tuple[str, ...]] = ()
    hook_kinds: ClassVar[tuple[HookKind, ...]] = tuple(HookKind)
    controls: ClassVar[dict] = {"groups": [], "note": ""}
    capabilities: ClassVar[frozenset[Capability]]
    decoders: ClassVar[dict[str, Callable[[dict], Operation]]]
    profile_suffix: ClassVar[str]
    default: ClassVar[bool]
    session_inbox: ClassVar[bool]

    def __init__(self) -> None:
        self._status_files: dict[Path, ContextFile] = {}

    @abstractmethod
    def profile_model(self, profile: ProfileView) -> str: ...

    @abstractmethod
    def transcript(self, project: Path, session: str) -> Path | None: ...

    @abstractmethod
    def latest_session(self, project: Path, start: float) -> str: ...

    @abstractmethod
    def subagent_transcript(self, project: Path, parent: str, agent_id: str) -> Path | None: ...

    def turns(self, path: Path) -> list[Turn]:
        return self.turn_rows(self.json_lines(path))

    @abstractmethod
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

    @abstractmethod
    def turn_thoughts(self, project: Path, session: str) -> list[str]: ...

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
        return self.path_texts(self.transcript(project, session), read)

    def path_texts(self, path: Path | None, read: int) -> FileWrites:
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

    @abstractmethod
    def texts(self, line: dict) -> list[str]: ...

    @abstractmethod
    def peer_messages(self, line: dict) -> list[PeerMessage]: ...

    @staticmethod
    def last_line_start(path: Path, size: int) -> int:
        with path.open("rb") as file:
            file.seek(max(0, size - TAIL_BYTES))
            tail = file.read()
        body = tail[:-1] if tail.endswith(b"\n") else tail
        cut = body.rfind(b"\n")
        return max(0, size - TAIL_BYTES) + cut + 1 if cut != -1 else max(0, size - TAIL_BYTES)

    @abstractmethod
    def interactive_command(self, choice: Choice, status: StatusLine, args: tuple[str, ...]) -> list[str]: ...

    @abstractmethod
    def launch_environment(self, runner: Path) -> dict[str, str]: ...

    @abstractmethod
    def resume(self, session: str) -> tuple[str, ...]: ...

    def copy_session(self, source: Path, target: Path, session: str) -> bool:
        return self.transcript(target, session) is not None or self.transcript(source, session) is not None

    def status(self, session: str, home: Path) -> AgentStatus:
        return self._status_files.setdefault(home, ContextFile(home)).reading(session)

    @abstractmethod
    def write_mcp(self, project: Path, servers: list[McpServer]) -> Path: ...

    @abstractmethod
    def profile_text(self, profile: Profile, model: str, codex_model: str) -> str: ...

    @abstractmethod
    def worker_command(self, brief: str, model: str, resume: str, session: str) -> list[str]: ...

    @abstractmethod
    def worker_session(self, resume: str) -> str: ...

    @abstractmethod
    def worker_hook_file(self, folder: Path, runtime: Path) -> Path: ...

    @abstractmethod
    def worker_outcome(self, output: str, err: str) -> WorkerOutcome: ...

    def output_session(self, output: str, err: str) -> str:
        return ""

    def answer(self, hook: Hook, decision: Decision) -> Response:
        return self.reply(hook, decision, self.user_line_key)

    def agent_answer(self, hook: Hook, decision: Decision) -> Response:
        return self.reply(hook, decision, "")

    def reply(self, hook: Hook, decision: Decision, copy_key: str) -> Response:
        kind = hook.kind
        if kind == HookKind.STOP and (not decision.allowed or decision.context):
            return Response(200, {"decision": "block", "reason": "\n".join(part for part in (decision.reason, decision.context) if part)})
        if not decision.allowed:
            return Response(409, {"error": decision.reason})
        if not decision.context:
            return Response(200, {})
        if kind in CONTEXT_HOOKS:
            shown = {copy_key: decision.context} if copy_key else {}
            return Response(200, {"hookSpecificOutput": {"hookEventName": kind.value, "additionalContext": decision.context}, **shown})
        return Response(200, {})

    def hook_command(self, root: Path) -> str:
        return f"test -f {shlex.quote(str(HOOK_SCRIPT))} && exec {shlex.join(['sh', str(HOOK_SCRIPT), self.name, str(root)])}; exit 0"

    @abstractmethod
    def worker_settings_flags(self, path: Path) -> list[str]: ...

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

    @abstractmethod
    def hooks_ready(self, project: Path) -> HooksReady: ...

    def is_wired(self, project: Path) -> bool:
        path = project / self.home / self.settings_file
        hooks = (json.loads(path.read_text()).get("hooks") or {}) if path.is_file() else {}
        return any(self.journal_paths(block) for blocks in hooks.values() for block in blocks)

    def operation(self, tool: str, input: dict) -> Operation:
        decoder = self.decoders.get(tool)
        return decoder(input) if decoder else UndecodedTool(tool)

    def call(self, tool: str, input: dict, aliases: frozenset[str]) -> ToolCall:
        operation = self.operation(tool, input)
        return ToolCall.decoded(tool, input, operation, tuple(self.parts(operation.line(), aliases)))

    @staticmethod
    def parts(command: str, aliases: frozenset[str]) -> list[CommandPart]:
        recorded = [part for part in Chain.parts(command) if part.recorded] if command else []
        return [CommandPart(text=part.text, is_journal=Chain.is_journal(part.text) and AliasCall.parsed(part.text).name not in aliases, writes=Writes.part(part.text), files=tuple(Writes.part_targets(part.text) or Reads.part(part.text)), reads_output=OutputReads.is_one(part.text), read_shape=OutputReads.shape(part.text) if OutputReads.is_one(part.text) else part.text) for part in recorded]

    @staticmethod
    def file_paths(input: dict) -> tuple[str, ...]:
        return tuple(value for key in PATH_KEYS if isinstance(value := input.get(key), str) and value)

    @staticmethod
    def folder_name(project: Path) -> str:
        return re.sub(r"[^A-Za-z0-9]", "-", str(project.resolve()))
