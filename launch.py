from __future__ import annotations

import fcntl
import os
import pty
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
        """A whole line, ended with Enter, typed into the agent."""
        self.write(text.encode() + b"\r")

    def idle_for(self) -> float:
        return time.time() - self.last_output if self.last_output else 0.0

    def user_mid_line(self) -> bool:
        return bool(self.typed.strip())

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
        """What the user has on the line: Enter clears it, backspace shortens it, Ctrl-C and Escape drop it."""
        for b in data:
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
        nudger.since = time.time()
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
        self.nudged = False          # the last line into the agent was the queue's, not the user's
        self.user_lines = 0          # the user's Enter count, as last seen

    def agent_idle(self, seat: Launcher) -> bool:
        """Idle is what the hooks report, when they do: a Stop with no event after it. Without a
        hook (an agent the journal has no hooks in yet) the pty's own quiet has to do."""
        last = self.reports.last()
        if last is not None:
            return last.get("event") == "Stop" and seat.idle_for() >= 1.0
        return seat.idle_for() >= IDLE_SECONDS

    def __call__(self, seat: Launcher) -> None:
        if self.quiet or not self.env:
            return
        now = time.time()
        if now - self.last_look < self.every:
            return
        self.last_look = now
        self.stamp()
        if getattr(seat, "user_lines", 0) != self.user_lines:
            self.user_lines = seat.user_lines
            self.nudged = False                      # the user spoke: the next queue read is a fresh one
        if not self.agent_idle(seat) or seat.user_mid_line() or not self.settled():
            return
        for key, params in self.pending():
            if key in self.told:
                continue
            self.told.add(key)
            self.say(seat, params["content"])
            self.mark([key])
            return                                   # one line per quiet moment; the agent answers, then the next
        line = self.owed()
        if line:
            self.say(seat, line)
            self.nudged = True

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

    def stamp(self) -> None:
        """This session has a seat: the viewer reads it as one that hears the viewer while idle."""
        import state
        last = self.reports.last()
        stem = last.get("session") if last else ""
        if stem:
            try:
                state.put(self.root, "seat_seen", int(time.time()), stem=stem)
            except OSError:
                pass

    def pending(self) -> list:
        news.ROOT = self.root
        if not self.since:
            self.since = time.time()
        try:
            return news._waiting(self.env, self.since)
        except Exception:                            # a half-written record is next look's problem, not a crash
            return []

    def mark(self, keys: list) -> None:
        try:
            news._told(keys)
        except Exception:
            pass
