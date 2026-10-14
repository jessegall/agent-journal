"""What the session briefing feature recognises: a session to greet, and a start block that no longer matches the record."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class SessionGreeted(Fact):
    """A session started in an environment worked by the user, to be asked to say hello."""

    agent: int
    env: str


@dataclass(frozen=True, kw_only=True)
class StartBlockStale(Fact):
    """A row or setting the start block is built from changed, so the files that carry it are written again."""
