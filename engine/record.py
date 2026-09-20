import fcntl
import json
import os
import threading
import time
from contextlib import contextmanager
from dataclasses import asdict
from pathlib import Path

from engine import bus
from resources.base import ACTIONS, ACTORS, PROJECT, Event
from engine.stored import read_json, write_json


class Setting:
    def __init__(self, default=None):
        self.default = default

    def __set_name__(self, owner, name: str) -> None:
        self.name = name

    def __get__(self, obj, owner=None):
        if obj is None:
            return self.name
        got = obj.setting(self.name)
        return (self.default() if callable(self.default) else self.default) if got is None else got

    def __set__(self, obj, value) -> None:
        obj.set_setting(self.name, value)


class Record:
    features = Setting(dict)
    triggers = Setting(dict)
    keep = Setting(dict)
    batch = Setting(dict)
    inbox = Setting(dict)
    status = Setting(dict)
    agents = Setting(dict)
    skills = Setting(list)
    answers = Setting(dict)
    cleanup_read_at = Setting(0)
    SETTINGS = ("features", "triggers", "keep", "batch", "inbox", "status", "agents", "skills", "answers")

    def __init__(self, root: Path, env: str, memo: bool = False):
        self.root = Path(root)
        self.env = env
        self.home = self.root / "environments" / env
        self.home.mkdir(parents=True, exist_ok=True)
        self._held = 0
        self._threads = threading.RLock()
        self.memo = {} if memo else None

    def folder(self, type: str, scope: str = "") -> Path:
        f = (self.root if scope == PROJECT else self.home) / type
        f.mkdir(exist_ok=True)
        return f

    @contextmanager
    def locked(self):
        with self._threads:
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
            e = Event(id=self.last_event() + 1, at=time.time(), type=type, n=n, action=action, actor=actor, data=data, pid=os.getpid(), heard=bus.listening())
            with log.open("a") as fh:
                fh.write(json.dumps(asdict(e)) + "\n")
        if self.memo is not None:
            self.memo.clear()
        bus.emit(e, self)
        return e

    def events(self, since: int = 0, last: int = 0) -> list[Event]:
        out = []
        for raw in self.lines_back():
            try:
                e = Event(**json.loads(raw))
            except (ValueError, TypeError):
                continue
            if e.id <= since or (last and len(out) == last):
                break
            out.append(e)
        return out[::-1]

    def lines_back(self, block: int = 65536):
        log = self.home / "events.jsonl"
        if not log.is_file():
            return
        with log.open("rb") as fh:
            fh.seek(0, 2)
            at, rest = fh.tell(), b""
            while at > 0:
                step = min(block, at)
                at -= step
                fh.seek(at)
                lines = (fh.read(step) + rest).split(b"\n")
                rest = lines.pop(0)
                yield from (line for line in reversed(lines) if line.strip())
            if rest.strip():
                yield rest

    def last_event(self) -> int:
        got = self.events(last=1)
        return got[-1].id if got else 0

    def cursor_text(self, name: str) -> str:
        f = self.home / "runtime" / f"cursor-{name}"
        try:
            return f.read_text().strip()
        except OSError:
            return ""

    def set_cursor_text(self, name: str, text: str) -> None:
        f = self.home / "runtime" / f"cursor-{name}"
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
        return read_json(self.home / "settings.json", {}).get(key, default)

    def set_setting(self, key: str, value) -> None:
        f = self.home / "settings.json"
        with self.locked():
            write_json(f, {**read_json(f, {}), key: value}, indent=2)
