"""What the long commands feature recognises: a command held too long in the foreground, and what became of one it moved."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class CallsLost(Fact):
    """Shell calls the agent's transcript shows answered, whose end never reached the journal."""

    agent: int
    gone: tuple[tuple[float, str], ...]


@dataclass(frozen=True, kw_only=True)
class LongCommandHeld(Fact):
    """A command that has held the agent's terminal past its wait, and is to be moved to the background."""

    agent: int
    command: str
    started: str
    provider: str


@dataclass(frozen=True, kw_only=True)
class LongCommandKept(Fact):
    """A command held past its wait that a plugin keeps in the foreground, with the plugin's reason."""

    agent: int
    reason: str


@dataclass(frozen=True, kw_only=True)
class MoveNotTaken(Fact):
    """A command moved to the background that started no task of its own in time, so the press is made again."""

    agent: int
    started: str


@dataclass(frozen=True, kw_only=True)
class TaskFound(Fact):
    """The background task a moved command became."""

    agent: int
    task: str


@dataclass(frozen=True, kw_only=True)
class PartRunning(Fact):
    """The part of a chained command that a moved command is still running."""

    agent: int
    started: str
    part: str


@dataclass(frozen=True, kw_only=True)
class MovedCommandEnded(Fact):
    """A moved command's task ended, or the command ended before it could be moved."""

    agent: int
    started: str
    state: str
    ended: float
