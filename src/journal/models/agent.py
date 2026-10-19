from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Agent(Scoped):
    """One agent session. Its state is the truth about what it is doing; the data is whatever that state holds, such as the task in hand."""

    session: str = ""
    provider: str = ""
    state: str = "idle"
    data: dict | None = None
    skills_loaded: dict | None = None
    """Skill name to the hash of the file the agent read, this window."""
    context_mark: int = 0
    """The highest context mark the agent has been asked at, so no mark asks twice."""
    oriented: bool = True
    """False from a session start until the agent has looked at what is in flight here; an agent no start made owes no look."""
    mark_owed: int = 0
    """The context mark the agent crossed and has not decided at yet; nought when none is owed."""
    skills_owed: tuple[str, ...] = ()
    """The skills the agent owes a read of, by name."""
    sequence_runs: tuple = ()
    """The sequences the agent is working through, the one in hand last; each a SequenceRun as a dict, kept beside the state so no move of the agent loses it."""

    def has_program(self) -> bool:
        return bool(self.provider)
