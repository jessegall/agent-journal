from dataclasses import dataclass
from enum import StrEnum

PROTOCOL = 1


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
