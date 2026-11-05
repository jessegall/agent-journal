from core.modules.dumps.support.dump_board_json_record import DumpBoardJsonRecord
from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem


@dataclass(frozen=True)
class DumpBoard:
    """What the dumps window draws: how many dumps there are, and a page of them, newest first, each with its
    items in order."""

    total: int
    dumps: Sequence[Dump]
    items: Sequence[DumpItem]

    def json(self) -> DumpBoardJsonRecord:
        return {"total": self.total,
                "dumps": [{"id": dump.id, "title": dump.title, "brief": dump.brief, "outcome": dump.outcome,
                           "items": [{"id": item.id, "text": item.text, "state": item.state.value, "note": item.note, "summary": item.summary, "refs": list(item.refs)}
                                     for item in self.items if item.dump_id == dump.id]} for dump in self.dumps]}
