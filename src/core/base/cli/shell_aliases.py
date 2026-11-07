from core.base.caller.caller import Caller
from core.base.caller.caller_request import CallerRequest
from core.base.cli.alias_options import AliasOptions
from core.base.cli.shell_run import ShellRun


class ShellAliases:
    """The shell lines a project names by words of its own; the core knows none, and a module that keeps them
    binds its own class in this one's place."""

    def shell_run(self, argv: list[str], caller: Caller, request: CallerRequest) -> ShellRun | None:
        return None

    def options(self, name: str) -> AliasOptions | None:
        return None

    def named_line(self, argv: list[str]) -> str | None:
        return None
