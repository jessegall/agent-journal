import time
from dataclasses import dataclass, replace
from enum import StrEnum
from pathlib import Path

from engine import bus
from resources.base import PROJECT, Event, Refused

PROTOCOL = 1
ENVIRONMENT = "environment"
OLDEST_CLIENT_PROTOCOL = 1

NEVER_TRAVELS_PATHS = ("runtime", "phone-push.json", "vault", "secrets")
NEVER_TRAVELS_IN_PROJECT = (".journal", ".env", ".env.*")
NEVER_TRAVELS_TYPES = ("phone",)
NEVER_TRAVELS_FIELDS = {"share": ("token", "password"), "plugin": ("token",)}


def travels(path: str) -> bool:
    """Whether a file of the record is copied to another machine: its runtime, push keys, vault and secrets never are."""
    return not any(part in NEVER_TRAVELS_PATHS for part in path.replace("\\", "/").split("/"))


FOLDER_FIELDS = {"agent": ("cwd", "transcript"), "helper": ("worktree", "checkout"), "worktree": ("path",), "record": ("folder",), "environment": ("folder",)}


def utc_minute() -> str:
    """A date written into a row's text, in UTC, so the same moment reads the same on every machine."""
    return time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime())


def relative(path: str, project: Path) -> str:
    """A path inside the project as written from its root; one outside it is this machine's alone and becomes empty."""
    if not Path(path).is_absolute():
        return path
    return Path(path).relative_to(project).as_posix() if Path(path).is_relative_to(project) else ""


def travelling(type_: str, data: dict, project: Path) -> dict | None:
    """What of a row is copied to another machine: nothing for a type that stays, otherwise the row without its keys, hashes and tokens, its paths from the project's root."""
    if type_ in NEVER_TRAVELS_TYPES:
        return None
    kept = {name: value for name, value in data.items() if name not in NEVER_TRAVELS_FIELDS.get(type_, ())}
    return {name: relative(value, project) if name in FOLDER_FIELDS.get(type_, ()) else value for name, value in kept.items()}


class Step(StrEnum):
    IN_STEP = "in step"
    UPGRADE_HERE = "upgrade here"
    MIGRATE_PULLED = "migrate pulled"
    PULL_AGAIN = "pull again"


@dataclass(frozen=True)
class Comparison:
    """What a copy does before it syncs: nothing, upgrade first, run its newer migrations over each pull, or pull everything again."""

    step: Step
    migrations: tuple[str, ...] = ()


@dataclass(frozen=True)
class Shape:
    """What a record's copy is made of: the sync's own protocol number, which changes rarely, the migrations its rows went through, and the epoch a restore moves on."""

    protocol: int
    migrations: frozenset[str]
    epoch: int = 0

    def compared(self, server: "Shape") -> Comparison:
        if self.protocol != server.protocol or self.epoch != server.epoch:
            return Comparison(Step.PULL_AGAIN)
        missing = server.migrations - self.migrations
        if missing:
            return Comparison(Step.UPGRADE_HERE, tuple(sorted(missing)))
        ahead = self.migrations - server.migrations
        if ahead:
            return Comparison(Step.MIGRATE_PULLED, tuple(sorted(ahead)))
        return Comparison(Step.IN_STEP)


class Release(StrEnum):
    SAME = "same"
    BEHIND = "behind"
    AHEAD = "ahead"

    @classmethod
    def of(cls, ours: tuple[int, ...], theirs: tuple[int, ...]) -> "Release":
        if ours == theirs:
            return cls.SAME
        return cls.BEHIND if ours < theirs else cls.AHEAD


def numbered(version: str) -> tuple[int, ...]:
    return tuple(int(part) for part in version.split(".") if part.isdigit())


@dataclass(frozen=True)
class Hello:
    """What a copy says about itself when it connects: its release and the shape of its record."""

    version: str
    shape: Shape
    machine: str = ""
    oldest: int = 0

    @classmethod
    def read(cls, payload: dict) -> "Hello":
        return cls(str(payload.get("version", "")), Shape(int(payload.get("protocol", 0)), frozenset(payload.get("migrations", [])), int(payload.get("epoch", 0))),
                   str(payload.get("machine", "")), int(payload.get("oldest", 0)))

    def to_json(self) -> dict:
        return {"version": self.version, "protocol": self.shape.protocol, "migrations": sorted(self.shape.migrations), "epoch": self.shape.epoch, "machine": self.machine, "oldest": self.oldest}


@dataclass(frozen=True)
class Welcome:
    """The server's answer to a connecting copy: where its release stands against the server's, and what its record must do before it syncs."""

    release: Release
    comparison: Comparison


CONNECTION = "connection"


def has_joined(record) -> bool:
    """Whether this copy joined a server, which then writes every scope this copy does not hold."""
    return bool(record.state(CONNECTION).get("welcome"))


def connect(client: Hello, server: Hello) -> Welcome:
    if client.shape.protocol < max(OLDEST_CLIENT_PROTOCOL, server.oldest):
        raise Refused(f"this copy ({client.version or 'unknown release'}) is too old to carry the sync's checks on what never leaves a machine: upgrade it, then connect again")
    return Welcome(Release.of(numbered(client.version), numbered(server.version)), client.shape.compared(server.shape))


def pulled_cursor(scope: str) -> str:
    return f"pulled-{scope or ENVIRONMENT}"


def replay(record, scope: str, events: list[Event]) -> int:
    """Puts events pulled from the server into this machine's log as already handled, so no feature fires on them, and moves the scope's own cursor; answers how many were new."""
    log = record.event_log.project if scope == PROJECT else record.event_log
    cursor = pulled_cursor(scope)
    seen = record.event_log.cursor(cursor)
    fresh = sorted((event for event in events if event.id > seen), key=lambda event: event.id)
    with record.locked(scope):
        for event in fresh:
            log.append(replace(event, handled=True))
    for event in fresh:
        bus.tell_watchers(event, record)
    if fresh:
        record.event_log.set_cursor(cursor, fresh[-1].id)
    return len(fresh)
