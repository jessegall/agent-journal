import threading
import time
import traceback
from contextlib import contextmanager
from pathlib import Path

class Spent(threading.local):
    def __init__(self):
        self.waits: dict[str, float] = {}


_spent = Spent()


def totals() -> dict[str, float]:
    return _spent.waits


def total() -> float:
    return sum(totals().values())


@contextmanager
def waited(name: str):
    began = time.perf_counter()
    try:
        yield
    finally:
        spent = totals()
        spent[name] = spent.get(name, 0.0) + (time.perf_counter() - began) * 1000


class Lock:
    def __init__(self, name: str, lock=None):
        self.name = name
        self.lock = lock or threading.Lock()

    def __enter__(self) -> "Lock":
        with waited(self.name):
            self.lock.acquire()
        return self

    def __exit__(self, *raised) -> None:
        self.lock.release()


HELD_LONG = 0.25
HELD_LOG = "lock-holds.log"
NOTES: list[tuple[Path, str]] = []


@contextmanager
def holding(name: str, folder: Path):
    """Notes in the runtime folder where a lock was held longer than a quarter second, with the stack that held it, so the work that makes others wait is found."""
    began = time.monotonic()
    try:
        yield
    finally:
        took = time.monotonic() - began
        if took >= HELD_LONG:
            frames = traceback.StackSummary.extract(traceback.walk_stack(None), limit=14, lookup_lines=False)
            where = "".join(f"  {frame.filename}:{frame.lineno} in {frame.name}\n" for frame in frames)
            NOTES.append((folder, f"{time.strftime('%H:%M:%S')} {name} held {took * 1000:.0f}ms by\n{where}\n"))


def write_holds() -> None:
    """Writes the notes of long lock holds to their log; the server's background loop calls it, so no request opens a file for it."""
    while NOTES:
        folder, note = NOTES.pop(0)
        try:
            with (folder / HELD_LOG).open("a") as log:
                log.write(note)
        except OSError:
            continue
