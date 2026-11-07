import json
import subprocess
from dataclasses import asdict

from core.base.change.created import Created
from core.base.change.updated import Updated
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.saved_command_check import SavedCommandCheck


class SavedCommandGuard(Guard[Created[Alias] | Updated[Alias]]):
    """A test or build program has one saved command per working folder."""

    name = "aliases.saved-command-program"

    def __init__(self, aliases: AliasQuery, home: JournalHome) -> None:
        self.aliases, self.home = aliases, home

    def check(self, event: Created[Alias] | Updated[Alias], context: Context) -> None:
        alias = event.row
        if alias.category is None or not alias.category.is_long_running:
            return
        if event.old_row is not None and alias.line == event.old_row.line and alias.category is event.old_row.category:
            return
        saved = {row.name: row.line for row in self.aliases.filter(category=alias.category).all_rows() if row.id != alias.id}
        if not saved:
            return
        check = SavedCommandCheck(alias.line, saved)
        finished = subprocess.run([str(self.home.folder / "bin" / "journal-hook"), "--saved-command-conflict", str(self.home.folder / "command_table.json")],
                                  input=json.dumps(asdict(check)), capture_output=True, text=True, timeout=10, check=True)
        if finished.stdout:
            raise Refusal(f"this program and target already use journal {finished.stdout}", f"run journal {finished.stdout} with the test or build arguments")
