import io
import sys
from collections import OrderedDict
from collections.abc import Generator
from contextlib import contextmanager
from functools import cache
from pathlib import Path
from threading import RLock
from typing import IO, Any

from core.base.file_contents import FileContents

FILE_READ_EVENT = "journal.file.read"
FILE_CHANGE_EVENT = "journal.file.write"
CACHE_SIZE_FILES = 256


class FileAccess:
    """Reads and writes files, retaining unchanged contents and invalidating each file when written."""

    def __init__(self) -> None:
        self.contents: OrderedDict[Path, FileContents] = OrderedDict()
        self.lock = RLock()

    @staticmethod
    @cache
    def shared() -> "FileAccess":
        return FileAccess()

    def read(self, file: Path | str, encoding: str | None = None, errors: str | None = None, newline: str | None = None) -> str:
        with io.TextIOWrapper(io.BytesIO(self.binary(file)), encoding=encoding, errors=errors, newline=newline) as text:
            return text.read()

    def binary(self, file: Path | str) -> bytes:
        path = Path(file).resolve()
        sys.audit(FILE_READ_EVENT, str(path))
        with self.lock:
            status = path.stat()
            kept = self.contents.get(path)
            if kept is not None and kept.matches(status):
                self.contents.move_to_end(path)
                return kept.data
            data = path.read_bytes()
            self.contents[path] = FileContents(status.st_mtime_ns, status.st_size, status.st_ino, data)
            if len(self.contents) > CACHE_SIZE_FILES:
                self.contents.popitem(last=False)
            return data

    def write(self, file: Path | str, text: str, encoding: str | None = None, errors: str | None = None, newline: str | None = None) -> int:
        path = Path(file).resolve()
        with self.lock:
            self.invalidate(path)
            return path.write_text(text, encoding=encoding, errors=errors, newline=newline)

    def write_binary(self, file: Path | str, data: bytes) -> int:
        path = Path(file).resolve()
        with self.lock:
            self.invalidate(path)
            return path.write_bytes(data)

    def update_timestamp(self, file: Path | str, mode: int = 0o666, allow_existing: bool = True) -> None:
        path = Path(file).resolve()
        with self.lock:
            self.invalidate(path)
            path.touch(mode=mode, exist_ok=allow_existing)

    @contextmanager
    def writer(self, file: Path | str, mode: str = "w", encoding: str | None = None, errors: str | None = None,
               newline: str | None = None) -> Generator[IO[Any]]:
        path = Path(file).resolve()
        with self.lock:
            self.invalidate(path)
        try:
            with path.open(mode, encoding=encoding, errors=errors, newline=newline) as opened:
                yield opened
        finally:
            with self.lock:
                self.invalidate(path)

    def invalidate(self, path: Path) -> None:
        self.contents.pop(path, None)
        sys.audit(FILE_CHANGE_EVENT, str(path))
