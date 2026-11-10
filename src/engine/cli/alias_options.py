from dataclasses import dataclass

from engine.driver.command_category import CommandCategory


@dataclass(frozen=True)
class AliasOptions:
    """How the shell line of an alias runs when an agent types it: in the background at once or not, the reader
    that reads its output, and the command it starts with, which is how its part of a line is known."""

    background: bool
    reader_id: int | None
    category: CommandCategory | None = None
    command: str = ""

    @property
    def is_long_running(self) -> bool:
        return bool(self.category and self.category.is_long_running)
