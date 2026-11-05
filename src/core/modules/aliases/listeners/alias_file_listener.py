from core.base.file_access import FileAccess
from core.base.database.kept_rows import KeptRows
import json
import shlex

from core.base.change.event_log import FILE_PUBLISHING_EVENTS
from core.base.change.logged_event import LoggedEvent
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.models.alias import ARGS_MARK, Alias
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_shell_aliases import AliasShellAliases
from core.base.change.file_publishing import FilePublishing
from core.base.change.touched import Touched
from core.modules.aliases.models.alias import Alias


class AliasFileListener(CommitListener[FilePublishing | Touched[Alias]]):
    """Writes each alias's shell line to a file, since the Go hook classifies a line before it can ask the journal
    anything, and judges an alias by the command under it, and the names of the aliases saved as tests and
    builds.
    It runs ahead of slow listeners, since an agent runs a new alias right after adding it."""

    name = "aliases.alias-file"
    run_order = -1

    def __init__(self, aliases: AliasQuery, home: JournalHome, names: AliasNames, shell_aliases: AliasShellAliases, kept: KeptRows) -> None:
        self.aliases, self.home, self.names, self.shell_aliases = aliases, home, names, shell_aliases
        self.kept = kept

    def handle(self, event: FilePublishing | Touched[Alias], logged: LoggedEvent) -> None:
        commands = self.names.command_names()
        aliases = self.kept.read("aliases", lambda: tuple(self.aliases.all_rows()), name="aliases.file_rows")
        lines = {alias.name: self.line(alias) for alias in aliases if alias.name not in commands}
        self.home.alias_file.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.home.alias_file, json.dumps(lines))
        FileAccess.shared().write(self.home.saved_command_file, json.dumps([alias.name for alias in aliases if alias.name in lines and alias.category and alias.category.is_long_running]))

    def line(self, alias: Alias) -> str:
        line = self.shell_aliases.resolved_line(alias.line)
        if not alias.variables:
            return line
        arguments = line if ARGS_MARK in line else f"{line} {ARGS_MARK}"
        return f"( export {shlex.join(alias.variables)}; {arguments} )"
