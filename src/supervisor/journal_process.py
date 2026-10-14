import subprocess
import time
from pathlib import Path

BACKOFF = 2.0


class JournalProcess:
    """The journal server beside the agent: started once, started again when it dies or is told to."""

    def __init__(self, root: Path, command: list[str], environ: dict[str, str], log: Path) -> None:
        self.root, self.command, self.environ, self.log = root, command, environ, log
        self._process: subprocess.Popen | None = None
        self._last_start = 0.0

    def start(self) -> None:
        self.log.parent.mkdir(parents=True, exist_ok=True)
        with self.log.open("ab") as out:
            self._process = subprocess.Popen(self.command, cwd=self.root, env=self.environ, stdin=subprocess.DEVNULL, stdout=out, stderr=out, start_new_session=True)
        self._last_start = time.time()

    def restart(self) -> None:
        self.stop()
        self.start()

    def alive(self) -> bool:
        return self._process is not None and self._process.poll() is None

    def keep_alive(self) -> None:
        if not self.alive() and time.time() - self._last_start >= BACKOFF:
            self.start()

    def stop(self) -> None:
        if self._process and self._process.poll() is None:
            self._process.terminate()
            try:
                self._process.wait(5)
            except subprocess.TimeoutExpired:
                self._process.kill()
                self._process.wait()
        self._process = None
