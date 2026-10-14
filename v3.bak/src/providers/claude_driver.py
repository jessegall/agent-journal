import json
import os
import re
import time
from pathlib import Path

from resources.base import DEFAULT_PROVIDER
from engine.stored import read_json, write_json
from providers.claude import Claude
from providers.claude_rows import Row
from providers.drivers import LINE_START, Driver, joined

ASKS_BEFORE = ("/model",)
CONFIRM_PROMPTS = (b"Entertoconfirm", b"Switchmodel?")
CONFIRM_WAIT = 4.0
CONFIRM_POLL = 0.25

def claude_state() -> Path:
    return Path(os.environ.get("CLAUDE_CONFIG_DIR") or Path.home()) / ".claude.json"


class ClaudeDriver(Driver):
    HOMES = ("~/.claude/local", *Driver.HOMES)
    PRODUCT = "Claude Code"
    DISPLAY_HOOK = True
    SHELL = "!"
    INPUT_MARK = "❯".encode()
    SUGGESTED = re.compile("(❯\u00a0)\x1b\\[2m([^\x1b\r\n]*)\x1b\\[22m".encode())
    AUTO_ARGS = ("--permission-mode", "auto")
    APPROVAL_FLAGS = frozenset({"--permission-mode", "--dangerously-skip-permissions"})
    SKIP_ARGS = ("--dangerously-skip-permissions",)
    RESUMING = {"--resume": 1, "-r": 1, "--continue": 0, "-c": 0}
    PRINTED_SESSION = re.compile(r"claude --resume ([0-9a-fA-F-]{8,})")
    WORKTREE = ("--worktree", "-w")
    WORKTREES = Claude.worktrees
    EXIT = "/exit"
    TAKES_OURS = ("--settings", json.dumps({"crossSessionInbound": "accept"}))
    MOVE_TO_BACKGROUND = b"\x02"
    ELSEWHERE = "Message @"
    ASKS_ON_SCREEN = True
    ASKING = (b"Doyouwanttoproceed?", b"Doyouwanttomake", b"Doyouwanttocreate", b"Entertoselect")
    ASKED_COMMAND = re.compile(r"(?:Bash command|Run shell command)\s+(.+?)\s+Do you want to proceed", re.S)
    READY = b"?forshortcuts"
    BUSY = b"esctointerrupt"
    name = DEFAULT_PROVIDER

    @classmethod
    def command(cls, args: list[str], cwd: Path | None = None) -> list[str]:
        return ["claude", *(() if cls.TAKES_OURS[0] in args else cls.TAKES_OURS), *args]

    @classmethod
    def trusted(cls, folder: Path) -> None:
        state = claude_state()
        known = read_json(state, dict, {})
        projects = known.get("projects") or {}
        entry = projects.get(str(folder.resolve())) or {}
        wanted = {**entry, "hasTrustDialogAccepted": True}
        if wanted != entry:
            write_json(state, {**known, "projects": {**projects, str(folder.resolve()): wanted}}, indent=2)

    @classmethod
    def latest(cls, project: Path) -> str:
        folder = Path.home() / ".claude" / "projects" / re.sub(r"[^A-Za-z0-9]", "-", str(project))
        return max(folder.glob("*.jsonl"), key=lambda path: path.stat().st_mtime, default=Path()).stem

    def run_command(self, command: str) -> bool:
        start = self._shown_size()
        typed = super().run_command(command)
        if typed and command.strip().startswith(ASKS_BEFORE):
            self._confirm_after(start)
        return typed

    def _confirm_after(self, start: int) -> None:
        until = time.time() + CONFIRM_WAIT
        while time.time() < until:
            time.sleep(CONFIRM_POLL)
            if any(prompt in self._shown_since(start) for prompt in CONFIRM_PROMPTS):
                self._entered()
                return

    def owns(self, row) -> bool:
        pid = self.pid()
        return bool(pid) and Path(row.inbox).stem == str(pid)

    @staticmethod
    def _text_of(row: Row) -> str:
        if row.type == "attachment":
            return row.prompt
        if row.type == "queue-operation":
            return row.content
        if row.type != "user":
            return ""
        return row.text if row.text is not None else "\n".join(block.result for block in row.of_type("tool_result"))

    def _landed(self, line: str, since: float, confirmed: bool) -> bool:
        return self._in_transcript(line, since) or super()._landed(line, since, confirmed)

    def _in_transcript(self, line: str, since: float) -> bool:
        last = self.last_report()
        wanted = " ".join(joined(line).split())[:LINE_START]
        if not wanted or not last or not last.transcript:
            return False
        return any(row.at >= since - 1 and wanted in " ".join(self._text_of(row).split()) for row in Claude().recent_rows(Path(last.transcript)))
