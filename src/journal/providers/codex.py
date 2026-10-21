import json
import re
from datetime import date, timedelta
from pathlib import Path
from typing import Iterator

from journal.support.hook_kind import HookKind
from journal.providers.support.codex_row import CodexRow
from journal.providers.provider import Provider
from journal.events.agent.peer_message import PeerMessage
from journal.providers.support.turn import Turn
from journal.providers.support.capability import Capability


class Codex(Provider):
    """OpenAI's Codex: the journal reads no thoughts, no messages between sessions and no subagent transcripts from its rollouts, so it offers none of them."""

    name = "codex"
    prompt_flags = ("--dangerously-bypass-approvals-and-sandbox",)
    home = ".codex"
    settings_file = "hooks.json"
    edit_tools = frozenset({"apply_patch", "write_file"})
    read_tool = "read_file"
    hook_kinds = tuple(kind for kind in HookKind if kind not in (HookKind.MESSAGE_DISPLAY, HookKind.POST_TOOL_USE_FAILURE))
    capabilities = frozenset()

    def __init__(self) -> None:
        self._rollouts: dict[str, Path] = {}

    @property
    def sessions(self) -> Path:
        return Path.home() / ".codex" / "sessions"

    def hooks_trusted(self, project: Path) -> bool:
        settings = Path.home() / ".codex" / "config.toml"
        hooks = project.resolve() / self.home / self.settings_file
        return settings.is_file() and f'[hooks.state."{hooks}:session_start' in settings.read_text()

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

    def resume(self, session: str) -> tuple[str, ...]:
        return ("resume", session)

    def worker_command(self, brief: str, model: str, resume: str) -> list[str]:
        resumed = ["resume", resume] if resume else []
        selection = ["-m", model] if model else []
        return ["codex", "exec", *resumed, "--dangerously-bypass-approvals-and-sandbox", *selection, brief]

    def worker_outcome(self, output: str, err: str) -> tuple[str, str]:
        rows = re.search(r"session id: ([0-9a-f-]{8,})", f"{output}\n{err}", re.IGNORECASE)
        return output.strip() or err.strip(), rows.group(1) if rows else ""

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}] for kind in self.hook_kinds}
