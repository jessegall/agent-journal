import sqlite3

from engine.database.database import Database
from engine.database.errors.migration_deferred_error import MigrationDeferredError
from engine.database.rebuild_migration import RebuildMigration
from engine.database.statement import Statement
from engine.enums.log_level import LogLevel
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from core.modules.agents.support.fold_copy import FoldCopy
from core.modules.agents.support.main_fold import MainFold
from core.modules.agents.support.main_fold_plan import EnvironmentFold

ONE_MAIN_INDEX = Statement("CREATE UNIQUE INDEX IF NOT EXISTS agents_one_main ON agents (environment_id) WHERE role = 'main'")


class FoldMainAgentsMigration(RebuildMigration):
    """Folds every older main agent row into its environment's one main agent after a fresh copy of the open
    database. A fold that does not add up, or fails on the copy or a rewrite, rolls back, goes to the system log
    and is deferred: the journal starts unfolded and the fold runs again at the next start. Once one main row
    per environment is left, a unique index keeps it that way."""

    number = 28
    statements = ()

    def run(self, database: Database) -> None:
        fold = MainFold(database)
        folds = fold.plan()
        if folds:
            self.fold(database, fold, folds)
        database.update(ONE_MAIN_INDEX)

    @staticmethod
    def fold(database: Database, fold: MainFold, folds: tuple[EnvironmentFold, ...]) -> None:
        clock = Clock()
        home = JournalHome(database.file().parent)
        log = SystemLogWriter(home, clock)
        try:
            copy = FoldCopy.before_attempt(database, home)
            counts = fold.run(folds, clock.timestamp().text)
        except (Refusal, sqlite3.Error, OSError) as error:
            log.write(LogLevel.ERROR, f"The fold of main agents rolled back and runs again at the next start: {error}")
            raise MigrationDeferredError.because(f"the fold of main agents failed: {error}") from error
        log.write(LogLevel.INFORMATION, f"Folded {sum(len(fold.folded) for fold in folds)} main agent rows into {len(folds)} "
                                        f"survivors; {sum(counts.removed.get(table, 0) for table in counts.tables_before)} rows settled. Copy: {copy}")
