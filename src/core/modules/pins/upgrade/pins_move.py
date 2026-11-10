import sqlite3

from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource

SOURCE_TABLE = "notices"
TARGET_TABLE = "pins"


class PinsMove(VersionFourMove):
    """Carries version 4's notices, which version 5 calls pins, with their numbers, titles, links, button words
    and closing times; one with no link or of an environment that did not move is skipped and told."""

    name = "pins"
    reads = [SOURCE_TABLE]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(SOURCE_TABLE):
            if not row["link"]:
                report.skip(SOURCE_TABLE, row["id"], "it has no link")
                continue
            if map.new_id("environments", row["environment_id"]) is None:
                report.skip(SOURCE_TABLE, row["id"], f"its environment {row['environment_id']} did not move")
                continue
            report.count(TARGET_TABLE, map.transfer(SOURCE_TABLE, row["id"], TARGET_TABLE, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TARGET_TABLE, {"id": row["id"], "environment_id": row["environment_id"], "creator_id": creator_id, "title": row["title"], "link": row["link"],
                                   "label": row["label"] or "Open", "closed_at": row["closed_at"], "created_at": created, "updated_at": row["updated_at"] or created})
