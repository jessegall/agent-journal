import fcntl
import json
import os
import threading
import time
from collections.abc import Callable, Iterator
from contextlib import contextmanager
from pathlib import Path

from engine.disk import read_json, replace
from engine.viewer import machine
from engine.wording import digest

FOLDER = "hosted"
VAULT = "AGENT_JOURNAL_VAULT"
SECRET = 0o600
PRIVATE = 0o700
AUDIT = "audit.log"
AUDIT_BYTES = 1024 * 1024
LOCK = "vault.lock"
WRITING = threading.Lock()

Clock = Callable[[], float]


class DiskFull(OSError):
    @classmethod
    def writing(cls, name: str, cause: OSError) -> "DiskFull":
        return cls(f"the server could not save {name}: {cause.strerror or cause}")


class Vault:
    """The files a hosted journal keeps outside its record, readable by the server's own user alone."""

    def __init__(self, root: Path, clock: Clock = time.time) -> None:
        self.base = Path(os.environ[VAULT]) if VAULT in os.environ else machine().with_name(FOLDER)
        self.folder = self.base / digest(str(Path(root).resolve()))
        self.clock = clock

    def opened(self) -> Path:
        for folder in (self.base, self.folder):
            folder.mkdir(mode=PRIVATE, parents=True, exist_ok=True)
            folder.chmod(PRIVATE)
        return self.folder

    @contextmanager
    def held(self) -> Iterator[None]:
        """One reader-and-writer at a time, across this process's threads and every other process on the server."""
        with WRITING, os.fdopen(os.open(self.opened() / LOCK, os.O_WRONLY | os.O_CREAT, SECRET), "w") as kept:
            fcntl.flock(kept, fcntl.LOCK_EX)
            yield

    def read(self, name: str) -> dict:
        return read_json(self.folder / name, dict, {})

    def write(self, name: str, data: dict) -> None:
        try:
            replace(self.opened() / name, json.dumps(data).encode(), SECRET)
        except OSError as cause:
            raise DiskFull.writing(name, cause) from cause

    def remove(self, name: str) -> None:
        (self.folder / name).unlink(missing_ok=True)

    def audit(self, what: str, **facts) -> None:
        """One line per login, logout, lock-out and refusal; it never holds a password, a code or a token."""
        log = self.opened() / AUDIT
        if log.is_file() and log.stat().st_size > AUDIT_BYTES:
            os.replace(log, log.with_suffix(".log.1"))
        line = json.dumps({"at": round(self.clock(), 3), "what": what, **facts}) + "\n"
        try:
            with os.fdopen(os.open(log, os.O_WRONLY | os.O_CREAT | os.O_APPEND, SECRET), "a") as kept:
                kept.write(line)
        except OSError as cause:
            raise DiskFull.writing(AUDIT, cause) from cause
