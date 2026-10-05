import threading
from contextlib import contextmanager
from pathlib import Path

from engine.disk import replace


class Work(threading.local):
    def __init__(self):
        self.saved: dict | None = None
        self.events: list | None = None
        self.queue: list | None = None
        self.after: dict | None = None


WORK = Work()


@contextmanager
def undoable():
    if WORK.saved is not None:
        yield WORK
        return
    WORK.saved, WORK.events = {}, []
    try:
        yield WORK
    except BaseException:
        for path, before in WORK.saved.items():
            if before is None:
                Path(path).unlink(missing_ok=True)
            else:
                replace(Path(path), before)
        WORK.saved, WORK.events = None, None
        raise
    events, WORK.saved, WORK.events = WORK.events, None, None
    for release in events:
        release()


@contextmanager
def apart():
    held = WORK.saved, WORK.events
    WORK.saved, WORK.events = None, None
    try:
        yield
    finally:
        WORK.saved, WORK.events = held


def held_back(release) -> bool:
    if WORK.events is None:
        return False
    WORK.events.append(release)
    return True


def snapshot(path: Path) -> None:
    if WORK.saved is not None and str(path) not in WORK.saved:
        WORK.saved[str(path)] = path.read_bytes() if path.is_file() else None
