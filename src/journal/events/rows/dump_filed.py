from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class DumpFiled(RowEvent):
    """A dump closed: every item filed or failed, or the user stopped it."""

    dump_id: int
    outcome: str
    stopped: bool
