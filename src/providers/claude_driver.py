import json
import os
import re
import time
from dataclasses import asdict, dataclass, replace
from pathlib import Path

from engine import runtime
from resources.fields import Loaded
from engine.stored import read_json, write_json
from providers.claude import CHANNEL_MARK, SERVER, Claude
from providers.claude_rows import Row
from providers.drivers import CHOICE, LINE_START, Driver, joined, squeezed

ASKS_BEFORE = ("/model",)
CONFIRM_PROMPTS = (b"Entertoconfirm", b"Switchmodel?")
CONFIRM_WAIT = 4.0
CONFIRM_POLL = 0.25
HANDED = "channel-handed.json"
HANDED_KEPT = 20
HANDED_TEXT = 80
MOVED_ON = 4
TYPED_FOR = 300


@dataclass(frozen=True)
class HandedLine(Loaded):
    line: str = ""
    at: float = 0.0


@dataclass(frozen=True)
class Handed(Loaded):
    lines: tuple[HandedLine, ...] = ()
    typed_until: float = 0.0

    def to_json(self) -> dict:
        return {"lines": [asdict(h) for h in self.lines], "typed_until": self.typed_until}


def flat(text: str) -> str:
    return " ".join(text.split())


def claude_state() -> Path:
    return Path(os.environ.get("CLAUDE_CONFIG_DIR") or Path.home()) / ".claude.json"


class ClaudeDriver(Driver):
    HOMES = ("~/.claude/local", *Driver.HOMES)
    PRODUCT = "Claude Code"
    DISPLAY_HOOK = True
    SHELL = "!"
    INPUT_MARK = "❯".encode()
    TAKES_CHANNEL = True
    SUGGESTED = re.compile("(❯\u00a0)\x1b\\[2m([^\x1b\r\n]*)\x1b\\[22m".encode())
    AUTO_ARGS = ("--permission-mode", "auto")
    APPROVAL_FLAGS = frozenset({"--permission-mode", "--dangerously-skip-permissions"})
    SKIP_ARGS = ("--dangerously-skip-permissions",)
    RESUMING = {"--resume": 1, "-r": 1, "--continue": 0, "-c": 0}
    WORKTREE = ("--worktree", "-w")
    WORKTREES = Claude.worktrees
    EXIT = "/exit"
    TAKES_OURS = ("--settings", json.dumps({"crossSessionInbound": "accept"}))
    CHANNEL = ("--dangerously-load-development-channels", f"server:{SERVER}")
    LISTENING = 15.0
    MOVE_TO_BACKGROUND = b"\x02"
    ELSEWHERE = "Message @"
    name = "claude"

    @classmethod
    def command(cls, args: list[str], cwd: Path | None = None) -> list[str]:
        return ["claude", *(() if cls.TAKES_OURS[0] in args else cls.TAKES_OURS), *cls.CHANNEL, *args]

    @classmethod
    def trusted(cls, folder: Path) -> None:
        state = claude_state()
        known = read_json(state, dict, {})
        projects = known.get("projects") or {}
        entry = projects.get(str(folder.resolve())) or {}
        approved = entry.get("enabledMcpjsonServers") or []
        wanted = {**entry, "hasTrustDialogAccepted": True, "enabledMcpjsonServers": approved if SERVER in approved else [*approved, SERVER]}
        if wanted != entry:
            write_json(state, {**known, "projects": {**projects, str(folder.resolve()): wanted}}, indent=2)

    @classmethod
    def latest(cls, project: Path) -> str:
        folder = Path.home() / ".claude" / "projects" / re.sub(r"[^A-Za-z0-9]", "-", str(project))
        return max(folder.glob("*.jsonl"), key=lambda path: path.stat().st_mtime, default=Path()).stem

    @classmethod
    def consent(cls, printed: bytes) -> bytes:
        plain = squeezed(printed)
        asking = cls.CHANNEL[0].encode() in plain and CHOICE.search(plain)
        return b"\r" if asking and plain.rfind(cls.INPUT_MARK) == plain.rfind(cls.INPUT_MARK + b"1.") else b""

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

    def _post(self, line: str, by: str, tracked: bool = True) -> bool:
        root = self.record.root
        pid = self.pid()
        try:
            if not pid or not self.record.delivery.get("channel", True) or time.time() - runtime.channel_alive(root, pid).stat().st_mtime > self.LISTENING:
                return False
            if not self._delivering():
                return False
            with runtime.channel_queue(root, pid).open("a") as queue:
                queue.write(json.dumps({"content": line, "meta": {"from": by}}) + "\n")
            if tracked:
                held = self._held()
                write_json(self._handed_file(), replace(held, lines=(*held.lines[-HANDED_KEPT:], HandedLine(line[:HANDED_TEXT], time.time()))).to_json())
            return True
        except OSError:
            return False

    @staticmethod
    def _channel_text(row: Row) -> str:
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
        return any(row.at >= since - 1 and wanted in " ".join(self._channel_text(row).split()) for row in Claude().recent_rows(Path(last.transcript)))

    def _handed_file(self) -> Path:
        return runtime.session_file(self.record.root, self.session, HANDED)

    def _held(self) -> Handed:
        return read_json(self._handed_file(), Handed.from_json, Handed.from_json({}))

    def _delivering(self) -> bool:
        held = self._held()
        if time.time() < held.typed_until:
            return False
        last = self.last_report()
        waiting = held.lines
        if not waiting or not last or not last.transcript:
            return True
        rows = Claude().recent_rows(Path(last.transcript))
        arrived = [flat(text) for text in map(self._channel_text, rows) if CHANNEL_MARK in text]
        times = [row.at for row in rows]
        lost = [h for h in waiting if not any(flat(h.line) in text for text in arrived) and sum(1 for at in times if at > h.at) >= MOVED_ON]
        kept = tuple(h for h in waiting if not any(flat(h.line) in text for text in arrived) and h not in lost)
        write_json(self._handed_file(), (Handed(typed_until=time.time() + TYPED_FOR) if lost else Handed(lines=kept)).to_json())
        return not lost
