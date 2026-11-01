from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory


@dataclass(frozen=True)
class AliasOptions:
    """How the shell line of an alias runs when an agent types it: in the background at once or not, and the
    reader that reads its output."""

    background: bool
    reader_id: int | None
    category: CommandCategory | None = None
