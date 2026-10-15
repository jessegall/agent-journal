import os
import select
import signal
import termios
import time
import tty
import urllib.request
import webbrowser
from pathlib import Path

from supervisor.inbox import Inbox
from supervisor.instructions.instruction import Instruction
from supervisor.instructions.restart_agent import RestartAgent
from supervisor.instructions.restart_journal import RestartJournal
from supervisor.instructions.stop import Stop
from supervisor.instructions.type import Type
from supervisor.journal_process import JournalProcess
from supervisor.terminal import Terminal

LONGEST = 65536


class Supervisor:
    """One loop: stdin to the agent, the agent to stdout, the inbox's instructions carried out, the journal kept running."""

    def __init__(self, terminal: Terminal, inbox: Inbox, journal: JournalProcess, stdin: int = 0, stdout: int = 1, viewer: str = "") -> None:
        self.terminal, self.inbox, self.journal, self.stdin, self.stdout = terminal, inbox, journal, stdin, stdout
        self.viewer = viewer
        """A page to open in the browser once the journal is up, as #/<environment>; empty opens nothing."""
        self._stopping = False
        self._code: int | None = None
        self._opened = False
        self._started_at = 0.0

    def run(self) -> int:
        saved = self._raw()
        self.inbox.open()
        self.journal.start()
        self._started_at = time.time()
        self.terminal.start()
        signal.signal(signal.SIGWINCH, lambda *_: self.terminal.resize(*Terminal.size_of(self.stdin)))
        signal.signal(signal.SIGTERM, lambda *_: self.stop())
        try:
            while self._code is None:
                self.relay_once(0.5)
                self.journal.keep_alive()
                self.open_viewer_once()
        finally:
            self.journal.stop()
            self.inbox.close()
            if saved is not None:
                termios.tcsetattr(self.stdin, termios.TCSADRAIN, saved)
        return self._code

    def relay_once(self, timeout: float) -> None:
        reads = [self.stdin, self.terminal.fd, self.inbox.fd]
        writes = [self.terminal.fd] if self.terminal.has_pending else []
        readable, writable, _ = select.select(reads, writes, [], timeout)
        if self.terminal.fd in writable:
            self.terminal.feed()
        if self.inbox.fd in readable:
            for instruction in self.inbox.received():
                self.carry_out(instruction)
        if self.terminal.fd in readable:
            data = self.terminal.read()
            if not data:
                self._ended()
                return
            os.write(self.stdout, data)
        if self.stdin in readable:
            data = os.read(self.stdin, LONGEST)
            if not data:
                self.stop()
                return
            self.terminal.write(data)
        if (code := self.terminal.exited()) is not None and not self._stopping:
            self._code = code

    def open_viewer_once(self) -> None:
        """Opens the viewer in the browser the first time the port in the port file answers, and never again; a port file left by a dead journal answers nothing."""
        if self._opened or not self.viewer:
            return
        if time.time() - self._started_at > 30:
            self._opened = True
            return
        port_file = self.journal.root / ".journal" / "port"
        url = f"http://127.0.0.1:{port_file.read_text().strip()}/" if port_file.is_file() else ""
        if not url or not self._answers(url):
            return
        self._opened = True
        webbrowser.open(url + self.viewer, new=2)

    @staticmethod
    def _answers(url: str) -> bool:
        try:
            with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=0.5) as reply:
                return reply.status < 500
        except OSError:
            return False

    def carry_out(self, instruction: Instruction) -> None:
        """Dispatches on the instruction's type to one of the four below."""
        {Type: self.type, RestartAgent: self.restart_agent, RestartJournal: self.restart_journal, Stop: self.stop}[type(instruction)](instruction)

    def type(self, instruction: Type) -> None:
        self.terminal.type(instruction.line)

    def restart_agent(self, instruction: RestartAgent) -> None:
        self._stopping = True
        self.terminal.restart(instruction.resume)
        self._stopping = False

    def restart_journal(self, instruction: RestartJournal) -> None:
        self.journal.restart()

    def stop(self, instruction: Stop | None = None) -> None:
        self._stopping = True
        self._code = self.terminal.stop(3.0)

    def _ended(self) -> None:
        if self._stopping:
            return
        code = self.terminal.exited()
        self._code = code if code is not None else 0

    def _raw(self):
        try:
            saved = termios.tcgetattr(self.stdin)
            tty.setraw(self.stdin)
            return saved
        except termios.error:
            return None
