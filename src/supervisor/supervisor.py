import os
import select
import signal
import termios
import time
import traceback
import tty
from datetime import datetime
from pathlib import Path

from supervisor.band import Band
from supervisor.band_labels import BandLabels
from supervisor.inbox import Inbox
from supervisor.screen_copy import ScreenCopy
from supervisor.services import Services
from supervisor.terminal import Terminal
from supervisor.verbs import Verbs

LONGEST_BYTES = 65536
FRONT = "agent"
REVIVE_WINDOW_SECONDS = 120.0
REVIVE_DEATHS = 3
FAULT_PAUSE = 0.5


class Supervisor:
    """One loop: stdin to the agent, the agent to stdout under the band, the inbox's requests answered, the services kept running; a fault in a turn is written to the faults log and never ends it."""

    def __init__(self, terminal: Terminal, inbox: Inbox, services: Services, stdin: int | None = 0, stdout: int = 1, band: Band | None = None, screen_copy: ScreenCopy | None = None, faults: Path = Path(os.devnull)) -> None:
        self.terminal, self.inbox, self.services, self.stdin, self.stdout, self.faults = terminal, inbox, services, stdin, stdout, faults
        self.screen_copy = screen_copy
        """The agent's newest output written where the journal reads it; none in a supervisor with nobody to read it."""
        """stdin is None for a supervisor started by the journal, with nobody at a keyboard."""
        self.band = band
        """The line kept at the top of the screen; none when the output is not a terminal."""
        self.verbs = Verbs(self)
        self._stopping = False
        self._code: int | None = None
        self._deaths: list[float] = []
        self._revivals = 0

    def run(self) -> int:
        saved = self._raw()
        if self.screen_copy:
            self.inbox.open_mirrored(self.screen_copy.path)
        else:
            self.inbox.open()
        self.services.start_all()
        self.terminal.start()
        self.fit()
        signal.signal(signal.SIGWINCH, lambda *_: self.fit())
        signal.signal(signal.SIGTERM, lambda *_: self.stop())
        signal.signal(signal.SIGHUP, lambda *_: self.handle_hangup())
        try:
            while self._code is None:
                self.turn()
        finally:
            self.services.stop_all()
            self.inbox.close()
            if self.screen_copy:
                self.screen_copy.close()
            if saved is not None and self.stdin is not None:
                termios.tcsetattr(self.stdin, termios.TCSADRAIN, saved)
        return self._code

    def turn(self) -> None:
        try:
            self.relay_once(0.5)
            self.services.revive_stopped()
        except Exception:
            self.noted(traceback.format_exc())
            time.sleep(FAULT_PAUSE)

    def noted(self, fault: str) -> None:
        with self.faults.open("a") as log_file:
            log_file.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} supervisor fault, carried on: {fault}\n")

    def fit(self) -> None:
        rows, columns = Terminal.window_size(self.stdin) if self.stdin is not None else (40, 120)
        if self.band:
            self.band.resize(rows, columns)
            rows = self.band.agent_rows
        self.terminal.resize(rows, columns)

    def relay_once(self, timeout: float) -> None:
        reads = [fd for fd in (self.terminal.fd, self.inbox.fd, self.stdin) if fd is not None]
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
            os.write(self.stdout, self.band.shield(data) if self.band else data)
            if self.screen_copy:
                self.screen_copy.add(data)
        if self.stdin is not None and self.stdin in readable:
            data = os.read(self.stdin, LONGEST_BYTES)
            if not data:
                self.stop()
                return
            self.terminal.write(data)
            if self.screen_copy:
                self.screen_copy.keyed()
        if self.screen_copy:
            self.screen_copy.flush()
        if (code := self.terminal.exited()) is not None and not self._stopping:
            self._handle_exit(code)

    def find_terminal(self, name: str) -> Terminal:
        if name != FRONT:
            raise LookupError(f"no terminal process is named {name!r}")
        return self.terminal

    def send(self, name: str, data: bytes) -> None:
        if name == FRONT:
            self.terminal.write(data)
            return
        self.services.service(name).send(data)

    def restart(self, name: str, resume: tuple[str, ...]) -> None:
        if name != FRONT:
            self.services.service(name).restart()
            return
        self._stopping = True
        self.terminal.restart(resume)
        self._stopping = False
        self.fit()

    def display_band(self, labels: BandLabels) -> None:
        if self.band:
            self.band.display(labels)

    def stop_service(self, name: str) -> None:
        if name != FRONT:
            self.services.remove(name)
            return
        self.stop()

    def described(self) -> list[dict]:
        front = {"name": FRONT, "pid": self.terminal.pid, "running": self.terminal.pid > 0, "terminal": True, "front": True, "restarts": self._revivals}
        return [front, *self.services.described()]

    def stop(self) -> None:
        self._stopping = True
        self._code = self.terminal.stop(3.0)
        if self.band:
            self.band.end()

    def handle_hangup(self) -> None:
        self.band = None
        self.stop()

    def _ended(self) -> None:
        if self._stopping:
            return
        code = self.terminal.wait_exit(3.0)
        self._handle_exit(self.terminal.stop(3.0) if code is None else code)

    def _handle_exit(self, code: int) -> None:
        moment = time.time()
        self._deaths = [death for death in self._deaths if moment - death < REVIVE_WINDOW_SECONDS]
        if code == 0 or len(self._deaths) >= REVIVE_DEATHS:
            self._code = code
            return
        self._deaths.append(moment)
        self._revivals += 1
        self.terminal.restart(self.terminal.resume)
        self.fit()

    def _raw(self):
        if self.stdin is None:
            return None
        try:
            saved = termios.tcgetattr(self.stdin)
            tty.setraw(self.stdin)
            return saved
        except termios.error:
            return None
