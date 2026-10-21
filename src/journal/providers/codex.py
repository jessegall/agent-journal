import json
import shlex
from datetime import date, timedelta
from pathlib import Path
from typing import Iterator

from journal.support.hook_kind import HookKind
from journal.providers.support.codex_row import CodexRow
from journal.providers.provider import Provider
from journal.events.agent.peer_message import PeerMessage
from journal.providers.support.turn import Turn
from journal.providers.support.capability import Capability
from journal.providers.support.patch_paths import PatchPaths
from journal.support.agent_message import AgentMessage
from journal.support.file_edit import FileEdit
from journal.support.file_read import FileRead
from journal.support.file_write import FileWrite
from journal.support.shell_line import ShellLine
from journal.support.subagent_dispatch import SubagentDispatch
from journal.support.user_question import UserQuestion
from journal.providers.support.worker_outcome import WorkerOutcome
from journal.support.choice import Choice
from journal.providers.support.status_line import StatusLine

SCRIPT_FLAGS = ("-c", "-lc")
TITLE_CHARACTERS = 80


class Codex(Provider):
    """OpenAI's Codex: the journal reads no thoughts, no messages between sessions and no subagent transcripts from its rollouts, so it offers none of them."""

    name = "codex"
    prompt_flags = ("--dangerously-bypass-approvals-and-sandbox",)
    home = ".codex"
    settings_file = "hooks.json"
    decoders = {
        "Bash": lambda input: ShellLine(Codex.shell_line(input.get("command", ""))),
        "exec_command": lambda input: ShellLine(Codex.shell_line(input.get("cmd", ""))),
        "shell": lambda input: ShellLine(Codex.shell_line(input.get("command", ""))),
        "apply_patch": lambda input: FileEdit(PatchPaths.build(input)),
        "write_file": lambda input: FileWrite(str(input.get("path", "") or input.get("file_path", ""))),
        "read_file": lambda input: FileRead(str(input.get("path", "") or input.get("file_path", "")), bool(input.get("offset") or input.get("limit"))),
        "spawn_agent": lambda input: Codex.subagent(input),
        "send_input": lambda input: AgentMessage(str(input.get("id", "")), str(input.get("message", ""))),
        "request_user_input": lambda input: UserQuestion(),
    }
    hook_kinds = tuple(kind for kind in HookKind if kind not in (HookKind.MESSAGE_DISPLAY, HookKind.POST_TOOL_USE_FAILURE))
    capabilities = frozenset()
    session_variable = "CODEX_THREAD_ID"
    inherited_markers = ("CODEX_THREAD_ID", "CODEX_SANDBOX", "CODEX_CI")
    question_model = ""
    settings_files = (".codex/hooks.json", "~/.codex/hooks.json")
    network_access = ("-c", "sandbox_workspace_write.network_access=true")

    def __init__(self) -> None:
        self._rollouts: dict[str, Path] = {}

    @property
    def sessions(self) -> Path:
        return Path.home() / ".codex" / "sessions"

    def hooks_trusted(self, project: Path) -> bool:
        settings = Path.home() / ".codex" / "config.toml"
        hooks = project.resolve() / self.home / self.settings_file
        return settings.is_file() and f'[hooks.state."{hooks}:session_start' in settings.read_text()

    @staticmethod
    def subagent(input: dict) -> SubagentDispatch:
        brief = str(input.get("message", "") or input.get("prompt", ""))
        return SubagentDispatch(str(input.get("agent_type", "") or input.get("role", "")), str(input.get("model", "")), brief.strip().split("\n")[0][:TITLE_CHARACTERS], brief)

    @staticmethod
    def shell_line(command) -> str:
        if not isinstance(command, list):
            return str(command)
        if len(command) == 3 and command[1] in SCRIPT_FLAGS:
            return str(command[2])
        return shlex.join(str(part) for part in command)

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

    def worker_command(self, brief: str, model: str, resume: str) -> list[str]:
        resumed = ["resume", resume] if resume else []
        selection = ["-m", model] if model else []
        return ["codex", "exec", *resumed, "--json", *self.prompt_flags, *selection, brief]

    def worker_outcome(self, output: str, err: str) -> WorkerOutcome:
        events = [json.loads(line) for line in output.splitlines() if line.startswith("{")]
        session = next((str(event.get("thread_id", "")) for event in events if event.get("type") == "thread.started"), "")
        replies = [event["item"].get("text", "") for event in events if event.get("type") == "item.completed" and event.get("item", {}).get("type") == "agent_message"]
        errors = [str(event.get("message") or event.get("error", {}).get("message", "")) for event in events if event.get("type") in ("error", "turn.failed")]
        return WorkerOutcome(replies[-1].strip() if replies else err.strip(), session, errors[-1] if errors else "")

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}] for kind in self.hook_kinds}
