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
from core.modules.aliases.support.alias_access import AliasAccess

JOURNAL_FOLDER_PREFIX = ".journal/"


class AliasShellAliases(ShellAliases):
    """Expands aliases with quoted arguments, declared access and paths from the journal folder."""

    def __init__(self, aliases: AliasQuery, access: AliasAccess, names: AliasNames, home: JournalHome) -> None:
        self.aliases, self.access, self.names, self.home = aliases, access, names, home

    def shell_run(self, argv: list[str], caller: Caller, request: CallerRequest) -> ShellRun | None:
        alias = self.alias(argv[0]) if argv else None
        if alias is None:
            return None
        self.access.check(alias, caller)
        return ShellRun(self.resolved_line(alias.shell_line(argv[1:])), {**request.variables, **alias.variable_values()}, request.folder)

    def resolved_line(self, line: str) -> str:
        return f"{shlex.quote(str(self.home.folder.resolve()))}/{line.removeprefix(JOURNAL_FOLDER_PREFIX)}" if line.startswith(JOURNAL_FOLDER_PREFIX) else line

    def options(self, name: str) -> AliasOptions | None:
        alias = self.alias(name)
        return AliasOptions(alias.background, alias.reader_id, alias.category, self.resolved_line(alias.shell_line([])).strip()) if alias else None

    def named_line(self, argv: list[str]) -> str | None:
        alias = self.alias(argv[0]) if argv else None
        return alias.shell_line(argv[1:]) if alias else None

    def alias(self, name: str) -> Alias | None:
        if name in self.names.command_names():
            return None
        return self.aliases.saved(name)
