import os
import signal
import subprocess
import time
from pathlib import Path

BACKOFF = 2.0
"""The wait before the second start after a death in the window; the first is at once, and it doubles with each death after, up to LONGEST_WAIT."""
LONGEST_WAIT = 30.0
WINDOW = 120.0


class Service:
    """A named process beside the agent, with no terminal: what is sent to it goes to its input, its output goes to its log, and it is started again when it dies."""

    def __init__(self, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path, keep: bool = True) -> None:
        self.name, self.command, self.folder, self.environ, self.log, self.keep = name, command, folder, environ, log, keep
        """keep: started again whenever it dies."""
        self._process: subprocess.Popen | None = None
        self._last_start = 0.0
        self._deaths: list[float] = []
        self._restarts = 0

    def start(self) -> None:
        """Started in a session of its own; a program or folder that is not there, as mid-upgrade, is a start that died at once, written to its log, never a fault of the supervisor's."""
        self.log.parent.mkdir(parents=True, exist_ok=True)
        self._last_start = time.time()
        with self.log.open("ab") as out:
            try:
                self._process = subprocess.Popen(self.command, cwd=self.folder, env=self.environ, stdin=subprocess.PIPE, stdout=out, stderr=out, start_new_session=True)
            except OSError as fault:
                out.write(f"{self.name} could not start: {fault}\n".encode())
                self._deaths = [at for at in self._deaths if self._last_start - at < WINDOW] + [self._last_start]

    def restart(self) -> None:
        self.stop()
        self.start()

    def alive(self) -> bool:
        return self._process is not None and self._process.poll() is None

    def keep_alive(self) -> None:
        """A kept process that died is started again, always: at once the first time in the window, then after a wait that doubles with each death, up to LONGEST_WAIT."""
        if self._process is None or self.alive():
            return
        now = time.time()
        if not self._deaths or self._deaths[-1] < self._last_start:
            self._deaths = [at for at in self._deaths if now - at < WINDOW] + [now]
        if not self.keep:
            return
        wait = 0.0 if len(self._deaths) == 1 else min(BACKOFF * 2 ** (len(self._deaths) - 2), LONGEST_WAIT)
        if now - self._deaths[-1] >= wait:
            self._restarts += 1
            self.start()

    def send(self, data: bytes) -> None:
        """Bytes written to the process's input, as another process sent them."""
        if not self.alive():
            raise LookupError(f"{self.name} is not running")
        self._process.stdin.write(data)
        self._process.stdin.flush()

    def described(self) -> dict:
        return {"name": self.name, "pid": self._process.pid if self.alive() else 0, "running": self.alive(), "terminal": False, "front": False, "restarts": self._restarts}

    def stop(self) -> None:
        """The process and every process it started, its whole group, ended: asked first, then made to."""
        if self._process and self._process.poll() is None:
            self.signal_group(signal.SIGTERM)
            try:
                self._process.wait(5)
            except subprocess.TimeoutExpired:
                self.signal_group(signal.SIGKILL)
                self._process.wait()
        if self._process:
            self.signal_group(signal.SIGKILL)
        self._process = None

    def signal_group(self, sent: signal.Signals) -> None:
        """A signal to the process's group, which it leads since it started in a session of its own; a group already gone is left."""
        try:
            os.killpg(self._process.pid, sent)
        except ProcessLookupError:
            return
