from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.driver.shell_line import JOURNAL_PROGRAM
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.part_state import PartState


@dataclass(frozen=True, kw_only=True)
class ProcessPart(Model):
    """One part of a process's line as the runner ran it, with its own end: part of its process."""

    model_name = "process_part"
    events_expire = True
    cli_name = "process-part"

    process_id: int
    position: int
    text: str
    program: str
    command: str = ""
    piped: bool = False
    category: CommandCategory = CommandCategory.UNKNOWN
    is_visible: bool = False
    reader_request_id: int | None = None
    state: PartState = PartState.WAITING
    exit_code: int | None = None
    started_at: Timestamp | None = None
    ended_at: Timestamp | None = None

    @property
    def saved_command(self) -> str:
        return self.text.split()[1] if self.program == JOURNAL_PROGRAM and self.category.is_long_running else ""
