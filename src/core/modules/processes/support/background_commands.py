from core.base.driver.shell_line import ShellLine
from core.base.registry.registry import Registry

JOURNAL = "journal"


class BackgroundCommands:
    """Whether a line runs a journal command that its module's subcommand marks as a background one, such as
    worker merge: it goes to the background at once, where every other journal command stays in the
    foreground."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def includes(self, shell: ShellLine) -> bool:
        return any(self.is_background(part.arguments) for part in shell.parts if part.program == JOURNAL)

    def is_background(self, arguments: tuple[str, ...]) -> bool:
        if len(arguments) < 2:
            return False
        subcommand_name = arguments[2] if arguments[1].isdigit() and len(arguments) > 2 else arguments[1]
        entry = self.registry.subcommands.get(f"{arguments[0]} {subcommand_name}")
        if entry is None:
            return False
        subcommand = entry.loaded()
        return getattr(subcommand, "background", False) is True
