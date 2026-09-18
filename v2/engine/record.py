import fcntl
import json
import time
from contextlib import contextmanager
from dataclasses import asdict
from pathlib import Path

from v2.resources.base import DISPATCHERS, VERBS, Event


class Record:
    def __init__(self, root: Path, env: str):
        self.root = Path(root)
        self.env = env
        self.home = self.root / "environments" / env
        self.home.mkdir(parents=True, exist_ok=True)
        self._held = 0

    def folder(self, type: str) -> Path:
        f = self.home / type
        f.mkdir(exist_ok=True)
        return f

    @contextmanager
    def locked(self):
        if self._held:
            self._held += 1
            try:
                yield
            finally:
                self._held -= 1
            return
        with (self.home / ".lock").open("a+") as fh:
            fcntl.flock(fh, fcntl.LOCK_EX)
            self._held = 1
            try:
                yield
            finally:
                self._held = 0
                fcntl.flock(fh, fcntl.LOCK_UN)

    def emit(self, type: str, n: int, verb: str, dispatcher: str, **data) -> Event:
        if verb not in VERBS or dispatcher not in DISPATCHERS:
            raise ValueError(f"not an event: {verb} by {dispatcher}")
        log = self.home / "events.jsonl"
        with self.locked():
            e = Event(id=self.last_event() + 1, at=time.time(), type=type, n=n, verb=verb, dispatcher=dispatcher, data=data)
            with log.open("a") as fh:
                fh.write(json.dumps(asdict(e)) + "\n")
        return e

    def events(self, since: int = 0) -> list[Event]:
        log = self.home / "events.jsonl"
        if not log.is_file():
            return []
        out = []
        for raw in log.read_text().splitlines():
            try:
                e = Event(**json.loads(raw))
            except (ValueError, TypeError):
                continue
            if e.id > since:
                out.append(e)
        return out

    def last_event(self) -> int:
        got = self.events()
        return got[-1].id if got else 0

    def cursor(self, name: str) -> int:
        f = self.root / "runtime" / f"cursor-{name}"
        try:
            return int(f.read_text().strip() or 0)
        except (OSError, ValueError):
            return 0

    def set_cursor(self, name: str, n: int) -> None:
        f = self.root / "runtime" / f"cursor-{name}"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(str(n))

    def setting(self, key: str, default=None):
        f = self.home / "settings.json"
        try:
            return json.loads(f.read_text()).get(key, default)
        except (OSError, ValueError):
            return default

    def set_setting(self, key: str, value) -> None:
        f = self.home / "settings.json"
        try:
            got = json.loads(f.read_text())
        except (OSError, ValueError):
            got = {}
        got[key] = value
        f.write_text(json.dumps(got, indent=2))
