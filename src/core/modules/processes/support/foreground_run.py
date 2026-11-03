from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory


@dataclass(frozen=True)
class ForegroundRun:
    """How long a line may run in the foreground, whether it goes to the background at once, the reader an
    alias it runs names, and whether it waits for a spot in the machine's run queue."""

    seconds: int
    background: bool
    reader_id: int | None = None
    aliases: tuple[str, ...] = ()
    category: CommandCategory | None = None
    queued: bool = False
