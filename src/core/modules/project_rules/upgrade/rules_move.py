import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource

TABLE = "rules"
EMPTY_CONDITION = "{}"


class RulesMove(VersionFourMove):
    """Imports version 4 rules as active rules."""

    name = "project-rules"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if row["trigger"] or (row["condition"] and row["condition"] != EMPTY_CONDITION):
                report.note(f"rule {row['id']} had a trigger or a condition version 5 does not carry: it moved without it")
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda rule=row: self.insert(rows, rule, creators.actor_id(rule["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"creator_id": creator_id, "text": row["text"], "created_at": created, "updated_at": row["updated_at"] or created})
