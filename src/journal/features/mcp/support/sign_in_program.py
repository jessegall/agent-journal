import os
import re
import select
import subprocess
import threading
import time
from typing import Callable

from journal.support.rejection import Rejection

# the terminal's colours and links, which a program prints around the address
TERMINAL_CODES = re.compile(r"\x1b\][^\x07]*\x07|\x1b\[[0-9;?]*[A-Za-z]")
AUTHORIZATION = re.compile(r"https?://\S*redirect_uri=\S*")
QUERY_VALUE = re.compile(r"([?&][^=&\s]+=)[^&\s]+")
READ_SECONDS = 0.2
# a sign-in nobody finished in this time is stopped, so no program waits on the port for ever
WAITING_SECONDS = 900
SAID_CHARACTERS = 300


class SignInProgram:
    """An agent program's own sign-in to an MCP server, running in its private terminal: what it printed, the sign-in page it asks the user to open, and how it ended."""

    def __init__(self, process: subprocess.Popen, terminal: int, settled: Callable[["SignInProgram"], None]) -> None:
        self.process, self.terminal, self.settled = process, terminal, settled
        self.printed = b""
        self.ended = threading.Event()
        threading.Thread(target=self.follow, name="mcp-sign-in", daemon=True).start()

    def follow(self) -> None:
        deadline = time.monotonic() + WAITING_SECONDS
        while self.process.poll() is None and time.monotonic() < deadline:
            if select.select([self.terminal], [], [], READ_SECONDS)[0]:
                self.take()
        self.stop()
        while select.select([self.terminal], [], [], 0)[0] and self.take():
            pass
        os.close(self.terminal)
        self.process.wait()
        self.ended.set()
        self.settled(self)

    def take(self) -> bool:
        try:
            chunk = os.read(self.terminal, 4096)
        except OSError:
            return False
        self.printed += chunk
        return bool(chunk)

    def text(self) -> str:
        return TERMINAL_CODES.sub("", self.printed.decode(errors="replace"))

    def authorization(self, seconds: float) -> str:
        """The sign-in page the program printed, waited for as long as it may take to print it."""
        deadline = time.monotonic() + seconds
        while not AUTHORIZATION.search(self.text()) and not self.ended.is_set() and time.monotonic() < deadline:
            self.ended.wait(READ_SECONDS)
        found = AUTHORIZATION.search(self.text())
        if not found:
            self.stop()
            raise Rejection(f"the sign-in did not start: {self.said() or 'the program printed no sign-in page'}")
        return found.group(0)

    def has_ended(self, seconds: float) -> bool:
        return self.ended.wait(seconds)

    def succeeded(self) -> bool:
        return self.process.returncode == 0

    def said(self) -> str:
        """The program's last words after its sign-in page, every value in an address hidden, so no code or token it echoes is ever shown or logged."""
        lines = [line.strip() for line in self.text().splitlines() if line.strip() and not AUTHORIZATION.search(line)]
        return QUERY_VALUE.sub(r"\1…", " ".join(lines[-3:]))[-SAID_CHARACTERS:]

    def stop(self) -> None:
        if self.process.poll() is None:
            self.process.kill()
