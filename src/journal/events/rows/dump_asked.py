from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class DumpAsked(RowEvent):
    """The agent asked the user something on a dump, in the dump's window."""

    dump_id: int
