from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory


@dataclass(frozen=True)
class ForegroundRun:
    """How long a line may run in the foreground, whether it goes to the background at once, the reader an
    alias it runs names, whether it waits for a spot in the machine's run queue, and whether it only reads, which
    a change of the journal's code does not hold."""

    seconds: int
    background: bool
    reader_id: int | None = None
    aliases: tuple[str, ...] = ()
    category: CommandCategory | None = None
    queued: bool = False
    only_reads: bool = False
