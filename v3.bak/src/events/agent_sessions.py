"""What agent sessions recognises: sessions that ended or were evicted, a compaction, a stop asked for, a subagent that is alive, and its report."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class SessionEvicted(Fact):
    """The agent's session was put out of its environment and holds no seat now."""

    agent: int
    environment: str
    by: str
    why: str


@dataclass(frozen=True, kw_only=True)
class EvictionLifted(Fact):
    """The agent's session holds a seat, or was never put out of one."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class TakeOverChosen(Fact):
    """The user chose to give a waiting session the environment that another session holds."""

    session: str
    environment: str
    place: int


@dataclass(frozen=True, kw_only=True)
class SessionEnded(Fact):
    """The session of an agent row still counted as running is gone."""

    row: int


@dataclass(frozen=True, kw_only=True)
class CompactionStarted(Fact):
    """The agent's conversation began to be compacted."""

    agent: int
    at: float


@dataclass(frozen=True, kw_only=True)
class StopAsked(Fact):
    """The user asked the agent to stop a task it runs."""

    agent: int
    task: str
    description: str
    how: str


@dataclass(frozen=True, kw_only=True)
class SubagentAlive(Fact):
    """A subagent wrote a row, so it is alive and works for this dispatcher."""

    session: str
    dispatcher: str
    at: float


@dataclass(frozen=True, kw_only=True)
class SubagentReportLinked(Fact):
    """A report the agent filed belongs to the subagent that ended just before it."""

    agent: int
    reports: tuple[tuple[str, int], ...]


@dataclass(frozen=True, kw_only=True)
class ReportNoticed(Fact):
    """A to-do carries a subagent's report that was not yet noticed."""

    todo: int


@dataclass(frozen=True, kw_only=True)
class ReportHandedBack(Fact):
    """A subagent reported on a to-do, which its dispatcher is told."""

    agent: int
    todo: int
    who: str
    how: str


@dataclass(frozen=True, kw_only=True)
class AssignmentLapsed(Fact):
    """A subagent held a to-do for longer than it stays quiet, so the to-do is free again and the dispatcher is told."""

    agent: int
    todo: int
    who: str
    minutes: int


@dataclass(frozen=True, kw_only=True)
class SilenceDue(Fact):
    """The liveness trigger says it is time to look for sessions that went silent."""

    agent: int
