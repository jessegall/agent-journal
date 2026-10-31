import json
import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.type_guards import is_list, is_mapping
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.dumps.upgrade.version_four_item import VersionFourItem

TABLE = "dumps"
BRIEF_ITEM = "text"


class DumpsMove(VersionFourMove):
    """Carries version 4's dumps under their numbers, with an item for each part (or the whole text) and each
    file, as filed, failed, noted or not read yet; a completed dump is closed with its outcome. The question,
    answers and log version 4 kept on a dump are not carried and are counted."""

    name = "dumps"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if map.new_id("environments", row["environment_id"]) is None:
                report.skip(TABLE, row["id"], "its environment did not move")
                continue
            if row["question"] not in (None, "", "{}") or row["log"] not in (None, "", "[]"):
                report.drop("dump questions and logs", 1)
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created, updated = row["created_at"] or context.timestamp, row["updated_at"] or row["created_at"] or context.timestamp
        files = sorted(self.texts(row["files"]))
        details = self.json_value(row["items"], {})
        dump_id = rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "creator_id": creator_id, "title": row["title"] or "",
                                      "brief": row["brief"] or "", "files": json.dumps(files), "outcome": row["outcome"] or "",
                                      "closed_at": updated if row["completed_at"] else None, "created_at": created, "updated_at": updated})
        for position, name in enumerate(self.item_names(row, files), 1):
            item = VersionFourItem.parsed(details.get(name) if is_mapping(details) else None)
            rows.insert("dump_items", {"dump_id": dump_id, "creator_id": creator_id, "position": position, "text": (row["brief"] if name == BRIEF_ITEM else name) or "-",
                                       "state": item.state.value, "note": item.note, "summary": item.summary, "refs": json.dumps(item.refs),
                                       "created_at": created, "updated_at": updated})
        return dump_id

    def item_names(self, row: sqlite3.Row, files: list[str]) -> list[str]:
        if not (row["brief"] or "").strip():
            return files
        return [*(self.texts(row["parts"]) or [BRIEF_ITEM]), *files]

    def texts(self, text: str | None) -> list[str]:
        value = self.json_value(text, [])
        return [item for item in value if isinstance(item, str)] if is_list(value) else []

    def json_value(self, text: str | None, fallback: object) -> object:
        try:
            return json.loads(text) if text else fallback
        except ValueError:
            return fallback
