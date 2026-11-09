from dataclasses import dataclass
from pathlib import Path

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
    shell_sandbox: bool = False
    folder: Path | None = None
    read_folders: tuple[Path, ...] = ()
    part_commands: tuple[PartCommand, ...] = ()

    count_line: str = ""
    progress_count_line: str = ""
    progress_count_position: int = 0
    progress_count_pattern: str = ""
    most_output_bytes: int = 0
    read_flags: tuple[str, ...] = ()
    queue_wait_seconds: int = 5
    timeout_durations: tuple[str, ...] = ()
    counted_queue: bool = False

    @classmethod
    def queued_background(cls) -> "ForegroundRun":
        return cls(0, True, queued=True)
