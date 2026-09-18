from __future__ import annotations

import fcntl
import os
import pty
import re
import select
import signal
import struct
import sys
import termios
import time
import tty
from pathlib import Path

import news

#: how long the agent must print nothing before the launcher takes it to be idle
IDLE_SECONDS = 3.0
#: with no hooks reporting, how long a typed line stands before an unprocessed message is typed again
RETYPE_AFTER = 30.0
#: the least time between two typed lines: the agent's input queue takes them one at a time
TYPE_GAP = 2.0
#: how often the launcher looks whether its own code changed on disk
RELOAD_EVERY = 5.0
#: how many changes of the seat's decision the record keeps
WHYS_KEPT = 12
#: the pause between a typed line and its Enter, so the agent reads the Enter as a key and not as pasted text
ENTER_AFTER = 0.3
#: how much of what the agent printed the seat keeps, as plain text
PRINTED_KEEP = 400
#: how far back a fresh seat looks for news never told: a restart mid-conversation loses nothing
SINCE_BACK = 6 * 3600
ANSI_INPUT = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1bO[A-Za-z]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[PX^_][^\x1b]*\x1b\\")
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


def plain(data: bytes) -> str:
    return ANSI.sub(b"", data).decode(errors="replace")


class Launcher:

    def __init__(self, command: list[str], cwd: Path | None = None):
        self.command = command
        self.cwd = cwd
        self.pid = 0
        self.fd = -1
        self.last_output = 0.0
        self.typed = b""            # the user's line so far, since the last Enter
        self.user_lines = 0         # how many lines the user has sent
        self.printed = ""           # the tail of what the agent printed, as words
        self.raw = b""              # keystrokes not yet read as a line: a split escape sequence waits here
        self.outputs: list = []    # who wants the agent's output besides the terminal
        self.ticks: list = []      # who wants a moment of quiet, called once per select timeout

    def start(self) -> None:
        pid, fd = pty.fork()
        if pid == 0:
            if self.cwd:
                os.chdir(self.cwd)
            os.environ["JOURNAL_SEAT"] = str(os.getppid())   # the hooks report it: this seat reads only its own session
            os.execvp(self.command[0], self.command)
        self.pid, self.fd = pid, fd
        for tick in self.ticks:
            hot = getattr(tick, "nudger", None)
            if hot is not None:
                hot.reports.child = pid
        self._resize()

    def _resize(self, *_) -> None:
        try:
            size = fcntl.ioctl(sys.stdout.fileno(), termios.TIOCGWINSZ, b"\0" * 8)
            fcntl.ioctl(self.fd, termios.TIOCSWINSZ, size)
        except OSError:
            pass

    def write(self, data: bytes) -> None:
        while data:
            n = os.write(self.fd, data)
            data = data[n:]

    def type_line(self, text: str) -> None:
        self.write(text.encode())
        time.sleep(ENTER_AFTER)
        self.write(b"\r")

    def idle_for(self) -> float:
        return time.time() - self.last_output if self.last_output else 0.0

    def user_mid_line(self) -> bool:
        return bool(self.typed.strip()) and self.raw != b"\x1b"      # a bare Escape has dropped the line

    def run(self) -> int:
        stdin = sys.stdin.fileno()
        stdout = sys.stdout.fileno()
        saved = None
        try:
            saved = termios.tcgetattr(stdin)
            tty.setraw(stdin)
        except termios.error:
            saved = None                                 # not a tty: relay without raw mode
        signal.signal(signal.SIGWINCH, self._resize)
        self.last_output = time.time()
        try:
            while True:
                try:
                    ready, _, _ = select.select([self.fd, stdin], [], [], 0.5)
                except InterruptedError:
                    continue
                if self.fd in ready:
                    try:
                        data = os.read(self.fd, 65536)
                    except OSError:
                        break                            # the agent is gone
                    if not data:
                        break
                    os.write(stdout, data)
                    self.last_output = time.time()
                    self.printed = (self.printed + plain(data))[-PRINTED_KEEP:]
                    for want in self.outputs:
                        want(data)
                if stdin in ready:
                    data = os.read(stdin, 65536)
                    if not data:
                        break
                    self.write(data)
                    self._note_typed(data)
                for tick in self.ticks:
                    tick(self)
        finally:
            signal.signal(signal.SIGWINCH, signal.SIG_DFL)
            if saved is not None:
                termios.tcsetattr(stdin, termios.TCSADRAIN, saved)
        _, status = os.waitpid(self.pid, 0)
        return os.waitstatus_to_exitcode(status)

    def _note_typed(self, data: bytes) -> None:
        self.raw += data
        text = ANSI_INPUT.sub(b"", self.raw)
        cut = text.rfind(b"\x1b")
        pending = text[cut:] if cut >= 0 else b""
        if pending and len(pending) < 64 and (len(pending) == 1 or pending[1:2] in (b"[", b"O", b"]", b"P", b"X", b"^", b"_")):
            self.raw, text = pending, text[:cut]
        else:
            self.raw = b""
        for b in text:
            if b in (10, 13, 3, 27):
                if b in (10, 13) and self.typed.strip():
                    self.user_lines += 1
                self.typed = b""
            elif b in (8, 127):
                self.typed = self.typed[:-1]
            else:
                self.typed += bytes([b])


def run(command: list[str], cwd: Path | None = None, ticks: list | None = None, root: Path | None = None,
        env: str = "", quiet: bool = False) -> int:
    seat = Launcher(command, cwd)
    seat.ticks = list(ticks or [])
    if root is not None:
        seat.ticks.append(Hot(root, env, quiet))
    seat.start()
    return seat.run()


class Hot:

    WATCHED = ("launch.py", "news.py", "hook.py")

    def __init__(self, root: Path, env: str, quiet: bool):
        self.root, self.env, self.quiet = root, env, quiet
        self.stamps = self._stamps()
        self.nudger = Nudger(root, env, quiet=quiet)
        self.last_check = 0.0

    def _stamps(self) -> tuple:
        out = []
        for name in self.WATCHED:
            try:
                out.append(Path(__file__).with_name(name).stat().st_mtime_ns)
            except OSError:
                out.append(0)
        return tuple(out)

    def __call__(self, seat: Launcher) -> None:
        now = time.time()
        if now - self.last_check >= RELOAD_EVERY:
            self.last_check = now
            stamps = self._stamps()
            if stamps != self.stamps:
                self.stamps = stamps
                self.reload()
        self.nudger(seat)

    def reload(self) -> None:
        import importlib
        import sys
        me = sys.modules[__name__]
        try:
            importlib.reload(news)
            if "hook" in sys.modules:
                importlib.reload(sys.modules["hook"])
            fresh = importlib.reload(me)
        except Exception:                            # a half-written file: keep the nudger we have, look again later
            return
        old = self.nudger
        new = fresh.Nudger(self.root, self.env, quiet=self.quiet)
        for name in ("since", "told", "delivered", "typed_at", "nudged", "user_lines", "whys"):
            if hasattr(old, name):
                setattr(new, name, getattr(old, name))
        new.reports.born = old.reports.born      # the session's reports predate the reload; they are still its own
        new.reports.child = old.reports.child
        new.whys = (new.whys + [f"{time.strftime('%H:%M:%S')} reloaded the launcher's code"])[-fresh.WHYS_KEPT:]
        self.nudger = new


# ─────────────────────────────────────────────── what the hooks report, read from outside
class Reports:

    def __init__(self, root: Path):
        self.root = root
        self.born = time.time()
        self.offsets: dict = {}
        self.seat = str(os.getpid())
        self.child = 0                # the agent's pid, once the seat has started it

    def last(self) -> dict | None:
        import json
        folder = self.root / "runtime" / "events"
        if not folder.is_dir():
            return None
        newest = None
        for f in folder.glob("*.jsonl"):
            try:
                if f.stat().st_mtime < self.born - 1:
                    continue
                tail = f.read_bytes()[-4096:].decode(errors="replace").strip().splitlines()
                if not tail:
                    continue
                line = json.loads(tail[-1])
            except (OSError, ValueError):
                continue
            if line.get("seat") and line.get("seat") != self.seat:
                continue
            if self.child and line.get("ppid") and int(line["ppid"]) != self.child:
                continue
            if newest is None or line.get("at", 0) > newest.get("at", 0):
                newest = line
        return newest


# ─────────────────────────────────────────────── the viewer's news, typed into the agent
class Nudger:

    def __init__(self, root: Path, env: str, every: float = 2.0, quiet: bool = False):
        self.root = root
        self.env = env
        self.every = every
        self.quiet = quiet
        self.told: set = set()
        self.since = 0.0
        self.last_look = 0.0
        self.reports = Reports(root)
        self.typed_at = 0.0          # when this seat last typed; nothing more until the hooks report after it
        self.why = ""                # what the last look decided, kept in the seat record
        self.delivered: set = set()  # messages typed once already; typed again at the next idle moment if still unprocessed
        self.whys: list = []         # the last changes of that decision, with the clock: a missed message is read back here
        self.nudged = False          # the last line into the agent was the queue's, not the user's
        self.user_lines = 0          # the user's Enter count, as last seen

    def agent_idle(self, seat: Launcher) -> bool:
        last = self.reports.last()
        if last is not None:
            return last.get("event") in ("Stop", "SessionStart") and seat.idle_for() >= 1.0
        return seat.idle_for() >= IDLE_SECONDS

    def __call__(self, seat: Launcher) -> None:
        if self.quiet or not self.env:
            return
        now = time.time()
        if now - self.last_look < self.every:
            return
        self.last_look = now
        if getattr(seat, "user_lines", 0) != self.user_lines:
            self.user_lines = seat.user_lines
            self.nudged = False                      # the user spoke: the next queue read is a fresh one
        why = self.look(seat)
        if why != self.why:
            self.whys = (self.whys + [f"{time.strftime('%H:%M:%S')} {why}"])[-WHYS_KEPT:]
        self.why = why
        self.stamp(seat)

    def look(self, seat: Launcher) -> str:
        last = self.reports.last()
        idle = self.agent_idle(seat)
        if seat.user_mid_line():
            return f"the user is mid-line ({len(seat.typed)} chars)"
        try:
            pending = self.pending()
        except Exception as e:
            return f"news unreadable: {e!r}"
        if idle and self.settled():
            self.delivered -= {key for key, _ in pending if self.is_message(key)}
        for key, params in pending:
            if key in self.told or key in self.delivered:
                continue
            if time.time() - self.typed_at < TYPE_GAP:
                return "typed a moment ago"
            if self.is_message(key):
                self.delivered.add(key)
            else:
                self.told.add(key)
                self.mark([key])
            self.say(seat, params["content"])
            return f"typed {key}"
        if not idle:
            return f"not idle: last report {last.get('event') if last else 'none'}, quiet {seat.idle_for():.1f}s"
        if not self.settled():
            return "typed a moment ago, waiting for the hooks to report"
        line = self.owed()
        if line:
            self.say(seat, line)
            self.nudged = True
            return "typed the queue's line"
        return "nothing owed"

    def is_message(self, key: str) -> bool:
        return re.fullmatch(rf"{re.escape(self.env)}:\d+", key) is not None

    def say(self, seat: Launcher, line: str) -> None:
        # ONE LINE: a newline typed into the agent is Enter, and would send half a sentence
        seat.type_line(" ".join(part.strip() for part in line.splitlines() if part.strip()))
        self.typed_at = time.time()

    def settled(self) -> bool:
        last = self.reports.last()
        if last is None:                             # no hooks to report: a line stands for a while on its own
            return not self.typed_at or time.time() - self.typed_at >= RETYPE_AFTER
        return not self.typed_at or float(last.get("at") or 0) > self.typed_at

    def owed(self) -> str | None:
        last = self.reports.last()
        stem = last.get("session") if last else ""
        if not stem:
            return None
        try:
            import hook
            hook.ROOT = self.root
            return hook.nudge_for(stem, self.nudged)
        except Exception:
            return None

    def stamp(self, seat: Launcher) -> None:
        import state
        last = self.reports.last()
        stem = last.get("session") if last else ""
        if stem:
            try:
                state.put(self.root, "seat_seen", int(time.time()), stem=stem)
                state.put(self.root, "seat", {"working": not self.agent_idle(seat), "quiet": round(seat.idle_for(), 1),
                                              "why": self.why, "whys": self.whys, "env": self.env, "quiet_mode": self.quiet,
                                              "printed": " ".join(seat.printed.split())[-PRINTED_KEEP:]}, stem=stem)
            except OSError:
                pass

    def pending(self) -> list:
        news.ROOT = self.root
        first = not self.since
        if first:
            self.since = time.time() - SINCE_BACK
        got = news._waiting(self.env, self.since)
        if first:
            stale = [key for key, _ in got if not re.fullmatch(rf"{re.escape(self.env)}:\d+", key)]
            if stale:
                self.mark(stale)
                self.told.update(stale)
                got = [(key, params) for key, params in got if key not in self.told]
        return got

    def mark(self, keys: list) -> None:
        try:
            news._told(keys)
        except Exception:
            pass
