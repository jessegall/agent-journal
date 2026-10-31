import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "notices"


class NoticesMove(VersionFourMove):
    """Carries version 4's notices with their numbers, titles, links, button words and closing times; one with no
    link or of an environment that did not move is skipped and told."""

    name = "notices"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if not row["link"]:
                report.skip(TABLE, row["id"], "it has no link")
                continue
            if map.new_id("environments", row["environment_id"]) is None:
                report.skip(TABLE, row["id"], f"its environment {row['environment_id']} did not move")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "creator_id": creator_id, "title": row["title"], "link": row["link"],
                                   "label": row["label"] or "Open", "closed_at": row["closed_at"], "created_at": created, "updated_at": row["updated_at"] or created})
