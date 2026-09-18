import fcntl
import json
import time
from contextlib import contextmanager
from dataclasses import asdict
from pathlib import Path

from engine import bus
from resources.base import ACTIONS, ACTORS, PROJECT, Event


class Record:
    def __init__(self, root: Path, env: str):
        self.root = Path(root)
        self.env = env
        self.home = self.root / "environments" / env
        self.home.mkdir(parents=True, exist_ok=True)
        self._held = 0

    def folder(self, type: str, scope: str = "") -> Path:
        f = (self.root if scope == PROJECT else self.home) / type
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

    def emit(self, type: str, n: int, action: str, actor: str, **data) -> Event:
        if action not in ACTIONS or actor not in ACTORS:
            raise ValueError(f"not an event: {action} by {actor}")
        log = self.home / "events.jsonl"
        with self.locked():
            e = Event(id=self.last_event() + 1, at=time.time(), type=type, n=n, action=action, actor=actor, data=data)
            with log.open("a") as fh:
                fh.write(json.dumps(asdict(e)) + "\n")
        bus.emit(e, self)
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

    def cursor_text(self, name: str) -> str:
        f = self.root / "runtime" / f"cursor-{name}"
        try:
            return f.read_text().strip()
        except OSError:
            return ""

    def set_cursor_text(self, name: str, text: str) -> None:
        f = self.root / "runtime" / f"cursor-{name}"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(text)

    def cursor(self, name: str) -> int:
        try:
            return int(self.cursor_text(name) or 0)
        except ValueError:
            return 0

    def set_cursor(self, name: str, n: int) -> None:
        self.set_cursor_text(name, str(n))

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
