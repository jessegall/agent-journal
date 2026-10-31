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
from core.modules.sequences.upgrade.version_four_step import VersionFourStep

TABLE = "sequences"


class SequencesMove(VersionFourMove):
    """Carries version 4's sequences with their numbers, each step as its title and its instructions; their
    triggers, edit holds and allowed commands, which version 5 does not carry, are counted."""

    name = "sequences"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            steps = [VersionFourStep.parsed(fields).text for fields in json.loads(row["steps"] or "[]")]
            if not steps:
                report.skip(TABLE, row["id"], "it has no step")
                continue
            if json.loads(row["triggers"] or "[]"):
                report.drop("sequence triggers", len(json.loads(row["triggers"])))
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, steps, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, steps: list[str], creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "steps": json.dumps(steps), "created_at": created,
                                   "updated_at": row["updated_at"] or created})
