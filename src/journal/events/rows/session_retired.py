from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class SessionRetired(RowEvent):
    """An agent's session was ended from outside it: silent for too long, or replaced by a newer session of its provider."""

    agent_session: str
