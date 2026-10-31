import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "suggestions"


class SuggestionsMove(VersionFourMove):
    """Carries version 4's suggestions with their keys, titles and answers into the first environment, since
    version 4 kept them for the whole project, so none is offered again; with no environment they are skipped."""

    name = "suggestions"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        environments = [row["id"] for row in source.rows("environments") if map.new_id("environments", row["id"]) is not None]
        for row in source.rows(TABLE):
            if not environments:
                report.skip(TABLE, row["id"], "no environment moved")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, environments[0], creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, environment_id: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"id": row["id"], "environment_id": environment_id, "creator_id": creator_id, "key": row["key"], "title": row["title"],
                                   "answer": row["answer"] or None, "created_at": created, "updated_at": row["updated_at"] or created})
