from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.watch import Watch


@dataclass(frozen=True)
class MarkWatchSeen(Command[Watch]):
    """Notes how many lines of the run the watch has been given."""

    watch_id: int
    seen_lines: int
