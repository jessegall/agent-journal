from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Agent(Scoped):
    """One agent session. Its state is the truth about what it is doing; the data is whatever that state holds, such as the task in hand."""

    session: str = ""
    provider: str = ""
    state: str = "idle"
    data: dict | None = None
