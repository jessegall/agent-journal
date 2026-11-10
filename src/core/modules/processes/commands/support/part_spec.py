from dataclasses import dataclass

from engine.driver.command_category import CommandCategory


@dataclass(frozen=True)
class PartSpec:
    """One command of a shell line as StartProcess keeps it: its text, its program, whether it pipes into
    the next, and what type of command it is."""

    text: str
    program: str
    piped: bool = False
    category: CommandCategory = CommandCategory.UNKNOWN
    command: str = ""
    named_reader_id: int | None = None
    command_key: str = ""

