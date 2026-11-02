from core.base.database.database import Database
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource


class SchedulesMove(VersionFourMove):
    """A scheduled job lives only in its agent program's session, so version 4's rows name jobs that are gone;
    they are dropped and stay in the backup."""

    name = "schedules"
    drops = ["scheduled_jobs"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report = MoveReport()
        for table in self.drops:
            report.drop(table, source.count(table))
        return report
