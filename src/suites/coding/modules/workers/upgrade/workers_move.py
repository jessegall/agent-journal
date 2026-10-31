from core.base.database.database import Database
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

WORKERS = "sent_agents"
UNFINISHED_STATES = ("clocked in", "reported", "ended without clocking out")
BRIEF_SHOWN_CHARACTERS = 80
HISTORY_LINE = "workers, their to-do items and proofs are history in the backup: send any worker that was still working again"


class WorkersMove(VersionFourMove):
    """Leaves version 4's workers, their to-do items, proofs and subagents in the backup, counted, since the
    worktrees they wrote in are gone; names each worker whose work was not finished or merged, so the person
    sends it again."""

    name = "workers"
    reads = [WORKERS]
    drops = ["worker_todos", "proofs", "subagents"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, workers = MoveReport(), source.rows(WORKERS)
        for table, count in ((WORKERS, len(workers)), *((table, len(source.rows(table))) for table in self.drops)):
            report.drop(table, count)
        report.note(HISTORY_LINE)
        for worker in workers:
            if worker["state"] in UNFINISHED_STATES:
                report.note(f"worker {worker['name']} had not finished ({worker['state']}): {worker['brief'][:BRIEF_SHOWN_CHARACTERS]}")
        return report
