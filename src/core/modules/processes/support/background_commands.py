from engine.cli.alias_options import AliasOptions
from engine.cli.shell_aliases import ShellAliases
from core.base.driver.command_category import CommandCategory
from core.base.driver.part import Part
from core.base.driver.shell_line import ShellLine
from engine.registry.registry import Registry
from core.modules.processes.support.part_command import PartCommand

JOURNAL = "journal"


class BackgroundCommands:
    """How each alias a line runs is run, and whether the line goes to the background at once: an alias marked so,
    or a journal command whose subcommand declares it."""

    def __init__(self, aliases: ShellAliases, registry: Registry) -> None:
        self.aliases, self.registry = aliases, registry

    def includes(self, shell: ShellLine) -> bool:
        declared = any(" ".join(part.arguments[:2]) in self.registry.background_lines for part in shell.parts_running_journal_command())
        return declared or any(options.background for options in self.alias_runs(shell))

    def part_command(self, part: Part, shell: ShellLine) -> PartCommand:
        argv = list(part.arguments) if part.program == JOURNAL else []
        options = self.aliases.options(argv[0]) if argv else self.expanded_alias(part, shell)
        category = options.category if options is not None and options.category is not None else part.classification.category
        return PartCommand(self.aliases.named_line(argv) or part.text, category, options.reader_id if options else None)

    def expanded_alias(self, part: Part, shell: ShellLine) -> AliasOptions | None:
        return next((options for options in self.alias_runs(shell) if options.command in part.text), None)

    def is_long_alias(self, part: Part, shell: ShellLine) -> bool:
        return any(options.is_long_running and part.text.startswith(options.command) for options in self.alias_runs(shell))

    def alias_names(self, shell: ShellLine) -> tuple[str, ...]:
        return shell.all_alias_names(lambda name: self.aliases.options(name) is not None)

    def alias_runs(self, shell: ShellLine) -> list[AliasOptions]:
        runs = [self.aliases.options(name) for name in self.alias_names(shell)]
        return [options for options in runs if options is not None]

    def declared_category(self, shell: ShellLine) -> CommandCategory | None:
        return next((options.category for options in self.alias_runs(shell) if options.category), None)
