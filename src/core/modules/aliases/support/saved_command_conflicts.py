import json
from engine.enums.process_type import ProcessType
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from dataclasses import asdict

from engine.command.context import Context
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.saved_command_check import SavedCommandCheck


CONFLICT_LIMIT_SECONDS = 10
SAVED_COMMANDS_REASON = "the conflict check compares a saved command with every saved command of its category"


SKIP_NAME = "aliases.saved-command-program"


class SavedCommandConflicts:
    """A test or build program has one saved command per working folder. The check runs a program, so the alias
    commands ask it before their save, never inside a write; --skip-guard aliases.saved-command-program passes it."""

    def __init__(self, aliases: AliasQuery, home: JournalHome, executor: ProcessExecutor) -> None:
        self.aliases, self.home, self.executor = aliases, home, executor

    def refuse(self, alias: Alias, old: Alias | None, context: Context) -> None:
        if SKIP_NAME in context.skipped_guards or alias.category is None or not alias.category.is_long_running:
            return
        if old is not None and alias.line == old.line and alias.category is old.category:
            return
        saved = {row.name: row.line for row in self.aliases.where(category=alias.category).every_row(SAVED_COMMANDS_REASON) if row.id != alias.id}
        if not saved:
            return
        check = SavedCommandCheck(alias.line, saved)
        finished = self.executor.execute(ExecutionRequest([str(self.home.folder / "bin" / "journal-hook"), "--saved-command-conflict", str(self.home.folder / "command_table.json")],
                                                          self.home.folder, ProcessType.QUICK, CONFLICT_LIMIT_SECONDS, stdin=json.dumps(asdict(check))))
        if not finished.succeeded:
            raise Refusal("the saved-command check could not run", finished.stderr.strip())
        if finished.stdout:
            raise Refusal(f"this program and target already use journal {finished.stdout}", f"run journal {finished.stdout} with the test or build arguments")
