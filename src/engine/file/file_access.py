import io
import os
import sys
import tempfile
from collections import OrderedDict
from collections.abc import Generator
from contextlib import contextmanager
from functools import cache
from pathlib import Path
from threading import RLock
from typing import IO, Any
from weakref import WeakValueDictionary

from engine.file.file_contents import FileContents
from engine.file.file_version import FileVersion
from engine.file.file_changes import FileChanges

FILE_READ_EVENT = "journal.file.read"
FILE_CHANGE_EVENT = "journal.file.write"
CACHE_SIZE_FILES = 256


class FileAccess:
    """Reads and writes files, retaining unchanged contents and invalidating each file when written."""

    def __init__(self) -> None:
        self.contents: OrderedDict[Path, FileContents] = OrderedDict()
        self.versions: WeakValueDictionary[Path, FileChanges] = WeakValueDictionary()
        self.lock = RLock()

    @staticmethod
    @cache
    def shared() -> "FileAccess":
        return FileAccess()

    def read(self, file: Path | str, encoding: str | None = None, errors: str | None = None, newline: str | None = None) -> str:
        with io.TextIOWrapper(io.BytesIO(self.binary(file)), encoding=encoding, errors=errors, newline=newline) as text:
            return text.read()

    def bytes_range(self, file: Path | str, start: int, length: int) -> bytes:
        path = Path(file).resolve()
        sys.audit(FILE_READ_EVENT, str(path))
        with path.open("rb") as opened:
            opened.seek(start)
            return opened.read(length)

    def binary(self, file: Path | str) -> bytes:
        path = Path(file).resolve()
        sys.audit(FILE_READ_EVENT, str(path))
        with self.lock:
            version = self.version(path)
            kept = self.contents.get(path)
            if kept is not None and kept.version == version:
                self.contents.move_to_end(path)
                return kept.data
            data = path.read_bytes()
            self.contents[path] = FileContents(version, data)
            self.contents.move_to_end(path)
            if len(self.contents) > CACHE_SIZE_FILES:
                self.contents.popitem(last=False)
            return data

    def version(self, file: Path | str) -> FileVersion:
        path = Path(file).resolve()
        with self.lock:
            status = path.stat()
            changes = self.versions.get(path)
            if changes is None:
                changes = FileChanges()
                self.versions[path] = changes
            return FileVersion(status.st_mtime_ns, status.st_size, status.st_ino, changes.count, changes)

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

    @contextmanager
    def descriptor_writer(self, file: Path | str, flags: int, permissions: int) -> Generator[int]:
        path = Path(file).resolve()
        with self.lock:
            self.invalidate(path)
        descriptor = os.open(path, flags, permissions)
        try:
            yield descriptor
        finally:
            with self.lock:
                self.invalidate(path)
            os.close(descriptor)

    @contextmanager
    def private_writer(self, file: Path | str) -> Generator[IO[str]]:
        with self.descriptor_writer(file, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600) as descriptor:
            with os.fdopen(descriptor, "w", closefd=False) as output:
                yield output

    @contextmanager
    def temporary_writer(self, folder: Path, mode: str = "w", suffix: str = "") -> Generator[IO[Any]]:
        with tempfile.NamedTemporaryFile(mode=mode, suffix=suffix, dir=folder, delete=False) as output:
            path = Path(output.name)
            self.invalidate(path)
            try:
                yield output
            finally:
                self.invalidate(path)
                path.unlink(missing_ok=True)

    def replace(self, source: Path | str, target: Path | str) -> Path:
        source_path, target_path = Path(source), Path(target)
        with self.lock:
            self.invalidate(source_path.parent.resolve() / source_path.name)
            self.invalidate(target_path.parent.resolve() / target_path.name)
            return source_path.replace(target_path)

    def invalidate(self, path: Path) -> None:
        changes = self.versions.get(path)
        if changes is not None:
            changes.count += 1
        self.contents.pop(path, None)
        sys.audit(FILE_CHANGE_EVENT, str(path))
