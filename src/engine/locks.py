import fcntl
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


def wait_for(taking: Callable[[], bool], name: str) -> None:
    deadline = time.monotonic() + LOCK_WAIT
    while not taking():
        if time.monotonic() >= deadline:
            raise TimeoutError(name)
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


@contextmanager
def held_file(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as held:
        acquire(held, fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(held, fcntl.LOCK_UN)
