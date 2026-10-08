from dataclasses import dataclass
from enum import StrEnum

PROTOCOL = 1

NEVER_TRAVELS_PATHS = ("runtime", "phone-push.json", "vault", "secrets")
NEVER_TRAVELS_TYPES = ("phone",)
NEVER_TRAVELS_FIELDS = {"share": ("token", "password"), "plugin": ("token",)}


def travels(path: str) -> bool:
    """Whether a file of the record is copied to another machine: its runtime, push keys, vault and secrets never are."""
    return not any(part in NEVER_TRAVELS_PATHS for part in path.replace("\\", "/").split("/"))


def travelling(type_: str, data: dict) -> dict | None:
    """What of a row is copied to another machine: nothing for a type that stays, otherwise the row without its keys, hashes and tokens."""
    if type_ in NEVER_TRAVELS_TYPES:
        return None
    return {name: value for name, value in data.items() if name not in NEVER_TRAVELS_FIELDS.get(type_, ())}


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
    """What a record's copy is made of: the sync's own protocol number, which changes rarely, and the migrations its rows went through."""

    protocol: int
    migrations: frozenset[str]

    def compared(self, server: "Shape") -> Comparison:
        if self.protocol != server.protocol:
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


def numbered(version: str) -> tuple[int, ...]:
    return tuple(int(part) for part in version.split(".") if part.isdigit())


@dataclass(frozen=True)
class Hello:
    """What a copy says about itself when it connects: its release and the shape of its record."""

    version: str
    shape: Shape


@dataclass(frozen=True)
class Welcome:
    """The server's answer to a connecting copy: where its release stands against the server's, and what its record must do before it syncs."""

    release: Release
    comparison: Comparison


def connect(client: Hello, server: Hello) -> Welcome:
    ours, theirs = numbered(client.version), numbered(server.version)
    release = Release.SAME if ours == theirs else Release.BEHIND if ours < theirs else Release.AHEAD
    return Welcome(release, client.shape.compared(server.shape))
