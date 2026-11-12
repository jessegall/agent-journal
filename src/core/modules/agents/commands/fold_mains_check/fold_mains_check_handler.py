import sqlite3
import time

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.agents.commands.fold_mains_check.fold_mains_check import FoldMainsCheck
from core.modules.agents.support.main_fold import FoldCounts, MainFold
from core.modules.agents.support.main_fold_plan import EnvironmentFold
from core.modules.documents.commands.make_text.make_text import MakeText
from core.modules.documents.models.report import Report

COPY_FOLDER = "backups-watch"
NOTHING_TO_FOLD = "Every environment has one main agent row: nothing to fold."
REPORT_TITLE = "Fold of main agents, checked on a copy"


class FoldMainsCheckHandler(Handler[FoldMainsCheck, str]):
    """Copies the live database with the backup API, folds the main agent rows on the copy only, and files the
    survivors, the folded rows, the counts before and after, the clash rules used and the time it took."""

    command = FoldMainsCheck

    def __init__(self, home: JournalHome, bus: Bus) -> None:
        self.home, self.bus = home, bus

    def handle(self, command: FoldMainsCheck, context: Context) -> str:
        copy = Database.configured(sqlite3.connect(self.copied(context), autocommit=True))
        try:
            started = time.monotonic()
            fold = MainFold(copy)
            folds = fold.plan()
            counts = fold.run(folds, context.timestamp.text())
            seconds = time.monotonic() - started
        finally:
            copy.connection.close()
        if not folds:
            return NOTHING_TO_FOLD
        text = self.report_text(folds, counts, seconds)
        self.bus.dispatch(MakeText(Report, REPORT_TITLE, f"{sum(len(fold.folded) for fold in folds)} main agent rows fold into {len(folds)} survivors", text), context)
        return text

    def copied(self, context: Context) -> str:
        folder = self.home.folder / COPY_FOLDER
        folder.mkdir(parents=True, exist_ok=True)
        target = folder / f"fold-{context.timestamp.value.strftime('%Y%m%d-%H%M%S')}.db"
        source, copy = sqlite3.connect(self.home.database), sqlite3.connect(target)
        try:
            source.backup(copy)
        finally:
            copy.close()
            source.close()
        return str(target)

    @staticmethod
    def report_text(folds: tuple[EnvironmentFold, ...], counts: FoldCounts, seconds: float) -> str:
        environments = [f"- environment {fold.environment_id}: agent {fold.survivor.id} survives as number 1; folded: "
                        + ", ".join(f"agent {agent.id} (number {agent.number})" for agent in fold.folded) for fold in folds]
        references = [f"| {name} | {before} | {after} |" for name, (before, after) in sorted(counts.references.items()) if before]
        tables = [f"| {table} | {count} | {counts.tables_after.get(table)} |" for table, count in sorted(counts.tables_before.items())
                  if counts.tables_after.get(table) != count]
        rules = [f"- {rule}: {count} rows" for rule, count in sorted(counts.rules.items())] or ["- none"]
        return "\n".join(["## Survivors", "", *environments, "", "## References moved", "", "| Column | Before | After |", "| --- | --- | --- |",
                          *references, "", "## Tables that changed", "", "| Table | Before | After |", "| --- | --- | --- |", *tables, "",
                          "## Clash rules used", "", *rules, "", f"The fold took {seconds:.1f} seconds on the copy; the live database was not touched."])
