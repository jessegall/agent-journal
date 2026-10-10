import fcntl
import os
from contextlib import contextmanager
from pathlib import Path

from engine.memo import Memo
from engine.stored import read_json, write_json

FILES = Memo()


class State:
    """A small JSON file of state; every State of one path shares its contents, read again only when the file's stamp changes, and a change reads it fresh under its lock."""

    def __init__(self, path: Path):
        self.path = Path(path)

    def stamp(self) -> tuple[int, int]:
        try:
            found = os.stat(self.path)
        except OSError:
            return (0, 0)
        return (found.st_mtime_ns, found.st_size)

    def all(self) -> dict:
        return FILES.get(str(self.path), self.stamp(), self.fresh)

    def fresh(self) -> dict:
        found = read_json(self.path, dict, {})
        return found if isinstance(found, dict) else {}

    def get(self, key: str, default=None):
        return self.all().get(key, default)

    def set(self, key: str, value) -> None:
        self.update({key: value})

    def update(self, values: dict) -> None:
        if all(self.all().get(key) == value for key, value in values.items()):
            return
        with self.changing() as held:
            held.update(values)

    def remove(self, key: str) -> None:
        with self.changing() as held:
            held.pop(key, None)

    def claim(self, key: str, value, keep: int = 0) -> bool:
        with self.changing() as held:
            if key in held:
                return False
            held[key] = value
            if keep:
                for oldest in sorted(held, key=lambda name: float(held[name]))[:max(0, len(held) - keep)]:
                    del held[oldest]
            return True

    def clear(self) -> None:
        self.path.unlink(missing_ok=True)
        FILES.forget(str(self.path))

    @contextmanager
    def changing(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.with_suffix(".lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            before = self.fresh()
            held = dict(before)
            yield held
            if held != before:
                write_json(self.path, held)
            FILES.put(str(self.path), self.stamp(), held)
