from dataclasses import dataclass
from engine.driver.command_category import CommandCategory


@dataclass(frozen=True)
class PartCommand:
    """The command a part runs and the reader its alias names."""

    command: str
    category: CommandCategory
    named_reader_id: int | None = None
