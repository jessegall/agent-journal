import fcntl
import os
import sys
import threading
import time
from contextlib import contextmanager
from functools import partial
from pathlib import Path
from typing import Callable

from engine import bus, runtime, waits
from engine.event_log import EventLog, RecordEvents
from engine.machines import Lease, NotTheOwner, Pushing, ThisMachine
from engine.numbers import EVENTS, Numbers
from engine.settings_file import PROJECT_PARTS, ScopedSettings, merged_into
from resources.base import ACTIONS, ACTORS, PROJECT, SYSTEM, Event
from engine.state import State
from engine.transaction import held_back
from engine.paths import environment_home, environments

RESOURCES = "project"


class Setting:
    def __init__(self, default=None, project: tuple[str, ...] = ()):
        self.default, self.project = default, project

    def __set_name__(self, owner, name: str) -> None:
        self.name = name
        if self.project:
            PROJECT_PARTS.keep(name, *self.project)

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
    delivery = Setting(dict, project=("channel",))
    viewer = Setting(dict, project=("color_scheme", "chat_hidden", "away", "tour_seen", "open_with", "port"))

    def __init__(self, root: Path, env: str, memo: bool = False, writer: ThisMachine | Pushing | Lease = ThisMachine()):
        self.root = Path(root)
        self.env = env
        self.writer = writer
        self.home = environment_home(self.root, env)
        self._leases: dict[str, tuple[int, Lease]] = {}
        self._held: dict[Path, int] = {}
        self._threads = waits.Lock("record", threading.RLock())
        self._depth = 0
        self._pending: list[Callable[[], None]] = []
        self.memo = {} if memo else None
        self._folders: dict[tuple[str, str], Path] = {}
        self.event_log = RecordEvents(env, self.home, self.locked, EventLog(self.root / RESOURCES, partial(self.locked, PROJECT), self._readers))
        self.numbers = Numbers.of(self.root)
        self.settings_file = ScopedSettings(self.home, self.root)

    @classmethod
    def every(cls, root: Path) -> list["Record"]:
        return [cls(Path(root), home.name) for home in sorted(environments(root).glob("*/"))]

    def _readers(self) -> list[Path]:
        return [runtime.folder(home) for home in environments(self.root).glob("*/")]

    def folder(self, type: str, scope: str = "") -> Path:
        if (type, scope) not in self._folders:
            f = self.scope_home(scope) / type
            f.mkdir(parents=True, exist_ok=True)
            self._folders[type, scope] = f
        return self._folders[type, scope]

    def scope_home(self, scope: str) -> Path:
        return self.root / RESOURCES if scope == PROJECT else self.home

    def holds(self, scope: str) -> bool:
        return self.writer.holds(self.lease(scope))

    def lease(self, scope: str) -> Lease:
        folder = self.scope_home(scope)
        stamp = Lease.stamp(folder)
        kept = self._leases.get(scope)
        if kept is None or kept[0] != stamp:
            kept = self._leases[scope] = (stamp, Lease.read(folder))
        return kept[1]

    def fence(self, scope: str) -> None:
        if not self.holds(scope):
            raise NotTheOwner.of(self.scope_name(scope), self.lease(scope))

    def hand_over(self, scope: str, machine: str) -> Lease:
        with self.locked(scope):
            lease = Lease.read(self.scope_home(scope)).handed_to(machine)
            lease.write(self.scope_home(scope))
        return lease

    def scope_name(self, scope: str) -> str:
        return PROJECT if scope == PROJECT else self.env

    def remake_folder(self, type: str, scope: str = "") -> Path:
        self._folders.pop((type, scope), None)
        return self.folder(type, scope)

    @contextmanager
    def locked(self, scope: str = ""):
        path = self.scope_home(scope) / ".lock"
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
            failure = None
            for announce in pending:
                try:
                    announce()
                except Exception as error:
                    failure = failure or error
            if failure and sys.exception() is None:
                raise failure

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
                with waits.holding(f"the record lock of {path.parent.name}", runtime.folder(self.root)):
                    yield
            finally:
                self._held[path] = 0
                fcntl.flock(fh, fcntl.LOCK_UN)

    def emit(self, type: str, n: int, action: str, actor: str, quiet: bool = False, scope: str = "", **data) -> Event:
        if action not in ACTIONS or actor not in ACTORS:
            raise ValueError(f"not an event: {action} by {actor}")
        if bus.cause() and "cause" not in data:
            data = {**data, "cause": bus.cause()}
        if bus.command(type) and "by" not in data:
            data = {**data, "by": bus.command(type)}
        def stamped(id: int, handled: bool = False) -> Event:
            return Event(id=id, at=time.time(), type=type, n=n, action=action, actor=actor, data=data, pid=os.getpid(), handled=handled, env=self.env)

        log = self.event_log.project if scope == PROJECT else self.event_log

        def release() -> Event:
            with self.locked(scope), self.numbers.ordered():
                self.fence(scope)
                e = stamped(self.numbers.draw(EVENTS, lambda: log.last_id() + 1), quiet or bus.listening())
                log.append(e)
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
        return self.state_at(folder / f"{owner}.json")

    def state_at(self, path: Path) -> State:
        if self.memo is None:
            return State(path)
        return self.memo.setdefault(("state", str(path)), State(path))

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
        self._settled(key, self.settings_file.write(key, value, self.locked))

    def change_setting(self, key: str, part: dict) -> None:
        self._settled(key, self.settings_file.write(key, part, self.locked, merged_into))

    def _settled(self, key: str, shared: bool) -> None:
        self.reread_settings()
        for record in [self, *(r for r in Record.every(self.root) if shared and r.env != self.env)]:
            record.emit("feature", 0, "stamped", SYSTEM, quiet=True, setting=key)
