import json
import os
import re
import time
from abc import ABC, abstractmethod
from pathlib import Path

ENTER_AFTER = 0.3
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


class Driver(ABC):
    name = ""
    QUIET = 3.0

    def __init__(self, root: Path, session: str, fd: int = -1):
        self.root = Path(root)
        self.session = session
        self.fd = fd
        self.reports = self.root / "runtime" / "agents" / f"{session}.jsonl"
        self.printed = self.root / "runtime" / f"printed-{session}"

    @abstractmethod
    def command(self, args: list[str]) -> list[str]: ...

    def alive(self) -> bool:
        return self.fd >= 0

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

    def last_printed(self) -> str:
        try:
            return ANSI.sub(b"", self.printed.read_bytes()[-400:]).decode(errors="replace")
        except OSError:
            return ""


class Claude(Driver):
    name = "claude"

    def command(self, args: list[str]) -> list[str]:
        return ["claude", *args]


class Codex(Driver):
    name = "codex"

    def command(self, args: list[str]) -> list[str]:
        return ["codex", *args]


DRIVERS = {d.name: d for d in (Claude, Codex)}
