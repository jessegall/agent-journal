import json
import os
import re
import time
from abc import ABC, abstractmethod
from pathlib import Path

ENTER_AFTER = 0.3
QUIET_SECONDS = 3.0
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


class Agent(ABC):
    name = ""

    def __init__(self, root: Path, reports: Path, fd: int, printed: Path):
        self.root = Path(root)
        self.reports = reports          # the hooks' one-line-per-event file for this session
        self.fd = fd                    # the pty master: what send() writes into
        self.printed = printed          # the tail of the agent's output, kept by the supervisor
        self.born = time.time()

    @abstractmethod
    def command(self, args: list[str]) -> list[str]: ...

    def send(self, text: str) -> None:
        line = " ".join(part.strip() for part in text.splitlines() if part.strip()).encode()
        os.write(self.fd, line)
        time.sleep(ENTER_AFTER)
        os.write(self.fd, b"\r")

    def last_report(self) -> dict | None:
        try:
            tail = self.reports.read_bytes()[-4096:].decode(errors="replace").strip().splitlines()
            return json.loads(tail[-1]) if tail else None
        except (OSError, ValueError):
            return None

    def quiet_for(self) -> float:
        try:
            return time.time() - self.printed.stat().st_mtime
        except OSError:
            return 0.0

    def is_idle(self) -> bool:
        last = self.last_report()
        if last is None:
            return self.quiet_for() >= QUIET_SECONDS
        return last.get("event") in ("Stop", "SessionStart") and self.quiet_for() >= 1.0

    def is_working(self) -> bool:
        return not self.is_idle()

    def is_waiting(self) -> bool:
        last = self.last_report()
        return bool(last) and last.get("event") == "PreToolUse" and self.quiet_for() >= 5.0

    def last_printed(self) -> str:
        try:
            return ANSI.sub(b"", self.printed.read_bytes()[-400:]).decode(errors="replace")
        except OSError:
            return ""


class Claude(Agent):
    name = "claude"

    def command(self, args: list[str]) -> list[str]:
        return ["claude", *args]


class Codex(Agent):
    name = "codex"

    def command(self, args: list[str]) -> list[str]:
        return ["codex", *args]


AGENTS = {a.name: a for a in (Claude, Codex)}
