"""What the work modes feature recognises: an agent's own edits counted against the mode it works in."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class EditCounted(Fact):
    """An edit the agent made itself, outside the journal, with how many it has made in this mode since it was last told."""

    agent: int
    mode: str
    edits: int


@dataclass(frozen=True, kw_only=True)
class DriftChecked(Fact):
    """The agent's edits reached the count at which its mode is checked, and it has not drifted."""

    agent: int
    mode: str


@dataclass(frozen=True, kw_only=True)
class OrchestratorDrifted(Fact):
    """An orchestrating agent that wrote code itself, with how much of it."""

    agent: int
    mode: str
    edits: int


@dataclass(frozen=True, kw_only=True)
class BuilderHandedAway(Fact):
    """A building agent that left the greater part of a stretch's edits to its helpers and subagents."""

    agent: int
    mode: str
    share: int
    own: int
    theirs: int
