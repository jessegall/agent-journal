import fcntl
import os
import pty
import select
import signal
import struct
import termios
import time

LONGEST_BYTES = 65536
ENTER_DELAY_SECONDS = 0.5


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
        self.stop(3.0)
        self.resume = resume
        self.start()

    def write(self, data: bytes) -> None:
        self._pieces.append((bytearray(data), False))

    def feed(self) -> None:
        if not self._pieces:
            return
        segment, is_line = self._pieces[0]
        flags = fcntl.fcntl(self.fd, fcntl.F_GETFL)
        fcntl.fcntl(self.fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)
        try:
            byte_count = os.write(self.fd, bytes(segment))
        except (BlockingIOError, InterruptedError):
            byte_count = 0
        finally:
            fcntl.fcntl(self.fd, fcntl.F_SETFL, flags)
        del segment[:byte_count]
        if segment:
            return
        self._pieces.pop(0)
        if is_line:
            self._line_in_flight = False
            self._enter_due = time.time() + ENTER_DELAY_SECONDS

    @property
    def has_pending(self) -> bool:
        return bool(self._pieces)

    def read(self) -> bytes:
        try:
            return os.read(self.fd, LONGEST_BYTES)
        except OSError:
            return b""

    def type(self, line: str, delay_seconds: float = 0.0) -> None:
        self._lines.append((time.time() + delay_seconds, line))

    def pump(self) -> None:
        moment = time.time()
        if self._enter_due:
            if moment >= self._enter_due:
                self._enter_due = 0.0
                self.write(b"\r")
            return
        if self._line_in_flight:
            return
        if self._lines and moment >= self._lines[0][0]:
            _, line = self._lines.pop(0)
            self._pieces.append((bytearray(line.encode()), True))
            self._line_in_flight = True

    def resize(self, rows: int, columns: int) -> None:
        if self.fd >= 0:
            fcntl.ioctl(self.fd, termios.TIOCSWINSZ, struct.pack("HHHH", rows, columns, 0, 0))

    @staticmethod
    def window_size(fd: int) -> tuple[int, int]:
        try:
            rows, columns, _, _ = struct.unpack("HHHH", fcntl.ioctl(fd, termios.TIOCGWINSZ, b"\0" * 8))
            return (rows or 40, columns or 120)
        except OSError:
            return (40, 120)

    def exited(self) -> int | None:
        if self.pid < 0:
            return None
        pid, status = os.waitpid(self.pid, os.WNOHANG)
        if not pid:
            return None
        self.pid = -1
        return os.waitstatus_to_exitcode(status)

    def stop(self, grace: float) -> int:
        if self.pid < 0:
            return 0
        try:
            os.kill(self.pid, signal.SIGTERM)
        except ProcessLookupError:
            return self.exited() or 0
        code = self.wait_exit(grace)
        if code is None:
            os.kill(self.pid, signal.SIGKILL)
            code = self.wait_exit(grace)
        return 0 if code is None else code

    def wait_exit(self, seconds: float) -> int | None:
        deadline = time.time() + seconds
        while time.time() < deadline:
            code = self.exited()
            if code is not None:
                return code
            readable, _, _ = select.select([self.fd], [], [], 0.05)
            if readable:
                self.read()
        return None
