from core.base.database.database import Database
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource

WORKERS = "sent_agents"
FINISHED_STATES = ("merged", "released", "judged")
HISTORY_LINE = "workers, their to-do items and proofs are history in the backup: send any worker that was still working again"


class WorkersMove(VersionFourMove):
    """Reports the retained worker history and each unfinished job that must be sent again."""

    name = "workers"
    reads = [WORKERS]
    drops = ["worker_todos", "proofs", "subagents", "test_turns"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, workers = MoveReport(), source.rows(WORKERS)
        for table, count in ((WORKERS, len(workers)), *((table, len(source.rows(table))) for table in self.drops)):
            report.drop(table, count)
        report.note(HISTORY_LINE)
        for worker in workers:
            if worker["state"] not in FINISHED_STATES:
                report.note(f"{worker['helper_type']} {worker['name']} had not finished ({worker['state']}): {worker['brief']}; send this work again (version 4 {worker['helper_type']} {worker['id']})")
        return report
