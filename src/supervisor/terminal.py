import fcntl
import os
import pty
import select
import signal
import struct
import termios
import time

LONGEST = 65536
ENTER_AFTER = 0.5
"""Seconds between a typed line reaching the terminal and its Enter: read together, the agent takes them for a paste and keeps the line in its input."""


class Terminal:
    """The agent in a pty: the user's keys go in, its screen comes out, and the journal can type a line."""

    def __init__(self, command: list[str], cwd: str, environ: dict[str, str], resume: tuple[str, ...] = ()) -> None:
        self.command, self.cwd, self.environ, self.resume = command, cwd, environ, resume
        """resume: the arguments that pick the conversation up, placed right after the program; a restart replaces them and keeps the rest."""
        self.fd, self.pid = -1, -1
        self._pieces: list[tuple[bytearray, bool]] = []
        """What goes in, each piece in a write of its own: the user's keys, a typed line (True: its Enter follows), an Enter."""
        self._lines: list[tuple[float, str]] = []
        self._line_in_flight = False
        self._enter_due = 0.0

    def start(self) -> None:
        pid, fd = pty.fork()
        if pid == 0:
            os.chdir(self.cwd)
            argv = [self.command[0], *self.resume, *self.command[1:]]
            os.execvpe(argv[0], argv, self.environ)
        self.pid, self.fd = pid, fd

    def restart(self, resume: tuple[str, ...]) -> None:
        """Stops the agent and starts it again with the arguments that resume its conversation, the rest of its command as it was."""
        self.stop(3.0)
        self.resume = resume
        self.start()

    def write(self, data: bytes) -> None:
        self._pieces.append((bytearray(data), False))

    def feed(self) -> None:
        """Writes the first piece without blocking; the rest waits for the next turn. A typed line that has gone in whole earns its Enter a moment later."""
        if not self._pieces:
            return
        piece, is_line = self._pieces[0]
        flags = fcntl.fcntl(self.fd, fcntl.F_GETFL)
        fcntl.fcntl(self.fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)
        try:
            sent = os.write(self.fd, bytes(piece))
        except (BlockingIOError, InterruptedError):
            sent = 0
        finally:
            fcntl.fcntl(self.fd, fcntl.F_SETFL, flags)
        del piece[:sent]
        if piece:
            return
        self._pieces.pop(0)
        if is_line:
            self._line_in_flight = False
            self._enter_due = time.time() + ENTER_AFTER

    @property
    def has_pending(self) -> bool:
        return bool(self._pieces)

    def read(self) -> bytes:
        try:
            return os.read(self.fd, LONGEST)
        except OSError:
            return b""

    def type(self, line: str, after: float = 0.0) -> None:
        """Queues the line to be typed after so many seconds, each followed by Enter a moment later, one line at a time."""
        self._lines.append((time.time() + after, line))

    def pump(self) -> None:
        """Types the next due line once the last one is in and answered with its Enter, or presses the Enter a typed line is waiting for."""
        now = time.time()
        if self._enter_due:
            if now >= self._enter_due:
                self._enter_due = 0.0
                self.write(b"\r")
            return
        if self._line_in_flight:
            return
        if self._lines and now >= self._lines[0][0]:
            _, line = self._lines.pop(0)
            self._pieces.append((bytearray(line.encode()), True))
            self._line_in_flight = True

    def resize(self, rows: int, columns: int) -> None:
        if self.fd >= 0:
            fcntl.ioctl(self.fd, termios.TIOCSWINSZ, struct.pack("HHHH", rows, columns, 0, 0))

    @staticmethod
    def size_of(fd: int) -> tuple[int, int]:
        try:
            rows, columns, _, _ = struct.unpack("HHHH", fcntl.ioctl(fd, termios.TIOCGWINSZ, b"\0" * 8))
            return (rows or 40, columns or 120)
        except OSError:
            return (40, 120)

    def exited(self) -> int | None:
        """The agent's exit code once it has ended, reaped here and never asked after again."""
        if self.pid < 0:
            return None
        pid, status = os.waitpid(self.pid, os.WNOHANG)
        if not pid:
            return None
        self.pid = -1
        return os.waitstatus_to_exitcode(status)

    def stop(self, grace: float) -> int:
        """Asks the agent to end, then makes it; the exit code, with the process reaped once. The terminal is drained all the while: an agent that is ending still writes to it, and a full pty would hold its exit forever."""
        if self.pid < 0:
            return 0
        try:
            os.kill(self.pid, signal.SIGTERM)
        except ProcessLookupError:
            return self.exited() or 0
        code = self.ended_within(grace)
        if code is None:
            os.kill(self.pid, signal.SIGKILL)
            code = self.ended_within(grace)
        return 0 if code is None else code

    def ended_within(self, seconds: float) -> int | None:
        until = time.time() + seconds
        while time.time() < until:
            code = self.exited()
            if code is not None:
                return code
            readable, _, _ = select.select([self.fd], [], [], 0.05)
            if readable:
                self.read()
        return None
