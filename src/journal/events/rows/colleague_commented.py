from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class ColleagueCommented(RowEvent):
    """A colleague left a comment in this environment's chat: their words and their name. It is no message of the user's."""

    text: str
    colleague: str
