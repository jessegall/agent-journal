from core.base.database.database import Database
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource


class TableDropMove(VersionFourMove):
    """A move that carries nothing: each version 4 table in drops is counted in the report and stays in the
    backup."""

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report = MoveReport()
        for table in self.drops:
            report.drop(table, source.count(table))
        return report
