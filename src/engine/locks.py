import fcntl
import os
import threading
import time
from contextlib import contextmanager
from contextvars import ContextVar
from pathlib import Path
from typing import IO, Callable

from engine import waits

MIGRATIONS = ContextVar("migrations", default=())
MIGRATION_LOCK = ".migrations.lock"
LOCK_WAIT = 30.0
RETRY = 0.05
RUNTIME = "runtime"


class MigrationsRunning(TimeoutError):
    """An upgrade is migrating the record, so a write waited for its lock and gave up; the write is tried again once the upgrade ends."""


class RepositoryBusy(TimeoutError):
    """A write waited for the lock of its repository and gave up: another write has held it too long."""

    @classmethod
    def of(cls, path: Path) -> "RepositoryBusy":
        return cls(f"the repository {path.parent.name} stayed locked by another write for {LOCK_WAIT:g} seconds; this write gave up and can be tried again")


class WriteInProgress:
    def __init__(self) -> None:
        self.thread = threading.get_ident()
        self.done = threading.Event()


WRITING: dict[str, WriteInProgress] = {}
HOLDING = threading.local()
READ_WAIT = 2.0


@contextmanager
def writing_to(key: str):
    """Marks the repository whose lock is held as being written, until the write ends."""
    gate = WriteInProgress()
    WRITING[key] = gate
    HOLDING.depth = getattr(HOLDING, "depth", 0) + 1
    try:
        yield
    finally:
        HOLDING.depth -= 1
        WRITING.pop(key, None)
        gate.done.set()


def after_writes(key: str) -> None:
    """Lets a read that comes during another thread's write to the repository wait until that write has finished; a read takes no lock and waits for no other read, and with no write under way it costs one look at an empty table. A thread that holds a repository lock of its own does not wait: the write it would wait for may be waiting for that very lock."""
    gate = WRITING.get(key)
    if gate is not None and gate.thread != threading.get_ident() and not getattr(HOLDING, "depth", 0):
        gate.done.wait(READ_WAIT)


def journal_roots(path: Path) -> tuple[Path, ...]:
    return tuple(parent for parent in path.parents if parent.name == ".journal")


class SharedWrites:
    def __init__(self, held: IO):
        self.held = held
        self.guard = waits.Lock("writes")
        self.writers = 0

    @contextmanager
    def joined(self):
        with waits.waited("writes"):
            wait_for(self.joined_now, self.held.name)
        try:
            yield
        finally:
            with self.guard:
                self.writers -= 1
                if not self.writers:
                    fcntl.flock(self.held, fcntl.LOCK_UN)

    def joined_now(self) -> bool:
        with self.guard:
            if not self.writers and not taken(self.held, fcntl.LOCK_SH):
                return False
            self.writers += 1
            return True


SHARED: dict[Path, SharedWrites] = {}
SHARING = threading.Lock()


def close_all() -> None:
    with SHARING:
        for writes in SHARED.values():
            writes.held.close()
        SHARED.clear()
    with LOCKING:
        for kept in LOCK_FILES.values():
            kept.file.close()
        LOCK_FILES.clear()


def shared_writes(root: Path) -> SharedWrites:
    with SHARING:
        if root not in SHARED:
            root.mkdir(parents=True, exist_ok=True)
            SHARED[root] = SharedWrites((root / MIGRATION_LOCK).open("a"))
        return SHARED[root]


def taken(held, operation: int) -> bool:
    try:
        fcntl.flock(held, operation | fcntl.LOCK_NB)
    except BlockingIOError:
        return False
    return True


def acquire(held, operation: int) -> None:
    wait_for(lambda: taken(held, operation), held.name)


def wait_for(taking: Callable[[], bool], name: str, giving_up: Callable[[str], Exception] = MigrationsRunning) -> None:
    deadline = time.monotonic() + LOCK_WAIT
    while not taking():
        if time.monotonic() >= deadline:
            raise giving_up(name)
        time.sleep(RETRY)


def claim(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    held = path.open("a")
    try:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        held.close()
        return None
    return held


@contextmanager
def project_sweep(path: Path, every: float, owner: str = ""):
    """Says True to whoever runs a sweep the whole project shares and False to the others, so each environment's engine ticks and the project is looked after once: with an owner named, that owner sweeps whenever it asks and only another's sweep within `every` seconds holds it back; with none, any sweep within `every` seconds does."""
    held = claim(path)
    if held is None:
        yield False
        return
    try:
        stamp = path.with_suffix(".swept")
        if stamp.is_file() and time.time() - stamp.stat().st_mtime < every and (not owner or stamp.read_text() != owner):
            yield False
            return
        yield True
        stamp.write_text(owner)
    finally:
        held.close()


@contextmanager
def hold_record_writes(root: Path, waiting: bool = True):
    """Holds every record write back while it runs and says whether it got the hold: a caller that must not wait gets False at once when another process holds it."""
    root = Path(root)
    root.mkdir(parents=True, exist_ok=True)
    with (root / MIGRATION_LOCK).open("a") as held:
        if waiting:
            acquire(held, fcntl.LOCK_EX)
        elif not taken(held, fcntl.LOCK_EX):
            yield False
            return
        token = MIGRATIONS.set((*MIGRATIONS.get(), root))
        try:
            yield True
        finally:
            MIGRATIONS.reset(token)
            fcntl.flock(held, fcntl.LOCK_UN)


def guarded(path: Path, roots: tuple[Path, ...]) -> bool:
    return bool(roots) and roots[0] not in MIGRATIONS.get() and path.relative_to(roots[0]).parts[0] != RUNTIME


@contextmanager
def writing(path: Path):
    roots = journal_roots(path)
    if not guarded(path, roots):
        yield
        return
    with shared_writes(roots[0]).joined():
        yield


class LockFile:
    """A lock file kept open between uses, with a lock of its own for the threads of this process: two threads share one open file, so the file lock alone would let both in."""

    def __init__(self, path: Path):
        self.path = path
        self.threads = threading.Lock()
        self.file = self.opened()

    def opened(self) -> IO:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        return self.path.open("a+")

    def current(self) -> IO:
        """The open file, opened again when the file at the path is no longer the one held, as after it was removed and made anew."""
        try:
            same = os.stat(self.path).st_ino == os.fstat(self.file.fileno()).st_ino
        except OSError:
            same = False
        if not same:
            self.file.close()
            self.file = self.opened()
        return self.file


LOCK_FILES: dict[Path, LockFile] = {}
LOCKING = threading.Lock()


def lock_file(path: Path) -> LockFile:
    with LOCKING:
        if path not in LOCK_FILES:
            LOCK_FILES[path] = LockFile(path)
        return LOCK_FILES[path]


@contextmanager
def held_file(path: Path):
    kept = lock_file(path)
    with kept.threads:
        held = kept.current()
        acquire(held, fcntl.LOCK_EX)
        try:
            yield held
        finally:
            fcntl.flock(held, fcntl.LOCK_UN)
