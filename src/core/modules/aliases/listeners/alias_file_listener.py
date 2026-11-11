from engine.file.file_access import FileAccess
from engine.database.kept_rows import KeptRows
import json
import shlex

from engine.event.logged_event import LoggedEvent
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener import CommitListener
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.models.alias import ARGS_MARK, Alias
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_shell_aliases import AliasShellAliases
from engine.event.file_publishing import FilePublishing
from engine.event.touched import Touched
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.models.command_type import CommandType
from engine.query.queries import Queries


class AliasFileListener(CommitListener[FilePublishing | Touched[Alias] | Touched[CommandType]]):
    """Writes each alias's shell line to a file, since the Go hook classifies a line before it can ask the
    journal anything, and judges an alias by the command under it, the names of the aliases saved as tests
    and builds, and the category of each alias, which the hook gives a command it cannot classify itself,
    and the types agents gave such commands by their leading words. It runs ahead of slow listeners, since
    an agent runs a new alias right after adding it."""

    name = "aliases.alias-file"
    run_order = -1

    def __init__(self, aliases: AliasQuery, home: JournalHome, names: AliasNames, shell_aliases: AliasShellAliases, kept: KeptRows, queries: Queries) -> None:
        self.aliases, self.home, self.names, self.shell_aliases, self.queries = aliases, home, names, shell_aliases, queries
        self.kept = kept

    def handle(self, event: FilePublishing | Touched[Alias] | Touched[CommandType], logged: LoggedEvent) -> None:
        commands = self.names.command_names()
        aliases = self.kept.read("aliases", lambda: tuple(self.aliases.all_rows()), name="aliases.file_rows")
        lines = {alias.name: self.line(alias) for alias in aliases if alias.name not in commands}
        self.home.alias_file.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.home.alias_file, json.dumps(lines))
        FileAccess.shared().write(self.home.saved_command_file, json.dumps([alias.name for alias in aliases if alias.name in lines and alias.category and alias.category.is_long_running]))
        FileAccess.shared().write(self.home.alias_category_file, json.dumps({alias.name: alias.category.value for alias in aliases if alias.name in lines and alias.category}))
        types = self.kept.read("command_types", lambda: tuple(self.queries.query(CommandType).all_rows()), name="aliases.command_types")
        FileAccess.shared().write(self.home.command_type_file, json.dumps({command_type.words: command_type.category.value for command_type in types}))

    def line(self, alias: Alias) -> str:
        line = self.shell_aliases.resolved_line(alias.line)
        if not alias.variables:
            return line
        arguments = line if ARGS_MARK in line else f"{line} {ARGS_MARK}"
        return f"( export {shlex.join(alias.variables)}; {arguments} )"
