from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class DumpChosen(RowEvent):
    """The user chose a next step on a dump, left it to the agent (pick -1) or said what to do in their own words (pick -2)."""

    dump_id: int
    pick: int
    label: str
