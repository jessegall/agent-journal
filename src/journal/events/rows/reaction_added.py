from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class ReactionAdded(RowEvent):
    """A face was put on a message, by the user or by the agent."""

    face: str
    message_id: int
    by_user: bool
