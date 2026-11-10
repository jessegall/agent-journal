import sqlite3
from typing import ClassVar

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource


class TableCopyMove(VersionFourMove):
    """A move that copies one version 4 table into the version 5 table of the same name, row by row under its
    number, each row written by the move's insert with its creator's new actor id."""

    table: ClassVar[str]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(self.table):
            report.count(self.table, map.transfer(self.table, row["id"], self.table, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        raise NotImplementedError(f"{type(self).__name__} states no insert")
