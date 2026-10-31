import json
import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "templates"
LIST_FIELDS = ("targets", "parts", "commands")


class TemplatesMove(VersionFourMove):
    """Carries version 4's templates with their numbers, briefs, the rows they apply to, purposes, parts and
    phase-end commands."""

    name = "templates"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        lists = {field: json.dumps(json.loads(row[field] or "[]")) for field in LIST_FIELDS}
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "brief": row["brief"] or "", "purpose": row["purpose"] or "",
                                   **lists, "created_at": created, "updated_at": row["updated_at"] or created})
