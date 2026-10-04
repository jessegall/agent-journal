import fcntl
import os
import threading
import time
from contextlib import contextmanager
from functools import partial
from pathlib import Path
from typing import Callable

from engine import bus, runtime, waits
from engine.event_log import EventLog
from engine.settings_file import SettingsFile
from resources.base import ACTIONS, ACTORS, PROJECT, SYSTEM, Event
from engine.state import State
from engine.stored import held_back
from engine.paths import environment_home, environments

RESOURCES = "project"


class Setting:
    def __init__(self, default=None):
        self.default = default

    def __set_name__(self, owner, name: str) -> None:
        self.name = name

    def __get__(self, obj, owner=None):
        if obj is None:
            return self.name
        got = obj.setting(self.name)
        if got is not None:
            return got
        return self.default() if callable(self.default) else self.default

    def __set__(self, obj, value) -> None:
        obj.set_setting(self.name, value)


class Record:
    SETTINGS = ("features", "triggers", "keep", "messages", "tags", "agents", "skills", "questions", "delivery", "viewer")
    features = Setting(dict)
    triggers = Setting(dict)
    keep = Setting(dict)
    messages = Setting(dict)
    tags = Setting(dict)
    agents = Setting(dict)
    skills = Setting(list)
    questions = Setting(dict)
    delivery = Setting(dict)
    viewer = Setting(dict)
    cleanup_read_at = Setting(0)

    def __init__(self, root: Path, env: str, memo: bool = False):
        self.root = Path(root)
        self.env = env
        self.home = environment_home(self.root, env)
        self._held: dict[Path, int] = {}
        self._threads = waits.Lock("record", threading.RLock())
        self._depth = 0
        self._pending: list[Callable[[], None]] = []
        self.memo = {} if memo else None
        self._made: set[Path] = set()
        self.event_log = EventLog(self.home, self.locked)
        self.settings_file = SettingsFile(self.home)

    @classmethod
    def every(cls, root: Path) -> list["Record"]:
        return [cls(Path(root), home.name) for home in sorted(environments(root).glob("*/"))]

    def folder(self, type: str, scope: str = "") -> Path:
        f = (self.root / RESOURCES if scope == PROJECT else self.home) / type
        if f not in self._made:
            f.mkdir(parents=True, exist_ok=True)
            self._made.add(f)
        return f

    @contextmanager
    def locked(self, scope: str = ""):
        path = (self.root / RESOURCES if scope == PROJECT else self.home) / ".lock"
        pending: list[Callable[[], None]] = []
        try:
            with self._threads:
                self._depth += 1
                try:
                    with self._flocked(path):
                        yield
                finally:
                    self._depth -= 1
                    if not self._depth:
                        pending, self._pending = self._pending, []
        finally:
            for announce in pending:
                announce()

    @contextmanager
    def _flocked(self, path: Path):
        if self._held.get(path):
            self._held[path] += 1
            try:
                yield
            finally:
                self._held[path] -= 1
            return
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a+") as fh:
            with waits.waited("record"):
                fcntl.flock(fh, fcntl.LOCK_EX)
            self._held[path] = 1
            try:
                yield
            finally:
                self._held[path] = 0
                fcntl.flock(fh, fcntl.LOCK_UN)

    def emit(self, type: str, n: int, action: str, actor: str, quiet: bool = False, **data) -> Event:
        if action not in ACTIONS or actor not in ACTORS:
            raise ValueError(f"not an event: {action} by {actor}")
        if bus.cause() and "cause" not in data:
            data = {**data, "cause": bus.cause()}
        if bus.command(type) and "by" not in data:
            data = {**data, "by": bus.command(type)}
        def stamped(id: int, handled: bool = False) -> Event:
            return Event(id=id, at=time.time(), type=type, n=n, action=action, actor=actor, data=data, pid=os.getpid(), handled=handled)

        def release() -> Event:
            with self.locked():
                e = stamped(self.event_log.last_id() + 1, quiet or bus.listening())
                self.event_log.append(e)
                self._pending.append(partial(bus.tell_watchers if quiet else bus.emit, e, self))
                if self.memo is not None:
                    self.memo.clear()
            return e
        if held_back(release):
            if self.memo is not None:
                self.memo.clear()
            return stamped(0)
        return release()

    def state(self, owner: str, session: str | None = None) -> State:
        folder = self.home / "state" if session is None else runtime.sessions(self.root) / session
        return State(folder / f"{owner}.json")

    def setting(self, key: str, default=None):
        return self.settings().get(key, default)

    def settings(self) -> dict:
        if self.memo is not None and "settings" in self.memo:
            return self.memo["settings"]
        found = self.settings_file.held()[1]
        if self.memo is not None:
            self.memo["settings"] = found
        return found

    def reread_settings(self) -> None:
        self.settings_file.reread()
        if self.memo is not None:
            self.memo.pop("settings", None)

    def set_setting(self, key: str, value) -> None:
        with self.locked():
            self.settings_file.write(key, value)
        self.reread_settings()
        self.emit("feature", 0, "stamped", SYSTEM, quiet=True, setting=key)
