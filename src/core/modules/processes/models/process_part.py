from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.processes.models.enums.part_state import PartState


@dataclass(frozen=True, kw_only=True)
class ProcessPart(Model):
    """One part of a process's line as the runner ran it, with its own end: part of its process."""

    model_name = "process_part"
    cli_name = "process-part"

    process_id: int
    position: int
    text: str
    program: str
    piped: bool = False
    state: PartState = PartState.WAITING
    exit_code: int | None = None
    started_at: Timestamp | None = None
    ended_at: Timestamp | None = None
