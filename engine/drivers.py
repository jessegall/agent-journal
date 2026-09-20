import json
import os
import re
import socket
import time
from abc import ABC, abstractmethod
from pathlib import Path

from controllers.types import Agents
from resources.base import Refused, SYSTEM

ENTER_AFTER = 0.3
POST_WAIT = 5.0
RECHECK, RESUBMITS, SAMPLE = 0.6, 2, 24
DRAFT_LINES = 8
INPUT = re.compile("[❯›]")
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


class Driver(ABC):
    STOP = b"\x1b"
    CLEAR_LINE = b"\x05\x15"
    name = ""
    ASIDE = ""
    AUTO_ARGS = ()
    APPROVAL_FLAGS = frozenset()
    QUIET = 3.0
    PROMPT = re.compile(r"[›>$❯]\s*$")

    def __init__(self, record, session: str, fd: int = -1):
        self.record = record
        self.session = session
        self.fd = fd
        self.born = time.time()
        self.printed = record.root / "runtime" / f"printed-{session}"
        self.typed = record.root / "runtime" / f"typed-{session}"

    @abstractmethod
    def command(self, args: list[str]) -> list[str]: ...

    @classmethod
    def launch_args(cls, args: list[str], automatic: bool = False) -> list[str]:
        flags = {arg.split("=", 1)[0] for arg in args}
        return [*cls.AUTO_ARGS, *args] if automatic and flags.isdisjoint(cls.APPROVAL_FLAGS) else args

    def alive(self) -> bool:
        return self.fd >= 0

    def send(self, text: str) -> bool:
        line = " ".join(part.strip() for part in text.splitlines() if part.strip())
        return self.post(line) or self.type_in(line)

    def inbox(self) -> str:
        agents = Agents(self.record, actor=SYSTEM)
        try:
            mine = agents.by_session(self.session)
        except Refused:
            mine = None
        live = agents.primary()
        return str((mine and mine.inbox) or (live and live.inbox) or "")

    def post(self, line: str) -> bool:
        path = self.inbox()
        if not path:
            return False
        said = json.dumps({"type": "user", "message": {"role": "user", "content": line}}) + "\n"
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as post:
                post.settimeout(POST_WAIT)
                post.connect(path)
                post.sendall(said.encode())
            return True
        except OSError:
            return False

    def type_in(self, line: str) -> bool:
        self.clear_input()
        if not self.wrote(line.encode()):
            return False
        time.sleep(ENTER_AFTER)
        if not self.wrote(b"\r"):
            return False
        for _ in range(RESUBMITS):
            time.sleep(RECHECK)
            if not self.unsent(line):
                return True
            self.wrote(b"\r")
        return not self.unsent(line)

    def wrote(self, raw: bytes) -> bool:
        try:
            while raw:
                raw = raw[os.write(self.fd, raw):]
            return True
        except OSError:
            self.fd = -1
            return False

    def unsent(self, line: str) -> bool:
        box = INPUT.split(self.last_printed())
        return len(box) > 1 and bool(line) and line[:SAMPLE] in box[-1]

    def stop_turn(self) -> None:
        self.wrote(self.STOP)

    def interrupt(self) -> None:
        self.wrote(b"\x03")

    def clear_input(self) -> None:
        self.wrote(self.CLEAR_LINE + (b"\x7f" + self.CLEAR_LINE) * DRAFT_LINES)

    def user_typing(self, within: float) -> bool:
        try:
            return time.time() - self.typed.stat().st_mtime < within
        except OSError:
            return False

    def at_prompt(self) -> bool:
        return bool(self.PROMPT.search(self.last_printed().rstrip()))

    def last_report(self):
        from controllers.types import Agents
        from engine.record import Record
        from resources.base import SYSTEM
        homes = sorted(self.record.root.glob("environments/*/agent"), key=lambda f: f.stat().st_mtime)
        rows = [r for f in homes for r in Agents(Record(self.record.root, f.parent.name), actor=SYSTEM).all()
                if r.event and (r.title == self.session or (r.provider == self.name and float(r.at or 0) >= self.born - 1))]
        return max(rows, key=lambda r: float(r.at or 0)) if rows else None

    def quiet_for(self) -> float:
        try:
            return time.time() - self.printed.stat().st_mtime
        except OSError:
            return 0.0

    def last_printed(self) -> str:
        try:
            return ANSI.sub(b"", self.printed.read_bytes()[-400:]).decode(errors="replace")
        except OSError:
            return ""


class Claude(Driver):
    name = "claude"
    AUTO_ARGS = ("--permission-mode", "auto")
    APPROVAL_FLAGS = frozenset({"--permission-mode", "--dangerously-skip-permissions"})
    TAKES_OURS = ("--settings", json.dumps({"crossSessionInbound": "accept"}))
    CHANNEL = ("--dangerously-load-development-channels", "server:journal")
    LISTENING = 15.0

    def command(self, args: list[str]) -> list[str]:
        return ["claude", *(() if self.TAKES_OURS[0] in args else self.TAKES_OURS), *self.CHANNEL, *args]

    def post(self, line: str) -> bool:
        return self.handed(line) or super().post(line)

    def handed(self, line: str) -> bool:
        runtime = self.record.root / "runtime"
        try:
            if time.time() - (runtime / "channel.on").stat().st_mtime > self.LISTENING:
                return False
            with (runtime / "channel.jsonl").open("a") as queue:
                queue.write(json.dumps({"content": line, "meta": {"from": "journal"}}) + "\n")
            return True
        except OSError:
            return False


class Codex(Driver):
    name = "codex"
    AUTO_ARGS = ("--approve-for-me",)
    APPROVAL_FLAGS = frozenset({"-a", "--ask-for-approval", "--approve-for-me", "--full-auto", "--dangerously-bypass-approvals-and-sandbox"})

    def command(self, args: list[str]) -> list[str]:
        return ["codex", *args]


DRIVERS = {d.name: d for d in (Claude, Codex)}
