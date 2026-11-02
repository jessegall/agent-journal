import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "statistics"


class StatisticsMove(VersionFourMove):
    """Carries version 4's counts with their numbers, keys and values; a row with no key is skipped and told.
    """

    name = "statistics"
    reads = [TABLE]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, rows = MoveReport(), RowInsert(target)
        for row in source.rows(TABLE):
            if not row["key"]:
                report.skip(TABLE, row["id"], "it has no key")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"id": row["id"], "key": row["key"], "value": row["value"] or 0, "created_at": created, "updated_at": row["updated_at"] or created})
