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
    oriented: bool = False
    """False at every session start, true once the agent has looked at what is in flight here."""
    mark_owed: int = 0
    """The context mark the agent crossed and has not decided at yet; nought when none is owed."""
