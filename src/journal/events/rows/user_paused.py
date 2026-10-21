from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class UserPaused(RowEvent):
    """The user paused an agent from the viewer, by its session."""

    agent_session: str
