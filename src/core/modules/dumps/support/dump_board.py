from core.modules.dumps.support.dump_board_json_record import DumpBoardJsonRecord
import json
from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.dumps.models.dump_row import DumpRow


@dataclass(frozen=True)
class DumpBoard:
    """What the dumps window draws: how many dumps there are, and a page of them, newest first, each with its
    items in order."""

    total: int
    dumps: Sequence[DumpRow]
    items: Sequence[DumpRow]

    def json(self) -> DumpBoardJsonRecord:
        return {"total": self.total,
                "dumps": [{"id": dump.dump_id, "title": dump.title, "brief": dump.brief, "outcome": dump.outcome,
                           "items": [{"id": item.item_id, "text": item.text, "state": item.state, "note": item.note, "summary": item.summary, "refs": json.loads(item.refs)}
                                     for item in self.items if item.dump_id == dump.dump_id]} for dump in self.dumps]}
