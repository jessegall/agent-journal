import os
import select
import signal
import termios
import time
import tty
import urllib.request
import webbrowser
from pathlib import Path

from supervisor.status_line import StatusLine
from supervisor.header import Header
from supervisor.inbox import Inbox
from supervisor.mirror import Mirror
from supervisor.services import Services
from supervisor.terminal import Terminal
from supervisor.verbs import Verbs

LONGEST = 65536
FRONT = "agent"
"""The process in front: the agent, in the user's terminal."""


class Supervisor:
    """One loop: stdin to the agent, the agent to stdout under the band, the inbox's requests answered, the services kept running, the status line kept current."""

    def __init__(self, terminal: Terminal, inbox: Inbox, services: Services, status: StatusLine, stdin: int | None = 0, stdout: int = 1, viewer: str = "", header: Header | None = None, mirror: Mirror | None = None, port_file: Path | None = None) -> None:
        self.terminal, self.inbox, self.services, self.status, self.stdin, self.stdout = terminal, inbox, services, status, stdin, stdout
        self.port_file = port_file
        """Where the journal writes its port once it is up; none when nobody waits for its page."""
        self.mirror = mirror
        """The agent's newest output written where the journal reads it; none in a supervisor with nobody to read it."""
        """stdin is None for a supervisor started by the journal, with nobody at a keyboard."""
        self.header = header
        """The band kept at the top of the screen; none when the output is not a terminal."""
        self.viewer = viewer
        """A page to open in the browser once the journal is up, as #/<environment>; empty opens nothing."""
        self.verbs = Verbs(self)
        self._stopping = False
        self._code: int | None = None
        self._noticed = False
        self._started_at = 0.0

    def run(self) -> int:
        saved = self._raw()
        self.inbox.open()
        self.services.start_all()
        self._started_at = time.time()
        self.terminal.start()
        self.fit()
        signal.signal(signal.SIGWINCH, lambda *_: self.fit())
        signal.signal(signal.SIGTERM, lambda *_: self.stop())
        try:
            while self._code is None:
                self.relay_once(0.5)
                self.services.keep_alive()
                self.notice_journal_once()
        finally:
            self.services.stop_all()
            self.inbox.close()
            if saved is not None and self.stdin is not None:
                termios.tcsetattr(self.stdin, termios.TCSADRAIN, saved)
        return self._code

    def fit(self) -> None:
        """Gives the agent the terminal's size, less the band's row when there is one, and the status line its first words."""
        rows, columns = Terminal.size_of(self.stdin) if self.stdin is not None else (40, 120)
        self.status.begin()
        if self.header:
            self.header.resize(rows, columns)
            rows = self.header.agent_rows
        self.terminal.resize(rows, columns)

    def relay_once(self, timeout: float) -> None:
        reads = [self.terminal.fd, self.inbox.fd, *([self.stdin] if self.stdin is not None else [])]
        writes = [self.terminal.fd] if self.terminal.has_pending else []
        readable, writable, _ = select.select(reads, writes, [], timeout)
        self.terminal.pump()
        if self.terminal.fd in writable:
            self.terminal.feed()
        if self.inbox.fd in readable:
            self.inbox.answer(self.verbs.handle)
        if self.terminal.fd in readable:
            data = self.terminal.read()
            if not data:
                self._ended()
                return
            os.write(self.stdout, self.header.shield(data) if self.header else data)
            if self.mirror:
                self.mirror.add(data)
        if self.stdin is not None and self.stdin in readable:
            data = os.read(self.stdin, LONGEST)
            if not data:
                self.stop()
                return
            self.terminal.write(data)
            if self.mirror:
                self.mirror.keyed()
        if self.mirror:
            self.mirror.flush()
        if (code := self.terminal.exited()) is not None and not self._stopping:
            self._code = code

    def notice_journal_once(self) -> None:
        """The first time the port in the port file answers: the status line shows the URL and the viewer opens in the browser; a port file left by a dead journal answers nothing."""
        if self._noticed or self.port_file is None:
            return
        if time.time() - self._started_at > 30:
            self._noticed = True
            return
        url = f"http://127.0.0.1:{self.port_file.read_text().strip()}/" if self.port_file.is_file() else ""
        if not url or not self._answers(url):
            return
        self._noticed = True
        self.status.set_url(url)
        if self.header:
            self.header.set_url(url)
        if self.viewer:
            webbrowser.open(url + self.viewer, new=2)

    @staticmethod
    def _answers(url: str) -> bool:
        try:
            with urllib.request.urlopen(url, timeout=0.5) as reply:
                return reply.status == 200
        except OSError:
            return False

    def terminal_named(self, name: str) -> Terminal:
        if name != FRONT:
            raise LookupError(f"no terminal process is named {name!r}")
        return self.terminal

    def restart(self, name: str, resume: tuple[str, ...]) -> None:
        """The agent started again with the arguments that resume its session, or a service started again."""
        if name != FRONT:
            self.services.named(name).restart()
            return
        self._stopping = True
        self.terminal.restart(resume)
        self._stopping = False
        self.fit()

    def stop_named(self, name: str) -> None:
        """A service stopped and taken off the table, or the agent stopped and the supervisor with it: it is the process in front."""
        if name != FRONT:
            self.services.remove(name)
            return
        self.stop()

    def described(self) -> list[dict]:
        """Every process this supervisor runs, the agent in front first."""
        front = {"name": FRONT, "pid": self.terminal.pid, "running": self.terminal.pid > 0, "terminal": True, "front": True}
        return [front, *self.services.described()]

    def stop(self) -> None:
        self._stopping = True
        self._code = self.terminal.stop(3.0)
        if self.header:
            self.header.end()

    def _ended(self) -> None:
        if self._stopping:
            return
        code = self.terminal.exited()
        self._code = code if code is not None else 0

    def _raw(self):
        if self.stdin is None:
            return None
        try:
            saved = termios.tcgetattr(self.stdin)
            tty.setraw(self.stdin)
            return saved
        except termios.error:
            return None
