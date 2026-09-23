import fcntl
from contextlib import contextmanager
from pathlib import Path

from engine.stored import read_json, write_json


class State:
    def __init__(self, path: Path):
        self.path = Path(path)

    def all(self) -> dict:
        found = read_json(self.path, {})
        return found if isinstance(found, dict) else {}

    def get(self, key: str, default=None):
        return self.all().get(key, default)

    def set(self, key: str, value) -> None:
        self.update({key: value})

    def update(self, values: dict) -> None:
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

    @contextmanager
    def changing(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.with_suffix(".lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            before = self.all()
            held = dict(before)
            yield held
            if held != before:
                write_json(self.path, held)
