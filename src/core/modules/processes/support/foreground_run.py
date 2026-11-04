from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.modules.processes.support.part_command import PartCommand


@dataclass(frozen=True)
class ForegroundRun:
    """The foreground limit, queue options, output limits and saved-command options for a shell line."""

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
    timeout_durations: tuple[str, ...] = ()
