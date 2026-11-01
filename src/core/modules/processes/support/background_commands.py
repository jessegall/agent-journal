from core.base.cli.alias_options import AliasOptions
from core.base.cli.shell_aliases import ShellAliases
from core.base.driver.shell_line import ShellLine
from core.base.registry.registry import Registry

JOURNAL = "journal"


class BackgroundCommands:
    """Whether a line runs a journal command that its module's subcommand marks as a background one, such as
    worker merge, or an alias marked so: it goes to the background at once, where every other journal command
    stays in the foreground; and how each alias the line runs is run."""

    def __init__(self, registry: Registry, aliases: ShellAliases) -> None:
        self.registry, self.aliases = registry, aliases

    def includes(self, shell: ShellLine) -> bool:
        is_command = any(self.is_background(part.arguments) for part in shell.parts if part.program == JOURNAL)
        return is_command or any(options.background for options in self.alias_runs(shell))

    def alias_runs(self, shell: ShellLine) -> list[AliasOptions]:
        runs = [self.aliases.options(part.arguments[0]) for part in shell.parts if part.program == JOURNAL and part.arguments]
        return [options for options in runs if options is not None]

    def is_background(self, arguments: tuple[str, ...]) -> bool:
        if len(arguments) < 2:
            return False
        subcommand_name = arguments[2] if arguments[1].isdigit() and len(arguments) > 2 else arguments[1]
        entry = self.registry.subcommands.get(f"{arguments[0]} {subcommand_name}")
        if entry is None:
            return False
        subcommand = entry.loaded()
        return getattr(subcommand, "background", False) is True
