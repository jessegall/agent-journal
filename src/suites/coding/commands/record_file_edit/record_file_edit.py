from collections.abc import Mapping
from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.diff_count import DiffCount
from suites.coding.models.file_edit import FileEdit


@dataclass(frozen=True)
class RecordFileEdit(Command[FileEdit]):
    """Records one file an agent edited, wrote or moved, with the lines it added and removed."""

    agent_id: int
    diff: DiffCount
    rows: tuple[Mapping[str, object], ...] = ()
    moved_from: str = ""
