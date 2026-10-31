from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.diff_count import DiffCount
from suites.coding.models.file_edit import FileEdit


@dataclass(frozen=True)
class FileEditRecord(Command[FileEdit]):
    """Records one file an agent edited or wrote, with the lines it added and removed."""

    agent_id: int
    environment_id: int
    diff: DiffCount
