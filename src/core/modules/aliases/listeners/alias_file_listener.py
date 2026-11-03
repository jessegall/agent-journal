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

ALIAS_EVENT_PREFIX = "alias."


class AliasFileListener(CommitListener):
    """Writes each alias's shell line to a file, since the Go hook classifies a line before it can ask the journal
    anything, and judges an alias by the command under it."""

    name = "aliases.alias-file"
    event = "*.*"

    def __init__(self, aliases: AliasQuery, home: JournalHome, names: AliasNames, shell_aliases: AliasShellAliases) -> None:
        self.aliases, self.home, self.names, self.shell_aliases = aliases, home, names, shell_aliases

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in FILE_PUBLISHING_EVENTS and not event.event.startswith(ALIAS_EVENT_PREFIX):
            return
        commands = self.names.command_names()
        lines = {alias.name: self.line(alias) for alias in self.aliases.all_rows() if alias.name not in commands}
        self.home.alias_file.write_text(json.dumps(lines))

    def line(self, alias: Alias) -> str:
        line = self.shell_aliases.line_from_any_folder(alias.line)
        if not alias.variables:
            return line
        arguments = line if ARGS_MARK in line else f"{line} {ARGS_MARK}"
        return f"( export {shlex.join(alias.variables)}; {arguments} )"
