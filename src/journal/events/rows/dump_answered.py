from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class DumpAnswered(RowEvent):
    """The user answered the agent's question on a dump."""

    dump_id: int
    question: str
    answer: str
