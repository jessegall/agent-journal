import json
import os
import threading
from pathlib import Path
from typing import Any, Callable, TypeVar

from engine.memo import Memo

T = TypeVar("T")
LOG_BYTES = 262144


class Growth:
    def __init__(self):
        self.size = -1

    def grew(self, path: Path) -> bool:
        try:
            size = path.stat().st_size
        except OSError:
            return False
        if size == self.size:
            return False
        self.size = size
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


def replace(path: Path, raw: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    spare = path.with_name(f".{path.name}.{os.getpid()}.{threading.get_ident()}")
    spare.write_bytes(raw)
    os.replace(spare, path)


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
