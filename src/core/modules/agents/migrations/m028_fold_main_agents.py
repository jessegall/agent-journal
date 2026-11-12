from pathlib import Path

from engine.database.database import Database
from engine.database.rebuild_migration import RebuildMigration
from engine.database.statement import Statement
from engine.enums.log_level import LogLevel
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from core.modules.agents.support.fold_copy import FoldCopy
from core.modules.agents.support.main_fold import MainFold

DATABASE_FILE = Statement("PRAGMA database_list")
ONE_MAIN_INDEX = Statement("CREATE UNIQUE INDEX IF NOT EXISTS agents_one_main ON agents (environment_id) WHERE role = 'main'")


class FoldMainAgentsMigration(RebuildMigration):
    """Folds every older main agent row into its environment's one main agent, once, after a fresh copy of the
    database; a fold that does not add up rolls back, the reason and the copy go to the system log, and the
    journal starts unfolded. Once one main row per environment is left, a unique index keeps it that way."""

    number = 28
    statements = ()

    def run(self, database: Database) -> None:
        fold = MainFold(database)
        folds = fold.plan()
        if not folds:
            database.update(ONE_MAIN_INDEX)
            return
        clock = Clock()
        home = JournalHome(Path(database.rows(DATABASE_FILE)[0][2]).parent)
        copy = FoldCopy.written(home, clock.timestamp())
        try:
            counts = fold.run(folds, clock.timestamp().text())
        except Refusal as refusal:
            SystemLogWriter(home, clock).write(LogLevel.ERROR, f"The fold of main agents rolled back: {refusal}. The copy taken before it: {copy}")
            return
        database.update(ONE_MAIN_INDEX)
        SystemLogWriter(home, clock).write(LogLevel.INFORMATION, f"Folded {sum(len(fold.folded) for fold in folds)} main agent rows into {len(folds)} "
                                                                  f"survivors; {sum(counts.removed.get(table, 0) for table in counts.tables_before)} rows settled. Copy: {copy}")
