import json
import os
import re
import shlex
import tomllib
from datetime import date, timedelta
from pathlib import Path
from typing import Iterator

from journal.support.hook_kind import HookKind
from journal.providers.support.codex_row import CodexRow
from journal.features.profiles.support.profile_view import ProfileView
from journal.providers.provider import Provider
from journal.events.agent.peer_message import PeerMessage
from journal.providers.support.turn import Turn
from journal.providers.support.capability import Capability
from journal.providers.support.mcp_tables import McpTables
from journal.models.mcp_server import McpServer
from journal.providers.support.hooks_ready import HooksReady
from journal.providers.support.profile import Profile
from journal.providers.support.patch_paths import PatchPaths
from journal.support.file_edit import FileEdit
from journal.support.file_read import FileRead
from journal.support.file_write import FileWrite
from journal.support.shell_line import ShellLine
from journal.support.subagent_dispatch import SubagentDispatch
from journal.support.user_question import UserQuestion
from journal.providers.support.codex_event import CodexEvent
from journal.providers.support.worker_outcome import WorkerOutcome
from journal.support.choice import Choice
from journal.providers.support.status_line import StatusLine

SCRIPT_FLAGS = ("-c", "-lc")


class Codex(Provider):
    """OpenAI's Codex: the journal reads no thoughts, no messages between sessions and no subagent transcripts from its rollouts, so it offers none of them."""

    name = "codex"
    prompt_flags = ("--dangerously-bypass-approvals-and-sandbox",)
    home = ".codex"
    settings_file = "hooks.json"
    decoders = {
        "Bash": lambda input: ShellLine(Codex.shell_line(input.get("command", ""))),
        "apply_patch": lambda input: FileEdit(PatchPaths.build(input)),
        "write_file": lambda input: FileWrite(str(input.get("path", "") or input.get("file_path", ""))),
        "read_file": lambda input: FileRead(str(input.get("path", "") or input.get("file_path", "")), bool(input.get("offset") or input.get("limit"))),
        "collaborationspawn_agent": lambda input: SubagentDispatch(None, None, str(input.get("task_name", "")), None, True),
        "request_user_input": lambda input: UserQuestion(),
    }
    hook_kinds = tuple(kind for kind in HookKind if kind not in (HookKind.MESSAGE_DISPLAY, HookKind.POST_TOOL_USE_FAILURE))
    capabilities = frozenset()
    profile_suffix = ".toml"
    default = False
    session_inbox = False
    session_variable = "CODEX_THREAD_ID"
    inherited_markers = ("CODEX_THREAD_ID", "CODEX_SESSION_ID", "CODEX_TOOL_CALL_ID", "CODEX_CI", "CODEX_SANDBOX", "CODEX_VERSION", "CODEX_APPLY_PATCH_PRESERVE_LINE_ENDINGS")
    question_model = ""
    settings_files = (".codex/hooks.json", "~/.codex/hooks.json")
    network_access = ("-c", "sandbox_workspace_write.network_access=true")

    def __init__(self) -> None:
        super().__init__()
        self._rollouts: dict[str, Path] = {}

    @property
    def sessions(self) -> Path:
        return self.config_folder() / "sessions"

    def hooks_ready(self, project: Path) -> HooksReady:
        if not self.is_wired(project):
            return HooksReady.UNWIRED
        trusted = self.trusted_kinds(project.resolve() / self.home / self.settings_file)
        if not trusted:
            return HooksReady.UNTRUSTED
        return HooksReady.READY if trusted >= {self.state_name(kind) for kind in self.hook_kinds} else HooksReady.TRUST_OUTDATED

    @staticmethod
    def config_folder() -> Path:
        return Path(os.environ.get("CODEX_HOME") or Path.home() / ".codex")

    @staticmethod
    def trusted_kinds(hooks: Path) -> set[str]:
        settings = Codex.config_folder() / "config.toml"
        states = tomllib.loads(settings.read_text()).get("hooks", {}).get("state", {}) if settings.is_file() else {}
        return {key.rsplit(":", 3)[1] for key, state in states.items() if key.startswith(f"{hooks}:") and key.count(":") >= 3 and state.get("enabled", True)}

    @staticmethod
    def state_name(kind: HookKind) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", "_", kind.value).lower()

    @staticmethod
    def shell_line(command) -> str:
        if not isinstance(command, list):
            return str(command)
        if len(command) == 3 and command[1] in SCRIPT_FLAGS:
            return str(command[2])
        return shlex.join(str(part) for part in command)

    def profile_model(self, profile: ProfileView) -> str:
        return profile["codex_model"]

    def transcript(self, project: Path, session: str) -> Path | None:
        stored = self._rollouts.get(session)
        if stored and stored.is_file():
            return stored
        rows = next(self.sessions.glob(f"**/rollout-*-{session}.jsonl"), None)
        if rows:
            self._rollouts[session] = rows
        return rows

    def latest_session(self, project: Path, start: float) -> str:
        rollouts = [path for day in self.day_count(start) for path in (self.sessions / day).glob("rollout-*.jsonl") if path.stat().st_mtime >= start]
        for path in sorted(rollouts, key=lambda path: path.stat().st_mtime, reverse=True):
            if self.rollout_folder(path) == str(project.resolve()):
                return path.stem[-36:]
        return ""

    @staticmethod
    def day_count(start: float) -> list[str]:
        first, last = date.fromtimestamp(start) - timedelta(days=1), date.today() + timedelta(days=1)
        return [(first + timedelta(days=n)).strftime("%Y/%m/%d") for n in range((last - first).days + 1)]

    @staticmethod
    def rollout_folder(path: Path) -> str:
        with path.open() as lines:
            first = lines.readline()
        try:
            return str(json.loads(first).get("payload", {}).get("cwd", ""))
        except ValueError:
            return ""

    def subagent_transcript(self, project: Path, parent: str, agent_id: str) -> Path | None:
        return None

    def turn_rows(self, rows: Iterator[tuple[int, dict]]) -> list[Turn]:
        return [turn for number, row in rows if (turn := self.turn(number, CodexRow.parsed(row)))]

    def turn(self, number: int, row: CodexRow) -> Turn | None:
        if row.type != "response_item":
            return None
        time = self.seconds(row.timestamp)
        if row.item == "message" and row.role == "assistant" and row.text.strip():
            return Turn(number, "agent", "agent", time, row.text)
        if row.item == "message" and row.role == "user" and row.text.strip():
            return Turn(number, "user", "human", time, row.text)
        if row.item in ("function_call", "custom_tool_call"):
            return Turn(number, "agent", "agent", time, tools=[row.name])
        if row.item in ("function_call_output", "custom_tool_call_output"):
            return Turn(number, "tool", "tool", time, row.output)
        return None

    def texts(self, line: dict) -> list[str]:
        row = CodexRow.parsed(line)
        return [row.text] if row.type == "response_item" and row.item == "message" and row.role == "assistant" and row.text.strip() else []

    def turn_thoughts(self, project: Path, session: str) -> list[str]:
        return []

    def peer_messages(self, line: dict) -> list[PeerMessage]:
        return []

    def interactive_command(self, choice: Choice, status: StatusLine, args: tuple[str, ...]) -> list[str]:
        skipped = [flag for flag in self.prompt_flags if choice.prompt_flags and flag not in args]
        return ["codex", "--no-daemon", *skipped, *([] if choice.prompt_flags else self.network_access), *args]

    def launch_environment(self, runner: Path) -> dict[str, str]:
        return {}

    def resume(self, session: str) -> tuple[str, ...]:
        return ("resume", session)

    def profile_text(self, profile: Profile, model: str, codex_model: str) -> str:
        sandbox = "read-only" if profile.kind == "subagent" else "workspace-write"
        return (f"name = {json.dumps(profile.name)}\ndescription = {json.dumps(profile.description, ensure_ascii=False)}\nmodel = {json.dumps(codex_model)}\n"
                f"sandbox_mode = \"{sandbox}\"\ndeveloper_instructions = {json.dumps(profile.body, ensure_ascii=False)}\n")

    def write_mcp(self, project: Path, servers: list[McpServer]) -> Path:
        path = project / self.home / "config.toml"
        path.parent.mkdir(exist_ok=True)
        path.write_text(McpTables.merged(path.read_text() if path.is_file() else "", servers))
        return path

    def worker_session(self, resume: str) -> str:
        return resume

    def worker_command(self, brief: str, model: str, resume: str, session: str) -> list[str]:
        resumed = ["resume", resume] if resume else []
        selection = ["-m", model] if model else []
        return ["codex", "exec", *resumed, "--json", *self.prompt_flags, *selection, brief]

    def worker_outcome(self, output: str, err: str) -> WorkerOutcome:
        events = CodexEvent.lines(output)
        replies = [event.reply for event in events if event.is_reply() and event.reply is not None]
        errors = [self.error_text(event.error) for event in events if event.is_failure() and event.error is not None]
        return WorkerOutcome(replies[-1].strip() if replies else err.strip(), self.output_session(output, err), errors[-1] if errors else "")

    def output_session(self, output: str, err: str) -> str:
        return next((event.thread for event in CodexEvent.lines(output) if event.is_thread_start() and event.thread), "")

    @staticmethod
    def error_text(message: str) -> str:
        try:
            return str(json.loads(message).get("error", {}).get("message", "")) or message
        except (ValueError, AttributeError):
            return message

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}] for kind in self.hook_kinds}
