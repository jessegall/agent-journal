from core.base.caller.caller import Caller
from core.base.caller.caller_request import CallerRequest
from core.base.cli.alias_options import AliasOptions
from core.base.cli.shell_aliases import ShellAliases
from core.base.cli.shell_run import ShellRun
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_workers import AliasWorkers


class AliasShellAliases(ShellAliases):
    """The shell line of the alias a command line's first word names, with the caller's variables and the
    alias's own over them, to run in the caller's folder."""

    def __init__(self, aliases: AliasQuery, workers: AliasWorkers) -> None:
        self.aliases, self.workers = aliases, workers

    def shell_run(self, argv: list[str], caller: Caller, request: CallerRequest) -> ShellRun | None:
        rows = self.aliases.with_name(argv[0]).page(1, 1).rows if argv else ()
        if not rows:
            return None
        alias = rows[0]
        self.workers.check(alias, caller)
        return ShellRun(alias.shell_line(argv[1:]), {**request.variables, **alias.variable_values()}, request.folder)

    def options(self, name: str) -> AliasOptions | None:
        rows = self.aliases.with_name(name).page(1, 1).rows
        return AliasOptions(rows[0].background, rows[0].reader_id) if rows else None
