import fcntl
import threading
import time
from contextlib import contextmanager
from contextvars import ContextVar
from pathlib import Path
from typing import IO

from engine import waits

MIGRATIONS = ContextVar("migrations", default=())
MIGRATION_LOCK = ".migrations.lock"
LOCK_WAIT = 30.0
RUNTIME = "runtime"


def journal_roots(path: Path) -> tuple[Path, ...]:
    return tuple(parent for parent in path.parents if parent.name == ".journal")


class SharedWrites:
    def __init__(self, held: IO):
        self.held = held
        self.guard = waits.Lock("writes")
        self.writers = 0

    @contextmanager
    def joined(self):
        with self.guard:
            if not self.writers:
                with waits.waited("writes"):
                    acquire(self.held, fcntl.LOCK_SH)
            self.writers += 1
        try:
            yield
        finally:
            with self.guard:
                self.writers -= 1
                if not self.writers:
                    fcntl.flock(self.held, fcntl.LOCK_UN)


SHARED: dict[Path, SharedWrites] = {}
SHARING = threading.Lock()


def close_all() -> None:
    with SHARING:
        for writes in SHARED.values():
            writes.held.close()
        SHARED.clear()


def shared_writes(root: Path) -> SharedWrites:
    with SHARING:
        if root not in SHARED:
            root.mkdir(parents=True, exist_ok=True)
            SHARED[root] = SharedWrites((root / MIGRATION_LOCK).open("a"))
        return SHARED[root]


def acquire(held, operation: int) -> None:
    deadline = time.monotonic() + LOCK_WAIT
    while True:
        try:
            fcntl.flock(held, operation | fcntl.LOCK_NB)
            return
        except BlockingIOError as error:
            if time.monotonic() >= deadline:
                raise TimeoutError(held.name) from error
            time.sleep(0.05)


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
def hold_record_writes(root: Path):
    root = Path(root)
    root.mkdir(parents=True, exist_ok=True)
    with (root / MIGRATION_LOCK).open("a") as held:
        acquire(held, fcntl.LOCK_EX)
        token = MIGRATIONS.set((*MIGRATIONS.get(), root))
        try:
            yield
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
