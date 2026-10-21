from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class UserResumed(RowEvent):
    """The user resumed a paused agent from the viewer, by its session."""

    agent_session: str
