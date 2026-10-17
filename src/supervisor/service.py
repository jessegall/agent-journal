import subprocess
import time
from pathlib import Path

BACKOFF = 2.0


class Service:
    """A named process beside the agent, with no terminal: what is sent to it goes to its input, its output goes to its log, and it is started again when it dies."""

    def __init__(self, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path) -> None:
        self.name, self.command, self.folder, self.environ, self.log = name, command, folder, environ, log
        self._process: subprocess.Popen | None = None
        self._last_start = 0.0

    def start(self) -> None:
        self.log.parent.mkdir(parents=True, exist_ok=True)
        with self.log.open("ab") as out:
            self._process = subprocess.Popen(self.command, cwd=self.folder, env=self.environ, stdin=subprocess.PIPE, stdout=out, stderr=out, start_new_session=True)
        self._last_start = time.time()

    def restart(self) -> None:
        self.stop()
        self.start()

    def alive(self) -> bool:
        return self._process is not None and self._process.poll() is None

    def keep_alive(self) -> None:
        if not self.alive() and time.time() - self._last_start >= BACKOFF:
            self.start()

    def send(self, data: bytes) -> None:
        """Bytes written to the process's input, as another process sent them."""
        if not self.alive():
            raise LookupError(f"{self.name} is not running")
        self._process.stdin.write(data)
        self._process.stdin.flush()

    def described(self) -> dict:
        return {"name": self.name, "pid": self._process.pid if self.alive() else 0, "running": self.alive(), "terminal": False, "front": False}

    def stop(self) -> None:
        if self._process and self._process.poll() is None:
            self._process.terminate()
            try:
                self._process.wait(5)
            except subprocess.TimeoutExpired:
                self._process.kill()
                self._process.wait()
        self._process = None
