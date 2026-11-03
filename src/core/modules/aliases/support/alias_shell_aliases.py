import shlex

from core.base.caller.caller import Caller
from core.base.caller.caller_request import CallerRequest
from core.base.cli.alias_options import AliasOptions
from core.base.cli.shell_aliases import ShellAliases
from core.base.cli.shell_run import ShellRun
from core.base.journal_home import JournalHome
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_workers import AliasWorkers

JOURNAL_FOLDER_PREFIX = ".journal/"


class AliasShellAliases(ShellAliases):
    """The shell line of the alias a command line's first word names, with the caller's variables and the
    alias's own over them, to run in the caller's folder; a line that starts in the journal's own folder is
    given that folder's whole path, since a worker's worktree has none of its own; a journal command of the
    same name always wins, so an alias version 4 had under a name version 5 now uses is never run in its
    place."""

    def __init__(self, aliases: AliasQuery, workers: AliasWorkers, names: AliasNames, home: JournalHome) -> None:
        self.aliases, self.workers, self.names, self.home = aliases, workers, names, home

    def shell_run(self, argv: list[str], caller: Caller, request: CallerRequest) -> ShellRun | None:
        alias = self.alias(argv[0]) if argv else None
        if alias is None:
            return None
        self.workers.check(alias, caller)
        return ShellRun(self.resolved_line(alias.shell_line(argv[1:])), {**request.variables, **alias.variable_values()}, request.folder)

    def resolved_line(self, line: str) -> str:
        return f"{shlex.quote(str(self.home.folder.resolve()))}/{line.removeprefix(JOURNAL_FOLDER_PREFIX)}" if line.startswith(JOURNAL_FOLDER_PREFIX) else line

    def options(self, name: str) -> AliasOptions | None:
        alias = self.alias(name)
        return AliasOptions(alias.background, alias.reader_id, alias.category) if alias else None

    def named_line(self, argv: list[str]) -> str | None:
        alias = self.alias(argv[0]) if argv else None
        return alias.shell_line(argv[1:]) if alias else None

    def alias(self, name: str) -> Alias | None:
        rows = self.aliases.with_name(name).page(1, 1).rows if name not in self.names.command_names() else ()
        return rows[0] if rows else None
