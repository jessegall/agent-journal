"""What the close from commits feature recognises: a commit the agent made, and a commit whose message carries the line that closes to-dos."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class LogRead(Fact):
    """The logs of a checkout were read as far as they go, so the next look starts there."""

    stamps: tuple[tuple[str, int], ...]
    cursors: tuple[tuple[str, str], ...]


@dataclass(frozen=True, kw_only=True)
class CommitMade(Fact):
    """A commit the agent made in its checkout, to be marked in the chat."""

    agent: int
    sha: str
    subject: str
    branch: str


@dataclass(frozen=True, kw_only=True)
class TrailerFound(Fact):
    """A commit whose message says which to-dos it closes."""

    agent: int
    sha: str
    subject: str
    body: str
    held_only: bool
