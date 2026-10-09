import fcntl
import json
import os
import threading
import time
from collections.abc import Callable, Iterator
from contextlib import contextmanager
from pathlib import Path

from engine.disk import append, read_json, replace
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
        replace(self.opened() / name, json.dumps(data).encode(), SECRET)

    def drop(self, name: str, key: str) -> None:
        """Takes one key out of a vault file, under the vault's lock."""
        with self.held():
            kept = self.read(name)
            kept.pop(key, None)
            self.write(name, kept)

    def remove(self, name: str) -> None:
        (self.folder / name).unlink(missing_ok=True)

    def audit(self, what: str, **facts) -> None:
        """One line per login, logout, lock-out and refusal; it never holds a password, a code or a token."""
        log = self.opened() / AUDIT
        if log.is_file() and log.stat().st_size > AUDIT_BYTES:
            os.replace(log, log.with_suffix(".log.1"))
        append(log, json.dumps({"at": round(self.clock(), 3), "what": what, **facts}) + "\n", SECRET)


class RefusalLog:
    """At most so many refusals a minute reach the audit log; the rest are counted, and the count is written when the next minute starts."""

    def __init__(self, per_minute: int, clock: Clock = time.time) -> None:
        self.per_minute = per_minute
        self.clock = clock
        self.minute = 0
        self.written = 0
        self.dropped = 0
        self.lock = threading.Lock()

    def write(self, vault: Vault, **facts) -> None:
        with self.lock:
            minute = int(self.clock() // 60)
            if minute != self.minute:
                if self.dropped:
                    vault.audit("refusals not logged", count=self.dropped)
                self.minute, self.written, self.dropped = minute, 0, 0
            if self.written >= self.per_minute:
                self.dropped += 1
                return
            self.written += 1
        vault.audit("refused", **facts)
