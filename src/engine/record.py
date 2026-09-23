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
from engine.state import State
from engine.stored import held_back, read_json, write_json, write_text

RESOURCES = "project"


SETTINGS: dict[str, tuple] = {}


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
        self.home = self.root / "environments" / env
        self.home.mkdir(parents=True, exist_ok=True)
        self._held = 0
        self._threads = threading.RLock()
        self.memo = {} if memo else None
        self._made: set[Path] = set()

    def folder(self, type: str, scope: str = "") -> Path:
        f = (self.root / RESOURCES if scope == PROJECT else self.home) / type
        if f not in self._made:
            f.mkdir(parents=True, exist_ok=True)
            self._made.add(f)
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

    def emit(self, type: str, n: int, action: str, actor: str, quiet: bool = False, **data) -> Event:
        if action not in ACTIONS or actor not in ACTORS:
            raise ValueError(f"not an event: {action} by {actor}")
        if bus.cause() and "cause" not in data:
            data = {**data, "cause": bus.cause()}
        if bus.command(type) and "by" not in data:
            data = {**data, "by": bus.command(type)}
        def release() -> Event:
            with self.locked():
                e = Event(id=self.last_event() + 1, at=time.time(), type=type, n=n, action=action, actor=actor, data=data, pid=os.getpid(), handled=quiet or bus.listening())
                with (self.home / "events.jsonl").open("a") as fh:
                    fh.write(json.dumps(asdict(e)) + "\n")
            if self.memo is not None:
                self.memo.clear()
            if quiet:
                bus.tell_watchers(e, self)
            else:
                bus.emit(e, self)
            return e
        if held_back(release):
            if self.memo is not None:
                self.memo.clear()
            return Event(id=0, at=time.time(), type=type, n=n, action=action, actor=actor, data=data, pid=os.getpid())
        return release()

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

    def trim_events(self, keep: int, readers_since: float) -> int:
        log = self.home / "events.jsonl"
        if not log.is_file():
            return 0
        with self.locked():
            lines = log.read_text().splitlines(keepends=True)
            if len(lines) <= keep:
                return 0
            ids = [json.loads(line).get("id", 0) for line in lines]
            unread = min((self.cursor(f.name.removeprefix("cursor-")) for f in (self.home / "runtime").glob("cursor-*")
                          if f.stat().st_mtime >= readers_since and self.cursor_text(f.name.removeprefix("cursor-")).isdigit()), default=ids[-1])
            floor = min(ids[-keep], unread + 1)
            kept = [line for line, n in zip(lines, ids) if n >= floor]
            write_text(log, "".join(kept))
            return len(lines) - len(kept)

    def cursor_text(self, name: str) -> str:
        f = self.home / "runtime" / f"cursor-{name}"
        try:
            return f.read_text().strip()
        except OSError:
            return ""

    def set_cursor_text(self, name: str, text: str) -> None:
        f = self.home / "runtime" / f"cursor-{name}"
        f.parent.mkdir(parents=True, exist_ok=True)
        write_text(f, text)

    def cursor(self, name: str) -> int:
        try:
            text = self.cursor_text(name)
            return int(text) if text else 0
        except ValueError:
            return 0

    def set_cursor(self, name: str, n: int) -> None:
        self.set_cursor_text(name, str(n))

    def state(self, owner: str, session: str = "") -> State:
        folder = self.root / "runtime" / "sessions" / session if session else self.home / "state"
        return State(folder / f"{owner}.json")

    def setting(self, key: str, default=None):
        return self.settings().get(key, default)

    def settings(self) -> dict:
        f = self.home / "settings.json"
        try:
            stamp = f.stat().st_mtime_ns
        except OSError:
            return {}
        held = SETTINGS.get(str(f))
        if not held or held[0] != stamp:
            held = SETTINGS[str(f)] = (stamp, read_json(f, {}))
        return held[1]

    def set_setting(self, key: str, value) -> None:
        f = self.home / "settings.json"
        with self.locked():
            write_json(f, {**read_json(f, {}), key: value}, indent=2)
