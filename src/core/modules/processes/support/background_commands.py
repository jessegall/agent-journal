from core.base.cli.alias_options import AliasOptions
from core.base.cli.shell_aliases import ShellAliases
from core.base.driver.command_category import CommandCategory
from core.base.driver.part import Part
from core.base.driver.shell_line import ShellLine
from core.modules.processes.support.part_command import PartCommand

JOURNAL = "journal"


class BackgroundCommands:
    """How each alias a line runs is run, and whether one is marked to go to the background at once; a journal
    command of its own never goes there."""

    def __init__(self, aliases: ShellAliases) -> None:
        self.aliases = aliases

    def includes(self, shell: ShellLine) -> bool:
        return any(options.background for options in self.alias_runs(shell))

    def part_command(self, part: Part) -> PartCommand:
        argv = list(part.arguments) if part.program == JOURNAL else []
        options = self.aliases.options(argv[0]) if argv else None
        return PartCommand(self.aliases.named_line(argv) or part.text, options.reader_id if options else None)

    def alias_names(self, shell: ShellLine) -> tuple[str, ...]:
        return tuple(part.arguments[0] for part in shell.parts if part.program == JOURNAL and part.arguments and self.aliases.options(part.arguments[0]) is not None)

    def alias_runs(self, shell: ShellLine) -> list[AliasOptions]:
        runs = [self.aliases.options(part.arguments[0]) for part in shell.parts if part.program == JOURNAL and part.arguments]
        return [options for options in runs if options is not None]

    def declared_category(self, shell: ShellLine) -> CommandCategory | None:
        return next((options.category for options in self.alias_runs(shell) if options.category), None)
