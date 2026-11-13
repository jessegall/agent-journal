import fcntl
from collections.abc import Generator
from contextlib import contextmanager

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome

MERGE_LOCK_FILE = "merge-runs.lock"


class MergeRunLock:
    """The one place a merge run takes: a lock on a file of the journal, held while the run goes, so two merges never
    run at once, whichever journal process starts them."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.folder / "runtime" / MERGE_LOCK_FILE

    @contextmanager
    def locked(self) -> Generator[None]:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with FileAccess.shared().writer(self.path, "a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock, fcntl.LOCK_UN)
