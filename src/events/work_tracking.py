"""What work tracking recognises: the state of the work in hand, the rows it frees or ends, and the pace of the agent's edits."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class WorkUndeclared(Fact):
    """No work is open, so the agent's writes are held until it declares some."""


@dataclass(frozen=True, kw_only=True)
class WorkDeclared(Fact):
    """Work is open, so no write is held for want of it."""


@dataclass(frozen=True, kw_only=True)
class WorkFilesLetGo(Fact):
    """A piece of work was opened or ended, so the files it records are let go: an opened one starts empty, an ended one keeps none."""

    work: int


@dataclass(frozen=True, kw_only=True)
class WorkTookTodo(Fact):
    """A piece of work was opened for a to-do, which it now carries."""

    work: int
    todo: int


@dataclass(frozen=True, kw_only=True)
class TodoDoneWithWork(Fact):
    """The work on a to-do ended with the to-do, which is done."""

    work: int
    todo: int


@dataclass(frozen=True, kw_only=True)
class TodoLeftByWork(Fact):
    """The work on a to-do ended without the to-do, which is left to be taken again."""

    todo: int


@dataclass(frozen=True, kw_only=True)
class WorkEndedByTodo(Fact):
    """A to-do was done, which ends the work that was on it."""

    work: int
    how: str


@dataclass(frozen=True, kw_only=True)
class ParkedWorkStands(Fact):
    """Work was parked and nothing else is ready, which the agent is told once for each time it was parked."""

    agent: int
    work: int
    title: str
    why: str
    others: int
    parkings: tuple[str, ...]


@dataclass(frozen=True, kw_only=True)
class RowUnblocked(Fact):
    """A row that waited on a to-do or a plan is free now that it closed."""

    agent: int
    n: int
    title: str
    closed: str


@dataclass(frozen=True, kw_only=True)
class ClosedCounted(Fact):
    """Another to-do was closed, which is this many in all."""

    closed: int


@dataclass(frozen=True, kw_only=True)
class StillBlocked(Fact):
    """A row has stayed blocked through enough closed to-dos for the agent to be asked about it."""

    agent: int
    n: int
    title: str
    why: str
    at: float


@dataclass(frozen=True, kw_only=True)
class EditedInWork(Fact):
    """The agent edited a file while work was open."""

    agent: int
    work: int
    path: str
    kind: str
    before: str
    after: str
    added: int
    removed: int


@dataclass(frozen=True, kw_only=True)
class PollingNamed(Fact):
    """The agent ran the same command again and again to see whether something finished."""

    agent: int
    times: int
    command: str
    wakes: bool


@dataclass(frozen=True, kw_only=True)
class WaitCleared(Fact):
    """The agent went on working, so the wait its work stood in is over."""

    agent: int
    work: int
    awaiting: str


@dataclass(frozen=True, kw_only=True)
class StillAwaiting(Fact):
    """The work has stood in a wait for this long, which the agent is asked about."""

    agent: int
    awaiting: str
    minutes: int


@dataclass(frozen=True, kw_only=True)
class OpenWorkRemains(Fact):
    """Work is open and the agent has been told of it fewer times than it is told at most."""

    agent: int
    work: int
    updated: float
    logged: bool


@dataclass(frozen=True, kw_only=True)
class EditsCounted(Fact):
    """The agent wrote files again, which is this many edits since its last log entry."""

    agent: int
    edits: int


@dataclass(frozen=True, kw_only=True)
class WorkNamedInHand(Fact):
    """Enough edits passed that the agent is told which work it has in hand."""

    agent: int
    work: int
    title: str


@dataclass(frozen=True, kw_only=True)
class LogOverdue(Fact):
    """Too many edits passed without a log entry, so the agent's writes are held until it writes one."""

    agent: int
    work: int
    edits: int


@dataclass(frozen=True, kw_only=True)
class LogWritten(Fact):
    """The agent wrote a log entry, so its count of edits starts again and the hold is let go."""

    agent: int
