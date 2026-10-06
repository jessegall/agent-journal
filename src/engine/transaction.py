import threading
from contextlib import contextmanager
from pathlib import Path

from engine.disk import replace


class Work(threading.local):
    def __init__(self):
        self.undo_snapshots: dict | None = None
        self.undo_releases: list | None = None
        self.bus_queue: list | None = None
        self.bus_after: dict | None = None


WORK = Work()


@contextmanager
def undoable():
    if WORK.undo_snapshots is not None:
        yield
        return
    WORK.undo_snapshots, WORK.undo_releases = {}, []
    try:
        yield
    except BaseException:
        for path, before in WORK.undo_snapshots.items():
            if before is None:
                Path(path).unlink(missing_ok=True)
            else:
                replace(Path(path), before)
        WORK.undo_snapshots, WORK.undo_releases = None, None
        raise
    events, WORK.undo_snapshots, WORK.undo_releases = WORK.undo_releases, None, None
    for release in events:
        release()


@contextmanager
def apart():
    held = WORK.undo_snapshots, WORK.undo_releases
    WORK.undo_snapshots, WORK.undo_releases = None, None
    try:
        yield
    finally:
        WORK.undo_snapshots, WORK.undo_releases = held


def held_back(release) -> bool:
    if WORK.undo_releases is None:
        return False
    WORK.undo_releases.append(release)
    return True


def snapshot(path: Path) -> None:
    if WORK.undo_snapshots is not None and str(path) not in WORK.undo_snapshots:
        WORK.undo_snapshots[str(path)] = path.read_bytes() if path.is_file() else None
