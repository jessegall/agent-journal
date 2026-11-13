import sqlite3
import time

from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.agents.commands.main_agent_fold_check.main_agent_fold_check import MainAgentFoldCheck
from core.modules.agents.support.fold_copy import FoldCopy
from core.modules.agents.support.main_fold import MainFold
from core.modules.agents.support.fold_counts import FoldCounts
from core.modules.agents.support.environment_fold import EnvironmentFold

SINGLE_MAIN_TEXT = "Every environment has one main agent row: nothing to fold."
FOLD_REPORT = """## Survivors

{environments}

## References moved

| Column | Before | After |
| --- | --- | --- |
{references}

## Tables that changed

| Table | Before | After |
| --- | --- | --- |
{tables}

## Clash rules used

{rules}

The fold took {seconds:.1f} seconds on the copy; the live database was not touched."""


class MainAgentFoldCheckHandler(Handler[MainAgentFoldCheck, str]):
    """Copies the live database with the backup API, folds the main agent rows on the copy only, and files the
    survivors, the folded rows, the counts before and after, the clash rules used and the time it took, as
    the command's answer."""

    command = MainAgentFoldCheck

    def __init__(self, home: JournalHome, database: Database) -> None:
        self.home, self.database = home, database

    def handle(self, command: MainAgentFoldCheck, context: Context) -> str:
        copy = Database.configured(sqlite3.connect(FoldCopy.check_copy(self.database, self.home, context.timestamp), autocommit=True))
        try:
            started = time.monotonic()
            fold = MainFold(copy)
            folds = fold.plan()
            counts = fold.run(folds, context.timestamp.text)
            seconds = time.monotonic() - started
        finally:
            copy.connection.close()
        if not folds:
            return SINGLE_MAIN_TEXT
        return self.report_text(folds, counts, seconds)

    @staticmethod
    def report_text(folds: tuple[EnvironmentFold, ...], counts: FoldCounts, seconds: float) -> str:
        environments = [f"- environment {fold.environment_id}: agent {fold.survivor.id} survives as number 1; folded: "
                        + ", ".join(f"agent {agent.id} (number {agent.number})" for agent in fold.folded) for fold in folds]
        references = [f"| {name} | {prior_counts} | {after} |" for name, (prior_counts, after) in sorted(counts.references.items()) if prior_counts]
        tables = [f"| {table} | {count} | {counts.tables_after.get(table)} |" for table, count in sorted(counts.tables_prior.items())
                  if counts.tables_after.get(table) != count]
        rules = [f"- {rule}: {count} rows" for rule, count in sorted(counts.rules.items())] or ["- none"]
        return FOLD_REPORT.format(environments="\n".join(environments), references="\n".join(references), tables="\n".join(tables),
                                  rules="\n".join(rules), seconds=seconds)
