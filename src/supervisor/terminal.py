import fcntl
import os
import pty
import signal
import struct
import termios
import time

LONGEST = 65536
ENTER_AFTER = 0.3
"""Seconds between a typed line and its Enter: sent together, the agent takes them for a paste and keeps the line in its input."""


class Terminal:
    """The agent in a pty: the user's keys go in, its screen comes out, and the journal can type a line."""

    def __init__(self, command: list[str], cwd: str, environ: dict[str, str]) -> None:
        self.command, self.cwd, self.environ = command, cwd, environ
        self.fd, self.pid = -1, -1
        self._pending = bytearray()
        self._enter_due = 0.0

    def start(self) -> None:
        pid, fd = pty.fork()
        if pid == 0:
            os.chdir(self.cwd)
            os.execvpe(self.command[0], self.command, self.environ)
        self.pid, self.fd = pid, fd

    def restart(self, resume: tuple[str, ...]) -> None:
        """Stops the agent and starts it again with the arguments that resume its conversation."""
        self.stop(3.0)
        self.command = [self.command[0], *resume]
        self.start()

    def write(self, data: bytes) -> None:
        self._pending += data

    def feed(self) -> None:
        """Writes what is pending without blocking; the rest waits for the next turn."""
        if not self._pending:
            return
        flags = fcntl.fcntl(self.fd, fcntl.F_GETFL)
        fcntl.fcntl(self.fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)
        try:
            sent = os.write(self.fd, bytes(self._pending))
        except (BlockingIOError, InterruptedError):
            sent = 0
        finally:
            fcntl.fcntl(self.fd, fcntl.F_SETFL, flags)
        del self._pending[:sent]

    @property
    def has_pending(self) -> bool:
        return bool(self._pending)

    def read(self) -> bytes:
        try:
            return os.read(self.fd, LONGEST)
        except OSError:
            return b""

    def type(self, line: str) -> None:
        """Types the line, and presses Enter a moment later."""
        self.write(line.encode())
        self._enter_due = time.time() + ENTER_AFTER

    def press_enter_when_due(self) -> None:
        if self._enter_due and time.time() >= self._enter_due:
            self._enter_due = 0.0
            self.write(b"\r")

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
        if self.pid < 0:
            return None
        pid, status = os.waitpid(self.pid, os.WNOHANG)
        return os.waitstatus_to_exitcode(status) if pid else None

    def stop(self, grace: float) -> int:
        if self.pid < 0:
            return 0
        try:
            os.kill(self.pid, signal.SIGTERM)
        except ProcessLookupError:
            return 0
        until = time.time() + grace
        while time.time() < until:
            pid, status = os.waitpid(self.pid, os.WNOHANG)
            if pid:
                return os.waitstatus_to_exitcode(status)
            time.sleep(0.05)
        os.kill(self.pid, signal.SIGKILL)
        return os.waitstatus_to_exitcode(os.waitpid(self.pid, 0)[1])
