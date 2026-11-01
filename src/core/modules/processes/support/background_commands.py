from core.base.cli.alias_options import AliasOptions
from core.base.cli.shell_aliases import ShellAliases
from core.base.driver.shell_line import ShellLine

JOURNAL = "journal"


class BackgroundCommands:
    """How each alias a line runs is run, and whether one is marked to go to the background at once; a journal
    command of its own never goes there."""

    def __init__(self, aliases: ShellAliases) -> None:
        self.aliases = aliases

    def includes(self, shell: ShellLine) -> bool:
        return any(options.background for options in self.alias_runs(shell))

    def alias_names(self, shell: ShellLine) -> tuple[str, ...]:
        return tuple(part.arguments[0] for part in shell.parts if part.program == JOURNAL and part.arguments and self.aliases.options(part.arguments[0]) is not None)

    def alias_runs(self, shell: ShellLine) -> list[AliasOptions]:
        runs = [self.aliases.options(part.arguments[0]) for part in shell.parts if part.program == JOURNAL and part.arguments]
        return [options for options in runs if options is not None]
