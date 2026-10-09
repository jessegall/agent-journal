import errno
import json
import os
import shutil
import threading
from pathlib import Path
from typing import Any, Callable, TypeVar

from engine.memo import Memo

T = TypeVar("T")
LOG_BYTES = 262144
KEPT_FREE_BYTES = 64 * 1024 * 1024
OUT_OF_ROOM = (errno.ENOSPC, errno.EDQUOT)


class DiskFull(OSError):
    @classmethod
    def writing(cls, name: str, cause: OSError) -> "DiskFull":
        return cls(f"the server could not save {name}: {cause.strerror or cause}")

    @classmethod
    def keeping(cls, name: str, free: int) -> "DiskFull":
        return cls(f"{nearly_full(free)}, so {name} was not saved")


def nearly_full(free: int) -> str:
    return f"the server's disk is nearly full ({free // (1024 * 1024)} MB free)"


def free_bytes(folder: Path) -> int:
    return shutil.disk_usage(folder).free


class Growth:
    def __init__(self):
        self.size = -1
        self.stamp: tuple = ()

    def grew(self, path: Path, stamp: tuple = ()) -> bool:
        """Whether the file is a different size than last asked, or the stamp of what goes with it changed."""
        try:
            size = path.stat().st_size
        except OSError:
            return False
        if (size, stamp) == (self.size, self.stamp):
            return False
        self.size, self.stamp = size, stamp
        return True


class JsonFiles:
    def __init__(self):
        self.held = Memo()

    def read(self, path: Path, into: Callable[[Any], T], default: T) -> T:
        try:
            found = path.stat()
        except OSError:
            return default
        return self.held.get(path, (found.st_mtime_ns, found.st_size), lambda: read_json(path, into, default))


def read_json(path: Path, into: Callable[[Any], T], default: T) -> T:
    try:
        return into(json.loads(Path(path).read_text()))
    except (OSError, ValueError, TypeError, KeyError, AttributeError):
        return default


def replace(path: Path, raw: bytes, mode: int = 0o666) -> None:
    """Writes the whole file or nothing, and refuses with DiskFull once the disk is down to its kept free space."""
    path.parent.mkdir(parents=True, exist_ok=True)
    free = free_bytes(path.parent)
    if free - len(raw) < KEPT_FREE_BYTES:
        raise DiskFull.keeping(path.name, free)
    restore(path, raw, mode)


def restore(path: Path, raw: bytes, mode: int = 0o666) -> None:
    """Writes the whole file or nothing, even into the kept free space: it puts back what an undone change took."""
    path.parent.mkdir(parents=True, exist_ok=True)
    spare = path.with_name(f".{path.name}.{os.getpid()}.{threading.get_ident()}")
    try:
        with os.fdopen(os.open(spare, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, mode), "wb") as written:
            written.write(raw)
        os.replace(spare, path)
    except OSError as cause:
        spare.unlink(missing_ok=True)
        if cause.errno in OUT_OF_ROOM:
            raise DiskFull.writing(path.name, cause) from cause
        raise


def append(path: Path, text: str, mode: int = 0o666) -> None:
    """Adds the text to the end of the file, and refuses with DiskFull only when the disk has no room left."""
    try:
        with os.fdopen(os.open(path, os.O_WRONLY | os.O_CREAT | os.O_APPEND, mode), "a") as kept:
            kept.write(text)
    except OSError as cause:
        if cause.errno in OUT_OF_ROOM:
            raise DiskFull.writing(path.name, cause) from cause
        raise


def last_lines(path, lines: int) -> str:
    try:
        with Path(path).open("rb") as source:
            start = max(0, source.seek(0, 2) - LOG_BYTES)
            source.seek(start)
            raw = source.read()
    except (OSError, TypeError):
        return ""
    if start:
        raw = raw.split(b"\n", 1)[-1]
    return "\n".join(raw.decode(errors="replace").splitlines()[-lines:])
