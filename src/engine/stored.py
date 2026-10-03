import fcntl
import json
import os
import threading
import time
from contextlib import contextmanager
from contextvars import ContextVar
from pathlib import Path
from typing import Any, Callable, TypeVar

UNDO = threading.local()
MIGRATIONS = ContextVar("migrations", default=())
MIGRATION_LOCK = ".migrations.lock"
LOCK_WAIT = 30.0
RUNTIME = "runtime"
T = TypeVar("T")


def read_json(path: Path, into: Callable[[Any], T], default: T) -> T:
    try:
        return into(json.loads(Path(path).read_text()))
    except (OSError, ValueError, TypeError, KeyError, AttributeError):
        return default


@contextmanager
def undoable():
    if getattr(UNDO, "saved", None) is not None:
        yield UNDO
        return
    UNDO.saved, UNDO.events = {}, []
    try:
        yield UNDO
    except BaseException:
        for path, before in UNDO.saved.items():
            if before is None:
                Path(path).unlink(missing_ok=True)
            else:
                replace(Path(path), before)
        UNDO.saved, UNDO.events = None, None
        raise
    events, UNDO.saved, UNDO.events = UNDO.events, None, None
    for release in events:
        release()


@contextmanager
def apart():
    held = getattr(UNDO, "saved", None), getattr(UNDO, "events", None)
    UNDO.saved, UNDO.events = None, None
    try:
        yield
    finally:
        UNDO.saved, UNDO.events = held


def held_back(release) -> bool:
    events = getattr(UNDO, "events", None)
    if events is None:
        return False
    events.append(release)
    return True


def journal_roots(path: Path) -> tuple[Path, ...]:
    return tuple(parent for parent in path.parents if parent.name == ".journal")


SHARED: dict[Path, tuple] = {}
SHARING = threading.Lock()


def shared_lock(root: Path) -> tuple:
    with SHARING:
        if root not in SHARED:
            root.mkdir(parents=True, exist_ok=True)
            SHARED[root] = ((root / MIGRATION_LOCK).open("a"), threading.Lock())
        return SHARED[root]


def waited(held, operation: int) -> None:
    deadline = time.monotonic() + LOCK_WAIT
    while True:
        try:
            fcntl.flock(held, operation | fcntl.LOCK_NB)
            return
        except BlockingIOError as error:
            if time.monotonic() >= deadline:
                raise TimeoutError(held.name) from error
            time.sleep(0.05)


@contextmanager
def hold_record_writes(root: Path):
    root = Path(root)
    root.mkdir(parents=True, exist_ok=True)
    with (root / MIGRATION_LOCK).open("a") as held:
        waited(held, fcntl.LOCK_EX)
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
    held, guard = shared_lock(roots[0])
    with guard:
        waited(held, fcntl.LOCK_SH)
        try:
            yield
        finally:
            fcntl.flock(held, fcntl.LOCK_UN)


def write_text(path: Path, text: str) -> None:
    path = Path(path)
    with writing(path):
        write_unlocked(path, text)


def append_text(path: Path, text: str) -> None:
    path = Path(path)
    with writing(path), path.open("a") as appended:
        appended.write(text)


def write_unlocked(path: Path, text: str) -> None:
    saved = getattr(UNDO, "saved", None)
    if saved is not None and str(path) not in saved:
        saved[str(path)] = path.read_bytes() if path.is_file() else None
    replace(path, text.encode())


def replace(path: Path, raw: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    spare = path.with_name(f".{path.name}.{os.getpid()}.{threading.get_ident()}")
    spare.write_bytes(raw)
    os.replace(spare, path)


def write_json(path: Path, data, indent: int | None = None) -> None:
    write_text(path, json.dumps(data, indent=indent))


def tail(path, size: int) -> list[str]:
    try:
        with Path(path).open("rb") as source:
            source.seek(0, 2)
            end = source.tell()
            start = max(0, end - size)
            source.seek(start)
            raw = source.read()
    except (OSError, TypeError):
        return []
    if start:
        raw = raw.split(b"\n", 1)[-1]
    return raw.decode(errors="replace").splitlines()


LOG_BYTES = 262144


def last_lines(path, lines: int) -> str:
    return "\n".join(tail(path, LOG_BYTES)[-lines:])
