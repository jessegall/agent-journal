import os
import re
import time
from abc import ABC, abstractmethod
from pathlib import Path

ENTER_AFTER = 0.3
RECHECK, RESUBMITS, SAMPLE = 0.6, 2, 24
INPUT = re.compile("[❯›]")
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


class Driver(ABC):
    STOP = b"\x1b"
    name = ""
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

    @abstractmethod
    def command(self, args: list[str]) -> list[str]: ...

    @classmethod
    def launch_args(cls, args: list[str], automatic: bool = False) -> list[str]:
        flags = {arg.split("=", 1)[0] for arg in args}
        return [*cls.AUTO_ARGS, *args] if automatic and flags.isdisjoint(cls.APPROVAL_FLAGS) else args

    def alive(self) -> bool:
        return self.fd >= 0

    def send(self, text: str) -> None:
        line = " ".join(part.strip() for part in text.splitlines() if part.strip())
        try:
            os.write(self.fd, line.encode())
            time.sleep(ENTER_AFTER)
            os.write(self.fd, b"\r")
            for _ in range(RESUBMITS):
                time.sleep(RECHECK)
                if not self.unsent(line):
                    break
                os.write(self.fd, b"\r")
        except OSError:
            self.fd = -1

    def unsent(self, line: str) -> bool:
        box = INPUT.split(self.last_printed())
        return len(box) > 1 and bool(line) and line[:SAMPLE] in box[-1]

    def stop_turn(self) -> None:
        try:
            os.write(self.fd, self.STOP)
        except OSError:
            self.fd = -1

    def interrupt(self) -> None:
        try:
            os.write(self.fd, b"\x03")
        except OSError:
            self.fd = -1

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

    def command(self, args: list[str]) -> list[str]:
        return ["claude", *args]


class Codex(Driver):
    name = "codex"
    AUTO_ARGS = ("--approve-for-me",)
    APPROVAL_FLAGS = frozenset({"-a", "--ask-for-approval", "--approve-for-me", "--full-auto", "--dangerously-bypass-approvals-and-sandbox"})

    def command(self, args: list[str]) -> list[str]:
        return ["codex", *args]


DRIVERS = {d.name: d for d in (Claude, Codex)}
