import os
import re
import time
from abc import ABC, abstractmethod
from pathlib import Path

from controllers.types import Agents
from engine import typist
from resources.base import SYSTEM
from engine.wording import counted
from engine import runtime
from engine.worktree import environment, linked, main_checkout, opened, unused_name

ENTER_AFTER = 0.3
MARK = "[journal]"
AGENT_COMMAND = "/"
RECHECK, RESUBMITS = 1.0, 3
SCREEN_TAIL, LINE_START = 16384, 40
PASTE_OVER, TYPED_PER_SECOND = 200, 4000
PASTE_START, PASTE_END = b"\x1b[200~", b"\x1b[201~"
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
    DISPLAY_HOOK = False
    SHELL = ""
    INPUT_MARK = b""
    PASTED_MARK = b""
    AUTO_ARGS = ()
    APPROVAL_FLAGS = frozenset()
    CONFIRM_AFTER = 0.0
    SKIP_ARGS = ()
    RESUMING: dict[str, int] = {}
    WORKTREE: tuple = ()
    WORKTREES: tuple = ()
    EXIT = ""
    MOVE_TO_BACKGROUND = b""
    QUIET = 3.0
    PROMPT = re.compile(r"[›>$❯]\s*$")
    name = ""
    ALLOW, DENY = b"1", b"\x1b"

    def __init__(self, record, session: str, fd: int = -1):
        self.record = record
        self.session = session
        self.fd = fd
        self.born = time.time()
        self.held: list[str] = []
        self.failed = False
        self.yielding: list[str] = []
        self.waiting = lambda: False
        self.groups: dict[tuple, dict] = {}
        self.sent_at = 0.0
        self.reported = (float("-inf"), None)
        self.printed = runtime.session_file(record.root, session, "printed")
        self.typed = runtime.session_file(record.root, session, "typed")

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
    def resuming(cls, args: list[str]) -> bool:
        return any(arg in cls.RESUMING for arg in args)

    @classmethod
    def conversation(cls, args: list[str]) -> str:
        named = [following for flag, following in zip(args, args[1:]) if cls.RESUMING.get(flag) == 1]
        return next((name for name in named if not name.startswith("-")), "")

    @classmethod
    def continued(cls, args: list[str], project: Path) -> str:
        return cls.latest(project) if any(cls.RESUMING.get(arg) == 0 for arg in args) else ""

    @classmethod
    def latest(cls, project: Path) -> str:
        return ""

    @classmethod
    def worktree(cls, args: list[str]) -> str:
        named = [following for flag, following in zip(args, args[1:]) if flag in cls.WORKTREE]
        joined = [value for flag, _, value in (arg.partition("=") for arg in args) if flag in cls.WORKTREE]
        return next((name for name in (*named, *joined) if name and not name.startswith("-")), "")

    @classmethod
    def unworktreed(cls, args: list[str]) -> list[str]:
        name = cls.worktree(args)
        joined = {f"{flag}={name}" for flag in cls.WORKTREE} if name else set()
        return [arg for i, arg in enumerate(args)
                if arg not in cls.WORKTREE and arg not in joined and not (name and arg == name and i and args[i - 1] in cls.WORKTREE)]

    @classmethod
    def placed(cls, project: Path, args: list[str]) -> tuple[Path, list[str]]:
        given = cls.worktree(args)
        name = given or (unused_name(main_checkout(project)) if any(arg in cls.WORKTREE for arg in args) else "")
        if not name:
            return project, args
        if environment(Path(name)) != name:
            raise SystemExit(f"journal: {name!r} cannot name a worktree; use one plain word, without a colon or a slash")
        anchor = main_checkout(project)
        made = linked(anchor).get(name)
        if not made or made.resolve() == anchor.joinpath(*cls.WORKTREES, name).resolve():
            made = opened(anchor, anchor.joinpath(*cls.WORKTREES, name), cls.branch(name))
        cls.trusted(made)
        return made, cls.unworktreed(args)

    @classmethod
    def trusted(cls, folder: Path) -> None:
        return None

    @classmethod
    def prompted(cls, args: list[str], prompt: str) -> list[str]:
        return [*args, prompt]

    @classmethod
    def branch(cls, name: str) -> str:
        return f"worktree-{name}"

    @classmethod
    def within(cls, args: list[str], name: str) -> list[str]:
        if not cls.WORKTREE or cls.worktree(args):
            return args
        bare = next((i for i, arg in enumerate(args) if arg in cls.WORKTREE), None)
        return [*args[:bare + 1], name, *args[bare + 1:]] if bare is not None else [*args, cls.WORKTREE[0], name]

    @classmethod
    def asks_worktree(cls, args: list[str]) -> bool:
        return any(arg in cls.WORKTREE or arg.partition("=")[0] in cls.WORKTREE for arg in args)

    @classmethod
    def unresumed(cls, args: list[str]) -> list[str]:
        kept, dropping = [], 0
        for arg in args:
            if dropping:
                dropping -= 1
            elif arg in cls.RESUMING:
                dropping = cls.RESUMING[arg]
            else:
                kept.append(arg)
        return kept

    @classmethod
    def resumed(cls, args: list[str], conversation: str) -> list[str]:
        if not cls.RESUMING or not conversation:
            return args
        return [*cls.unresumed(args), next(iter(cls.RESUMING)), conversation]

    def permit(self, allow: bool) -> None:
        self._wrote(self.ALLOW if allow else self.DENY)

    def alive(self) -> bool:
        return self.fd >= 0 or typist.reachable(typist.path(self.record.root, self.session))

    @classmethod
    def confirm(cls, printed: bytes) -> bytes:
        return b""

    def send(self, text: str = "", groups: dict | None = None, yielding: str = "") -> bool:
        line = joined(text)
        if line:
            self.held.append(line)
        if joined(yielding):
            self.yielding.append(joined(yielding))
        for key, numbers in (groups or {}).items():
            self.groups.setdefault(key, {}).update(dict.fromkeys(numbers))
        self.failed = False
        self.pump()
        return not self.failed

    def ready(self) -> bool:
        return not (self.held or self.yielding or self.groups) and time.time() - self.sent_at >= BETWEEN

    def pump(self) -> str:
        if self.yielding and self.waiting():
            self.yielding = []
        if not (self.held or self.yielding or self.groups) or time.time() - self.sent_at < BETWEEN:
            return ""
        self.held, self.yielding = self.held + self.yielding, []
        line = (f"the journal held back {len(self.held)} lines at once and dropped them - that many is a fault, not news" if len(self.held) > FLOOD
                else "; ".join(dict.fromkeys(self.held + counted(self.groups))))
        self.held, self.groups, self.sent_at = [], {}, time.time()
        self.failed = not self.deliver(line)
        return "" if self.failed else line

    def deliver(self, text: str) -> bool:
        line = joined(text)
        return self._post(line) or self.type_in(line)

    def _post(self, line: str) -> bool:
        return False

    def type_in(self, text: str) -> bool:
        return self._typed(f"{MARK} {joined(text)}", confirmed=True)

    def run_shell(self, command: str) -> bool:
        return bool(self.SHELL) and self._typed(f"{self.SHELL}{command.strip()}", confirmed=False)

    def enter(self, text: str) -> bool:
        return self._typed(joined(text), confirmed=False)

    def run_command(self, command: str) -> bool:
        return self._typed(command.strip(), confirmed=False)

    def press(self, keys: tuple) -> bool:
        first, *rest = keys or ("",)
        if not self._typed(first, confirmed=False):
            return False
        for line in rest:
            time.sleep(ENTER_AFTER)
            if not ((not line or self._wrote(line.encode())) and self._entered()):
                return False
        return True

    def _entered(self) -> bool:
        time.sleep(ENTER_AFTER)
        return self._wrote(b"\r")

    def _typed(self, line: str, confirmed: bool) -> bool:
        started = time.time()
        self.clear_input()
        time.sleep(ENTER_AFTER)
        raw = line.encode()
        if len(raw) > PASTE_OVER:
            raw = PASTE_START + raw + PASTE_END
        if not self._wrote(raw):
            return False
        time.sleep(len(raw) / TYPED_PER_SECOND)
        if not self._entered():
            return False
        if not confirmed and not self.INPUT_MARK:
            return True
        for _ in range(RESUBMITS):
            time.sleep(RECHECK)
            if self._landed(line, started, confirmed):
                return True
            self._wrote(b"\r")
        return self._landed(line, started, confirmed)

    def _landed(self, line: str, since: float, confirmed: bool) -> bool:
        return not self._still_in_input(line) and (not confirmed or self._submitted(since))

    def _still_in_input(self, line: str) -> bool:
        if not self.INPUT_MARK:
            return False
        screen = runtime.session_file(self.record.root, self.session, "screen")
        try:
            with screen.open("rb") as shown:
                shown.seek(max(0, screen.stat().st_size - SCREEN_TAIL))
                tail = shown.read()
        except OSError:
            return False
        plain = b"".join(ANSI.sub(b"", tail).split())
        if self.INPUT_MARK not in plain:
            return False
        box = plain.rsplit(self.INPUT_MARK, 1)[1]
        return b"".join(line.encode().split())[:LINE_START] in box or bool(self.PASTED_MARK) and self.PASTED_MARK in box

    def _submitted(self, since: float) -> bool:
        row = self._report()
        return bool(row) and float(row.at) >= since

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

    def move_to_background(self) -> bool:
        return bool(self.MOVE_TO_BACKGROUND) and self._wrote(self.MOVE_TO_BACKGROUND)

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

    def asking(self) -> bool:
        return False

    def last_report(self):
        if time.monotonic() - self.reported[0] >= REPORT_FOR:
            self.reported = (time.monotonic(), self._report())
        return self.reported[1]

    def last_title(self) -> str:
        last = self.last_report()
        return last.title if last and last.title else ""

    def _report(self):
        from controllers.types import Agents
        from resources.base import SYSTEM
        rows = [r for r in Agents(self.record, actor=SYSTEM)._viewed()
                if r.event and (r.title == self.session or self.owns(r) or (r.provider == self.name and float(r.at) >= self.born - 1))]
        return max(rows, key=lambda r: float(r.at)).fork() if rows else None

    def owns(self, row) -> bool:
        from engine.sessions import Sessions
        sessions = Sessions(self.record.root)
        mine = sessions.read(self.session).pid
        return bool(mine) and sessions.read(row.title).pid == mine

    def quiet_for(self) -> float:
        try:
            return time.time() - self.printed.stat().st_mtime
        except OSError:
            return 0.0

    def last_printed(self, size: int = 400) -> str:
        try:
            return ANSI.sub(b"", self.printed.read_bytes()[-size:]).decode(errors="replace")
        except OSError:
            return ""
