import fcntl
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from engine.file.file_access import FileAccess


class FileLock:
    """An exclusive lock on a lock file, held by one writer at a time across threads and processes."""

    @staticmethod
    @contextmanager
    def locked(path: Path) -> Generator[None]:
        with FileAccess.writer(path, "a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock, fcntl.LOCK_UN)
