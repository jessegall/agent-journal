from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class DumpArrived(RowEvent):
    """Something to file reached a dump: the user dropped it, or added a file to it; how many of its items wait to be read."""

    dump_id: int
    waiting: int
    by_user: bool
