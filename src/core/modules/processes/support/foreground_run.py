from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.modules.processes.support.part_command import PartCommand


@dataclass(frozen=True)
class ForegroundRun:
    """How long a line may run in the foreground, whether it goes to the background at once, the reader an
    alias it runs names, whether it waits for a spot in the machine's run queue, whether it only reads,
    which a change of the journal's code does not hold, how many bytes of one part's output stay on disk, and what
    the agent reads of each saved command."""

    seconds: int
    background: bool
    reader_id: int | None = None
    aliases: tuple[str, ...] = ()
    category: CommandCategory | None = None
    queued: bool = False
    read_command: bool = False
    part_commands: tuple[PartCommand, ...] = ()

    count_line: str = ""
    most_output_bytes: int = 0
    read_flags: tuple[str, ...] = ()
    queue_wait_seconds: int = 5
    queue_positions: tuple[int, ...] = ()
