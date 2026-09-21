import json
import os
import re
import socket
import time
from abc import ABC, abstractmethod
from pathlib import Path

from controllers.types import Agents
from engine import typist
from resources.base import Refused, SYSTEM
from engine.wording import counted

ENTER_AFTER = 0.3
POST_WAIT = 5.0
RECHECK, RESUBMITS = 1.0, 3
DRAFT_LINES = 8
CHOICE = re.compile(rb"1\..+?2\.", re.S)
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


BETWEEN, FLOOD = 5.0, 20
REPORT_FOR = 0.5
CHANNEL, TERMINAL = "channel", "terminal"


def joined(text: str) -> str:
    return " ".join(part.strip() for part in text.splitlines() if part.strip())


class Driver(ABC):
    STOP = b"\x1b"
    CLEAR_LINE = b"\x05\x15"
    name = ""
    FROM = "The journal, for the user:"
    AUTO_ARGS = ()
    APPROVAL_FLAGS = frozenset()
    SKIP_ARGS = ()
    RESUMING: dict[str, int] = {}
    ALLOW, DENY = b"1", b"\x1b"
    QUIET = 3.0
    PROMPT = re.compile(r"[›>$❯]\s*$")

    def __init__(self, record, session: str, fd: int = -1):
        self.record = record
        self.session = session
        self.fd = fd
        self.born = time.time()
        self.held: list[str] = []
        self.groups: dict[tuple, dict] = {}
        self.sent_at = 0.0
        self.reported = (float("-inf"), None)
        self.printed = record.root / "runtime" / f"printed-{session}"
        self.typed = record.root / "runtime" / f"typed-{session}"

    @abstractmethod
    def command(self, args: list[str], cwd: Path | None = None) -> list[str]: ...

    @classmethod
    def launch_args(cls, args: list[str], automatic: bool = False) -> list[str]:
        flags = {arg.split("=", 1)[0] for arg in args}
        return [*cls.AUTO_ARGS, *args] if automatic and flags.isdisjoint(cls.APPROVAL_FLAGS) else args

    @classmethod
    def skipping(cls, args: list[str], skip: bool) -> list[str]:
        kept = [arg for arg in args if arg not in cls.SKIP_ARGS]
        return [*cls.SKIP_ARGS, *kept] if skip else kept

    @classmethod
    def resumed(cls, args: list[str], conversation: str) -> list[str]:
        if not cls.RESUMING or not conversation:
            return args
        kept, dropping = [], 0
        for arg in args:
            if dropping:
                dropping -= 1
            elif arg in cls.RESUMING:
                dropping = cls.RESUMING[arg]
            else:
                kept.append(arg)
        return [*kept, next(iter(cls.RESUMING)), conversation]

    def permit(self, allow: bool) -> None:
        self._wrote(self.ALLOW if allow else self.DENY)

    def alive(self) -> bool:
        return self.fd >= 0 or typist.reachable(typist.path(self.record.root, self.session))

    @classmethod
    def confirm(cls, printed: bytes) -> bytes:
        return b""

    def send(self, text: str = "", groups: dict | None = None) -> bool:
        line = joined(text)
        if line:
            self.held.append(line)
        for key, numbers in (groups or {}).items():
            self.groups.setdefault(key, {}).update(dict.fromkeys(numbers))
        self.pump()
        return True

    def pump(self) -> str:
        if not (self.held or self.groups) or time.time() - self.sent_at < BETWEEN:
            return ""
        line = (f"the journal held back {len(self.held)} lines at once and dropped them - that many is a fault, not news" if len(self.held) > FLOOD
                else "; ".join(dict.fromkeys(self.held + counted(self.groups))))
        self.held, self.groups, self.sent_at = [], {}, time.time()
        self.deliver(line)
        return line

    def deliver(self, text: str) -> bool:
        line = joined(text)
        return self._post(line) or self.type_in(line)

    def _posts(self) -> bool:
        return bool(self.record.delivery.get("socket", True))

    def _posted(self, line: str) -> str:
        return f"{self.FROM}\n{line}" if self.FROM else line

    def _inbox(self) -> str:
        if not self._posts():
            return ""
        agents = Agents(self.record, actor=SYSTEM)
        try:
            mine = agents.by_session(self.session)
        except Refused:
            mine = None
        live = agents.primary()
        return str((mine and mine.inbox) or (live and live.inbox) or "")

    def _post(self, line: str) -> bool:
        path = self._inbox()
        if not path:
            return False
        payload = json.dumps({"type": "user", "message": {"role": "user", "content": self._posted(line)}}) + "\n"
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as post:
                post.settimeout(POST_WAIT)
                post.connect(path)
                post.sendall(payload.encode())
            return True
        except OSError:
            return False

    def type_in(self, text: str) -> bool:
        line = joined(text)
        started = time.time()
        self.clear_input()
        time.sleep(ENTER_AFTER)
        if not self._wrote(line.encode()):
            return False
        time.sleep(ENTER_AFTER)
        if not self._wrote(b"\r"):
            return False
        for _ in range(RESUBMITS):
            time.sleep(RECHECK)
            if self._submitted(started):
                return True
            self._wrote(b"\r")
        return self._submitted(started)

    def _submitted(self, since: float) -> bool:
        row = self._report()
        return bool(row) and float(row.at or 0) >= since

    def _wrote(self, raw: bytes) -> bool:
        if self.fd < 0:
            return typist.send(self.record.root, self.session, raw)
        try:
            while raw:
                raw = raw[os.write(self.fd, raw):]
            return True
        except OSError:
            self.fd = -1
            return False

    def stop_turn(self) -> None:
        self._wrote(self.STOP)

    def interrupt(self) -> None:
        self._wrote(b"\x03")

    def clear_input(self) -> None:
        self._wrote(self.CLEAR_LINE + (b"\x7f" + self.CLEAR_LINE) * DRAFT_LINES)

    def user_typing(self, within: float) -> bool:
        try:
            return time.time() - self.typed.stat().st_mtime < within
        except OSError:
            return False

    def at_prompt(self) -> bool:
        return bool(self.PROMPT.search(self.last_printed().rstrip()))

    def last_report(self):
        if time.monotonic() - self.reported[0] >= REPORT_FOR:
            self.reported = (time.monotonic(), self._report())
        return self.reported[1]

    def _report(self):
        from controllers.types import Agents
        from resources.base import SYSTEM
        rows = [r for r in Agents(self.record, actor=SYSTEM)._every()
                if r.event and (r.title == self.session or self.owns(r) or (r.provider == self.name and float(r.at or 0) >= self.born - 1))]
        return max(rows, key=lambda r: float(r.at or 0)) if rows else None

    def owns(self, row) -> bool:
        return False

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
