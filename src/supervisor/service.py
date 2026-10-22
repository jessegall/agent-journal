import os
import signal
import subprocess
import time
from pathlib import Path

BACKOFF = 2.0
LONGEST_WAIT_SECONDS = 30.0
WINDOW_SECONDS = 120.0
STOP_GRACE = 5.0


class Service:
    """A named process beside the agent, with no terminal: what is sent to it goes to its input, its output goes to its log, and it is started again when it dies."""

    def __init__(self, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path, persistent: bool = True) -> None:
        self.name, self.command, self.folder, self.environ, self.log, self.persistent = name, command, folder, environ, log, persistent
        self._process: subprocess.Popen | None = None
        self._last_start = 0.0
        self._deaths: list[float] = []
        self._restarts = 0

    def start(self) -> None:
        self.log.parent.mkdir(parents=True, exist_ok=True)
        self._last_start = time.time()
        with self.log.open("ab") as log_file:
            try:
                self._process = subprocess.Popen(self.command, cwd=self.folder, env=self.environ, stdin=subprocess.PIPE, stdout=log_file, stderr=log_file, start_new_session=True)
            except OSError as fault:
                log_file.write(f"{self.name} could not start: {fault}\n".encode())
                self._deaths = [death for death in self._deaths if self._last_start - death < WINDOW_SECONDS] + [self._last_start]

    def restart(self) -> None:
        self.stop()
        self.start()

    def is_active(self) -> bool:
        return self._process is not None and self._process.poll() is None

    def revive(self) -> None:
        if self._process is None or self.is_active():
            return
        moment = time.time()
        if not self._deaths or self._deaths[-1] < self._last_start:
            self._deaths = [death for death in self._deaths if moment - death < WINDOW_SECONDS] + [moment]
        if not self.persistent:
            return
        wait = 0.0 if len(self._deaths) == 1 else min(BACKOFF * 2 ** (len(self._deaths) - 2), LONGEST_WAIT_SECONDS)
        if moment - self._deaths[-1] >= wait:
            self._restarts += 1
            self.start()

    def send(self, data: bytes) -> None:
        if not self.is_active():
            raise LookupError(f"{self.name} is not running")
        self._process.stdin.write(data)
        self._process.stdin.flush()

    def described(self) -> dict:
        return {"name": self.name, "pid": self._process.pid if self.is_active() else 0, "running": self.is_active(), "terminal": False, "front": False, "restarts": self._restarts}

    def stop(self) -> None:
        if self.is_active():
            self.signal_group(signal.SIGTERM)
            deadline = time.time() + STOP_GRACE
            while self.is_active() and time.time() < deadline:
                time.sleep(0.05)
            self.signal_group(signal.SIGKILL)
            self._process.wait()
        self._process = None

    def signal_group(self, signal_kind: signal.Signals) -> None:
        try:
            os.killpg(self._process.pid, signal_kind)
        except (ProcessLookupError, PermissionError):
            return
