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
from supervisor.band_words import BandWords
from supervisor.inbox import Inbox
from supervisor.mirror import Mirror
from supervisor.services import Services
from supervisor.terminal import Terminal
from supervisor.verbs import Verbs

LONGEST = 65536
FRONT = "agent"
"""The process in front: the agent, in the user's terminal."""
REVIVE_WINDOW = 120.0
REVIVE_LIMIT = 3
"""Deaths of the agent within the window after which the supervisor ends with it instead of starting it again."""
FAULT_PAUSE = 0.5


class Supervisor:
    """One loop: stdin to the agent, the agent to stdout under the band, the inbox's requests answered, the services kept running; a fault in a turn is written to the faults log and never ends it."""

    def __init__(self, terminal: Terminal, inbox: Inbox, services: Services, stdin: int | None = 0, stdout: int = 1, band: Band | None = None, mirror: Mirror | None = None, faults: Path = Path(os.devnull)) -> None:
        self.terminal, self.inbox, self.services, self.stdin, self.stdout, self.faults = terminal, inbox, services, stdin, stdout, faults
        self.mirror = mirror
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
        if self.mirror:
            self.inbox.open_mirrored(self.mirror.path)
        else:
            self.inbox.open()
        self.services.start_all()
        self.terminal.start()
        self.fit()
        signal.signal(signal.SIGWINCH, lambda *_: self.fit())
        signal.signal(signal.SIGTERM, lambda *_: self.stop())
        signal.signal(signal.SIGHUP, lambda *_: self.hung_up())
        try:
            while self._code is None:
                self.turn()
        finally:
            self.services.stop_all()
            self.inbox.close()
            if self.mirror:
                self.mirror.close()
            if saved is not None and self.stdin is not None:
                termios.tcsetattr(self.stdin, termios.TCSADRAIN, saved)
        return self._code

    def turn(self) -> None:
        try:
            self.relay_once(0.5)
            self.services.keep_alive()
        except Exception:
            self.noted(traceback.format_exc())
            time.sleep(FAULT_PAUSE)

    def noted(self, fault: str) -> None:
        with self.faults.open("a") as out:
            out.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} supervisor fault, carried on: {fault}\n")

    def fit(self) -> None:
        """Gives the agent the terminal's size, less the band's row when there is one."""
        rows, columns = Terminal.size_of(self.stdin) if self.stdin is not None else (40, 120)
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
            self._gone(code)

    def terminal_named(self, name: str) -> Terminal:
        if name != FRONT:
            raise LookupError(f"no terminal process is named {name!r}")
        return self.terminal

    def send(self, name: str, data: bytes) -> None:
        """Bytes for a process's input: the agent's terminal, or a service's."""
        if name == FRONT:
            self.terminal.write(data)
            return
        self.services.named(name).send(data)

    def restart(self, name: str, resume: tuple[str, ...]) -> None:
        """The agent started again with the arguments that resume its session, or a service started again."""
        if name != FRONT:
            self.services.named(name).restart()
            return
        self._stopping = True
        self.terminal.restart(resume)
        self._stopping = False
        self.fit()

    def say(self, words: BandWords) -> None:
        """New words for the band, when there is one."""
        if self.band:
            self.band.say(words)

    def stop_named(self, name: str) -> None:
        """A service stopped and taken off the table, or the agent stopped and the supervisor with it: it is the process in front."""
        if name != FRONT:
            self.services.remove(name)
            return
        self.stop()

    def described(self) -> list[dict]:
        """Every process this supervisor runs, the agent in front first."""
        front = {"name": FRONT, "pid": self.terminal.pid, "running": self.terminal.pid > 0, "terminal": True, "front": True, "restarts": self._revivals}
        return [front, *self.services.described()]

    def stop(self) -> None:
        self._stopping = True
        self._code = self.terminal.stop(3.0)
        if self.band:
            self.band.end()

    def hung_up(self) -> None:
        """The window the agent ran in was closed: the agent is stopped, and nothing is written to a screen that is gone."""
        self.band = None
        self.stop()

    def _ended(self) -> None:
        """The agent's terminal closed: its exit code decides what follows, waited for a moment, and an agent that has not ended by then is stopped and its own code taken."""
        if self._stopping:
            return
        code = self.terminal.ended_within(3.0)
        self._gone(self.terminal.stop(3.0) if code is None else code)

    def _gone(self, code: int) -> None:
        """The agent ended: a clean exit ends the supervisor; a death starts it again with the arguments that resume its conversation, the services left running, unless it keeps dying."""
        now = time.time()
        self._deaths = [at for at in self._deaths if now - at < REVIVE_WINDOW]
        if code == 0 or len(self._deaths) >= REVIVE_LIMIT:
            self._code = code
            return
        self._deaths.append(now)
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
