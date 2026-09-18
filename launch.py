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
#: the pause between a typed line and its Enter, so the agent reads the Enter as a key and not as pasted text
ENTER_AFTER = 0.3
#: how much of what the agent printed the seat keeps, as plain text
PRINTED_KEEP = 400
#: how far back a fresh seat looks for news never told: a restart mid-conversation loses nothing
SINCE_BACK = 6 * 3600
#: terminal control sequences: colours, cursor moves, mode switches — what the pty carries beside the words
#: what a terminal sends on stdin besides keys: focus in/out, arrows and other CSI, SS3 keys, paste marks, OSC
ANSI_INPUT = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1bO[A-Za-z]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)")
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")


def plain(data: bytes) -> str:
    """The words in a stretch of terminal output, without the control sequences around them."""
    return ANSI.sub(b"", data).decode(errors="replace")


class Launcher:
    """An agent run under a pseudo-terminal, with the launcher between it and the real one.

    THE LAUNCHER IS THE ORCHESTRATOR'S SEAT. Everything the user types goes to the agent and
    everything the agent prints comes back, byte for byte, with the window size passed through —
    so the agent cannot tell it is not on the terminal itself. What the seat adds is a place
    outside the agent from which to watch it (is it printing, when did it last, has the user
    a half-typed line) and to speak to it, by typing, without a hook inside the agent's turn.
    """

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
            os.execvp(self.command[0], self.command)
        self.pid, self.fd = pid, fd
        self._resize()

    def _resize(self, *_) -> None:
        try:
            size = fcntl.ioctl(sys.stdout.fileno(), termios.TIOCGWINSZ, b"\0" * 8)
            fcntl.ioctl(self.fd, termios.TIOCSWINSZ, size)
        except OSError:
            pass

    def write(self, data: bytes) -> None:
        """Into the agent, as if typed."""
        while data:
            n = os.write(self.fd, data)
            data = data[n:]

    def type_line(self, text: str) -> None:
        """A whole line, then Enter — a beat later, on its own.

        MEASURED: the line landed in Claude Code's input box and sat there. Bytes that arrive in one
        burst are read as a paste, and the Enter inside the burst became part of it instead of
        sending it. A pause before the Enter makes it a keystroke again.
        """
        self.write(text.encode())
        time.sleep(ENTER_AFTER)
        self.write(b"\r")

    def idle_for(self) -> float:
        return time.time() - self.last_output if self.last_output else 0.0

    def user_mid_line(self) -> bool:
        return bool(self.typed.strip()) and self.raw != b"\x1b"      # a bare Escape has dropped the line

    def run(self) -> int:
        """Relay until the agent exits; the terminal is put back however this ends."""
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
                if not ready:
                    for tick in self.ticks:
                        tick(self)
        finally:
            signal.signal(signal.SIGWINCH, signal.SIG_DFL)
            if saved is not None:
                termios.tcsetattr(stdin, termios.TCSADRAIN, saved)
        _, status = os.waitpid(self.pid, 0)
        return os.waitstatus_to_exitcode(status)

    def _note_typed(self, data: bytes) -> None:
        """What the user has on the line: Enter clears it, backspace shortens it, Ctrl-C drops it.

        THE TERMINAL TYPES TOO. Focus events (`ESC [ I`, `ESC [ O`), arrow keys, bracketed-paste
        marks and mouse reports all arrive on stdin as escape sequences, and each one used to
        leave its tail on the line — `[I` after every switch to the browser — so the seat believed
        the user was mid-sentence and never typed again. Measured: a message left in the viewer was
        never typed into a session that sat idle at its prompt. Sequences are stripped whole; a bare
        Escape still drops the line, as it does in the agent.
        """
        self.raw += data
        text = ANSI_INPUT.sub(b"", self.raw)
        # a sequence still arriving is kept for the next read; it is never part of the line. A bare
        # Escape followed by an ordinary key is two keys, not the start of a sequence.
        cut = text.rfind(b"\x1b")
        pending = text[cut:] if cut >= 0 else b""
        if pending and len(pending) < 8 and (len(pending) == 1 or pending[1:2] in (b"[", b"O", b"]")):
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
        nudger = Nudger(root, env, quiet=quiet)
        seat.ticks.append(nudger)
    seat.start()
    return seat.run()


# ─────────────────────────────────────────────── what the hooks report, read from outside
class Reports:
    """The hooks' event lines for the sessions this launcher started, newest last.

    A HOOK WRITES ONE LINE PER EVENT and the launcher reads them here: which session is inside
    the pty is not known until its first hook fires, so every events file that appears after the
    launch is taken as this seat's — one launcher, one agent, one terminal.
    """

    def __init__(self, root: Path):
        self.root = root
        self.born = time.time()
        self.offsets: dict = {}

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
            if newest is None or line.get("at", 0) > newest.get("at", 0):
                newest = line
        return newest


# ─────────────────────────────────────────────── the viewer's news, typed into the agent
class Nudger:
    """What the channel used to push, typed into the agent's terminal by the seat outside it.

    WHEN, NOT WHAT, IS THE WHOLE CARE. The words are the record's own (`news._waiting`), so
    nothing is said twice or said differently; what the seat adds is judgement about the moment:
    the agent has printed nothing for IDLE_SECONDS, the user has no half-typed line, and the
    thing has not been typed before. Then one line, and Enter.
    """

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
        self.nudged = False          # the last line into the agent was the queue's, not the user's
        self.user_lines = 0          # the user's Enter count, as last seen

    def agent_idle(self, seat: Launcher) -> bool:
        """Idle is what the hooks report, when they do: a Stop with no event after it. Without a
        hook (an agent the journal has no hooks in yet) the pty's own quiet has to do."""
        last = self.reports.last()
        if last is not None:
            # A SESSION JUST STARTED OR RESUMED IS IDLE TOO: it sits at its prompt with no Stop behind it.
            # Measured: a resumed session was never typed to, because its last report was SessionStart.
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
        self.why = self.look(seat)
        self.stamp(seat)

    def look(self, seat: Launcher) -> str:
        """One look at the agent, and what it decided, in words the seat record keeps: WHY THE SEAT
        DID NOT TYPE is the one question a user asks when a message sits unanswered."""
        last = self.reports.last()
        if not self.agent_idle(seat):
            return f"not idle: last report {last.get('event') if last else 'none'}, quiet {seat.idle_for():.1f}s"
        if seat.user_mid_line():
            return f"the user is mid-line ({len(seat.typed)} chars)"
        if not self.settled():
            return "typed a moment ago, waiting for the hooks to report"
        try:
            pending = self.pending()
        except Exception as e:                       # never a crash; the record says what broke
            return f"news unreadable: {e!r}"
        for key, params in pending:
            if key in self.told:
                continue
            self.told.add(key)
            self.say(seat, params["content"])
            self.mark([key])
            return f"typed {key}"                    # one line per quiet moment; the agent answers, then the next
        line = self.owed()
        if line:
            self.say(seat, line)
            self.nudged = True
            return "typed the queue's line"
        return "nothing owed"

    def say(self, seat: Launcher, line: str) -> None:
        # ONE LINE: a newline typed into the agent is Enter, and would send half a sentence
        seat.type_line(" ".join(part.strip() for part in line.splitlines() if part.strip()))
        self.typed_at = time.time()

    def settled(self) -> bool:
        """The hooks have reported since this seat last typed — so a line typed a moment ago is
        not typed over while the agent is still picking it up."""
        last = self.reports.last()
        if last is None:
            return True
        return not self.typed_at or float(last.get("at") or 0) > self.typed_at

    def owed(self) -> str | None:
        """THE STOP QUEUE, READ FROM OUTSIDE. What the stop hook would have held the turn with —
        untagged, open work, the next to-do under auto mode, a question answered — typed in
        instead, one subject per quiet moment; `nudged` tells the queue the agent is answering it."""
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
        """This session has a seat, and this is what the seat sees: working or idle, and the last
        words the agent printed. The viewer's agent bar reads it instead of the hooks' state."""
        import state
        last = self.reports.last()
        stem = last.get("session") if last else ""
        if stem:
            try:
                state.put(self.root, "seat_seen", int(time.time()), stem=stem)
                state.put(self.root, "seat", {"working": not self.agent_idle(seat), "quiet": round(seat.idle_for(), 1),
                                              "why": self.why, "env": self.env, "quiet_mode": self.quiet,
                                              "printed": " ".join(seat.printed.split())[-PRINTED_KEEP:]}, stem=stem)
            except OSError:
                pass

    def pending(self) -> list:
        news.ROOT = self.root
        # WHAT WAS LEFT BEFORE THE SEAT SAT DOWN IS STILL OWED. A message written while the agent was
        # being restarted must be typed once it is idle; what was told already is marked told in the
        # record and never repeats, so the look back costs nothing but the first read.
        first = not self.since
        if first:
            self.since = time.time() - SINCE_BACK
        got = news._waiting(self.env, self.since)
        if first:
            # ONLY A MESSAGE STILL WAITING IS OWED FROM BEFORE THE SEAT SAT DOWN. A reaction, a reply
            # or a plan approved hours ago and never told is history — measured: a fresh seat typed
            # six of them one after another before the user's new message. They are marked told,
            # unspoken; a message nobody has read yet is not.
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
