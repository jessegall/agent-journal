import os
import re
import shutil
import time
from abc import ABC, abstractmethod
from pathlib import Path

from controllers.types import Agents
from providers.base import JOURNAL, MARK
from providers.payload import Asking
from engine import typist
from resources.base import SYSTEM, Refused
from engine.wording import counted
from engine import runtime
from engine.sessions import Sessions
from supervisor import PRINTED, SCREEN, TYPED
from engine.worktree import BRANCHED, environment, linked, main_checkout, opened, spread, unused_name, workspace
from providers.catalogue import workspace_folders

ENTER_AFTER = 0.3
AGENT_COMMAND = "/"
RECHECK, RESUBMITS = 1.0, 3
ECHO_WAIT, ECHO_STEP = 2.0, 0.1
SCREEN_TAIL, LINE_START = 16384, 40
PASTE_OVER, TYPED_PER_SECOND = 200, 4000
PASTE_START, PASTE_END = b"\x1b[200~", b"\x1b[201~"
DRAFT_LINES = 8
CHOICE = re.compile(rb"1\..+?2\.", re.S)
SUGGESTION = rb"\1[a suggestion, not sent: \2]"
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


BETWEEN, FLOOD = 5.0, 20
REPORT_FOR = 0.5


def plain(raw: bytes) -> bytes:
    return ANSI.sub(b"", raw)


def squeezed(raw: bytes) -> bytes:
    return b"".join(plain(raw).split())


def joined(text: str) -> str:
    return " ".join(part.strip() for part in text.splitlines() if part.strip())


class Driver(ABC):
    STOP = b"\x1b"
    CLEAR_LINE = b"\x05\x15"
    DISPLAY_HOOK = False
    SHELL = ""
    INPUT_MARK = b""
    ENTER_CAN_MISS = False
    AUTO_ARGS = ()
    APPROVAL_FLAGS = frozenset()
    CONFIRM_AFTER = 0.0
    TAKES_CHANNEL = False
    ASKS_ON_SCREEN = False
    SKIP_ARGS = ()
    RESUMING: dict[str, int] = {}
    WORKTREE: tuple = ()
    WORKTREES: tuple = ()
    EXIT = ""
    MOVE_TO_BACKGROUND = b""
    HOMES: tuple = ("~/.local/bin", "/opt/homebrew/bin", "/usr/local/bin", "~/.npm-global/bin", "~/.bun/bin")
    PRODUCT = ""
    QUEUED = b""
    RUNNING = b""
    SEND_NOW = b""
    QUIET = 3.0
    PROMPT = re.compile(r"[›>$❯]\s*$")
    SUGGESTED = re.compile(rb"(?!)")
    ELSEWHERE = ""
    ALLOW, DENY = b"1", b"\x1b"
    name = ""

    def __init__(self, record, session: str, fd: int = -1):
        self.record = record
        self.session = session
        self.fd = fd
        self.born = time.time()
        self.sent_now = 0.0
        self.held: list[str] = []
        self.failed = False
        self.yielding: list[str] = []
        self.waiting = lambda: False
        self.groups: dict[tuple, dict] = {}
        self.sent_at = 0.0
        self.reported = (float("-inf"), None)
        self.printed = runtime.session_file(record.root, session, PRINTED)
        self.typed = runtime.session_file(record.root, session, TYPED)

    @classmethod
    @abstractmethod
    def command(cls, args: list[str], cwd: Path | None = None) -> list[str]: ...

    @classmethod
    def binary(cls, path: str) -> str:
        homes = (Path(home).expanduser() / cls.name for home in cls.HOMES)
        found = shutil.which(cls.name, path=path) or next((str(home) for home in homes if home.is_file() and os.access(home, os.X_OK)), "")
        if not found:
            raise Refused(f"the {cls.name} command was not found on this computer: install {cls.PRODUCT}, or put {cls.name} on your PATH")
        return found

    @classmethod
    def launch_args(cls, args: list[str], automatic: bool = False) -> list[str]:
        return [*cls.AUTO_ARGS, *args] if automatic and not cls.chosen(args) else args

    @classmethod
    def chosen(cls, args: list[str]) -> bool:
        return not {arg.split("=", 1)[0] for arg in args}.isdisjoint(cls.APPROVAL_FLAGS)

    @classmethod
    def skipping(cls, args: list[str], skip: bool) -> list[str]:
        kept = [arg for arg in args if arg not in cls.SKIP_ARGS]
        return [*cls.SKIP_ARGS, *cls.unautomated(kept)] if skip else kept

    @classmethod
    def unautomated(cls, args: list[str]) -> list[str]:
        size = len(cls.AUTO_ARGS)
        for at in range(len(args) - size + 1):
            if size and tuple(args[at:at + size]) == cls.AUTO_ARGS:
                return [*args[:at], *args[at + size:]]
        return args

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
        if spread(anchor):
            made = workspace(anchor, anchor.joinpath(*cls.WORKTREES, name), workspace_folders())
        elif not made or made.resolve() == anchor.joinpath(*cls.WORKTREES, name).resolve():
            made = opened(anchor, anchor.joinpath(*cls.WORKTREES, name), cls.branch(name))
        cls.trusted(made)
        return made, cls.unworktreed(args)

    @classmethod
    def trusted(cls, folder: Path) -> None:
        return None

    @classmethod
    def branch(cls, name: str) -> str:
        return f"{BRANCHED}{name}"

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

    def asked(self) -> Asking | None:
        return None

    def alive(self) -> bool:
        return self.fd >= 0 or typist.reachable(typist.path(self.record.root, self.session))

    @classmethod
    def opening(cls, printed: bytes) -> str:
        return ""

    @classmethod
    def consent(cls, printed: bytes) -> bytes:
        return b""

    def send(self, text: str = "", groups: dict | None = None, yielding: str = "", now: bool = False, by: str = JOURNAL) -> bool:
        if now:
            return self._deliver(joined(text), by)
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
        if not self.TAKES_CHANNEL and self.awaits_answer():
            return ""
        self.held, self.yielding = self.held + self.yielding, []
        line = (f"the journal held back {len(self.held)} lines at once and dropped them - that many is a fault, not news" if len(self.held) > FLOOD
                else "; ".join(dict.fromkeys(self.held + counted(self.groups, self.record))))
        self.held, self.groups, self.sent_at = [], {}, time.time()
        self.failed = not self._deliver(line, JOURNAL)
        return "" if self.failed else line

    def _deliver(self, line: str, by: str) -> bool:
        if self.TAKES_CHANNEL and by == JOURNAL and self._post(line, by):
            return True
        if self.awaits_answer():
            return False
        return self._typed(f"{MARK} {line}", confirmed=True) if by == JOURNAL else self._typed(line, confirmed=self.ENTER_CAN_MISS)

    def _post(self, line: str, by: str) -> bool:
        raise NotImplementedError(f"{self.PRODUCT} takes no channel")

    def run_shell(self, command: str) -> bool:
        return bool(self.SHELL) and self._typed(f"{self.SHELL}{command.strip()}", confirmed=False)

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

    def press_raw(self, keys: bytes) -> None:
        text = keys.rstrip(b"\r")
        if text:
            self._wrote(text)
            time.sleep(ENTER_AFTER)
        if len(text) < len(keys):
            self._wrote(keys[len(text):])

    def _entered(self) -> bool:
        time.sleep(ENTER_AFTER)
        return self._wrote(b"\r")

    def elsewhere(self) -> bool:
        if not self.ELSEWHERE:
            return False
        tail = self.last_printed(SCREEN_TAIL)
        return tail.rfind(self.ELSEWHERE) > tail.rfind(self.INPUT_MARK.decode())

    def _typed(self, line: str, confirmed: bool) -> bool:
        if self.elsewhere():
            return False
        started = time.time()
        shown = self._shown_size()
        self.clear_input()
        time.sleep(ENTER_AFTER)
        raw = line.encode()
        pasted = len(raw) > PASTE_OVER
        if pasted:
            raw = PASTE_START + raw + PASTE_END
        if not self._wrote(raw):
            return False
        time.sleep(len(raw) / TYPED_PER_SECOND)
        if not pasted:
            self._echoed(line, shown)
        if not self._entered():
            return False
        if not confirmed and not self.INPUT_MARK:
            return True
        for _ in range(RESUBMITS):
            time.sleep(RECHECK)
            if self._landed(line, started, confirmed):
                return True
            if self._queued(shown):
                return self._send_now(shown)
            self._wrote(b"\r")
        return self._landed(line, started, confirmed)

    def _echoed(self, line: str, since: int) -> None:
        start = b"".join(line.encode().split())[:LINE_START]
        until = time.time() + ECHO_WAIT if self._screen_file().is_file() else 0.0
        while start not in self._shown_since(since) and time.time() < until:
            time.sleep(ECHO_STEP)

    def _queued(self, since: int) -> bool:
        return bool(self.QUEUED) and self.QUEUED in self._shown_since(since)

    def _send_now(self, since: int) -> bool:
        if self.RUNNING not in self._shown_since(since):
            return True
        self.sent_now = time.time()
        return self._wrote(self.SEND_NOW)

    def _screen_file(self) -> Path:
        return runtime.session_file(self.record.root, self.session, SCREEN)

    def _shown_size(self) -> int:
        screen = self._screen_file()
        return screen.stat().st_size if screen.is_file() else 0

    def _shown_since(self, since: int) -> bytes:
        try:
            with self._screen_file().open("rb") as shown:
                shown.seek(max(since, self._shown_size() - SCREEN_TAIL))
                return squeezed(shown.read())
        except OSError:
            return b""

    def _landed(self, line: str, since: float, confirmed: bool) -> bool:
        return not self._still_in_input(line) and (not confirmed or self._submitted(since))

    def _still_in_input(self, line: str) -> bool:
        if not self.INPUT_MARK:
            return False
        plain = self._shown_since(0)
        if self.INPUT_MARK not in plain:
            return False
        box = plain.rsplit(self.INPUT_MARK, 1)[1]
        return b"".join(line.encode().split())[:LINE_START] in box

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

    def awaits_answer(self) -> bool:
        report = self.last_report()
        return self.asking() or bool(report and report.asking)

    def last_report(self):
        if time.monotonic() - self.reported[0] >= REPORT_FOR:
            self.reported = (time.monotonic(), self._report())
        return self.reported[1]

    def last_title(self) -> str:
        last = self.last_report()
        return last.title if last and last.title else ""

    def _report(self):
        rows = [r for r in Agents(self.record, actor=SYSTEM).rows.viewed()
                if r.event and (r.title == self.session or self.owns(r) or (r.provider == self.name and float(r.at) >= self.born - 1))]
        return max(rows, key=lambda r: float(r.at)).fork() if rows else None

    def pid(self) -> int:
        return Sessions(self.record.root).read(self.session).pid

    def owns(self, row) -> bool:
        mine = self.pid()
        return bool(mine) and Sessions(self.record.root).read(row.title).pid == mine

    def quiet_for(self) -> float:
        try:
            return time.time() - self.printed.stat().st_mtime
        except OSError:
            return 0.0

    def printed_tail(self, size: int) -> bytes:
        try:
            return self.printed.read_bytes()[-size:]
        except OSError:
            return b""

    def last_printed(self, size: int = 400) -> str:
        return plain(self.printed_tail(size)).decode(errors="replace")

    def screen(self, size: int) -> str:
        return plain(self.SUGGESTED.sub(SUGGESTION, self.printed_tail(size))).decode(errors="replace")
