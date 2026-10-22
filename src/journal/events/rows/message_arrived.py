from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class MessageArrived(RowEvent):
    """The user left a message in the chat, by its words."""

    text: str
