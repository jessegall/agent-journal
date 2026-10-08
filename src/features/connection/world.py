"""Test support: a hosted journal and two local copies as real processes; the tests of this feature and of the sync use it through the hosted_world fixture."""
import os
import subprocess
import sys
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path

from engine.record import Record

STOPPED_WITHIN = 10


@dataclass
class Copy:
    """One installed journal in a folder of its own, run as a real process when it is started."""

    name: str
    root: Path
    home: Path
    process: subprocess.Popen | None = None
    port: int = 0
    printed: list[str] = field(default_factory=list)

    @property
    def address(self) -> str:
        return f"http://127.0.0.1:{self.port}"

    def record(self, env: str = "main") -> Record:
        return Record(self.root, env)

    def run(self, *words: str, timeout: int = 60) -> subprocess.CompletedProcess:
        """A journal command against this copy, as a person would type it."""
        return subprocess.run([sys.executable, str(self.root / "journal.py"), "--root", str(self.root), "--env", "main", *words], cwd=self.root.parent,
                              env=self.environment(), capture_output=True, text=True, timeout=timeout)

    def environment(self) -> dict:
        return {**os.environ, "HOME": str(self.home), "AGENT_JOURNAL_ACTIVE": "1", "AGENT_JOURNAL_HOME": str(self.home / ".journal-machine"), "JOURNAL_ENV": ""}

    def running(self) -> bool:
        return self.process is not None and self.process.poll() is None


class World:
    """A hosted journal and two local copies, each its own installed journal in its own scratch folder, started and stopped as real processes."""

    def __init__(self, place: Path) -> None:
        self.copies = {name: self.install(name, place / name) for name in ("server", "laptop", "desk")}

    @staticmethod
    def install(name: str, place: Path) -> Copy:
        from tests.conftest import SOURCE, installed
        root = installed(place, SOURCE)
        return Copy(name, root, place / "home")

    @property
    def server(self) -> Copy:
        return self.copies["server"]

    @property
    def laptop(self) -> Copy:
        return self.copies["laptop"]

    @property
    def desk(self) -> Copy:
        return self.copies["desk"]

    def start(self, copy: Copy) -> Copy:
        """Starts the copy's server on the port it had before, or a free one the first time, and waits until it has printed its address."""
        from scripts.boot_guard import WAIT
        copy.printed.clear()
        copy.process = subprocess.Popen([sys.executable, str(copy.root / "journal.py"), "--root", str(copy.root), "serve", "--port", str(copy.port)], cwd=copy.root.parent,
                                        env=copy.environment(), stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
        threading.Thread(target=lambda: copy.printed.extend(iter(copy.process.stdout.readline, "")), daemon=True).start()
        began = time.time()
        while not copy.printed and time.time() - began < WAIT:
            time.sleep(0.1)
        if not copy.printed:
            raise AssertionError(f"{copy.name} printed no address within {WAIT} seconds")
        copy.port = int(copy.printed[0].strip().rstrip("/").rsplit(":", 1)[1])
        return copy

    def stop(self, copy: Copy) -> None:
        """Asks the copy's server to end and waits for it, so the next start finds its port free."""
        if not copy.running():
            return
        copy.process.terminate()
        try:
            copy.process.wait(STOPPED_WITHIN)
        except subprocess.TimeoutExpired:
            copy.process.kill()
            copy.process.wait()

    def kill(self, copy: Copy) -> None:
        """Ends the copy's server with no warning, as a crash does."""
        if copy.running():
            copy.process.kill()
            copy.process.wait()

    def close(self) -> None:
        for copy in self.copies.values():
            self.stop(copy)
