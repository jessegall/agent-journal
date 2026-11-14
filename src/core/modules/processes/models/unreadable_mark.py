from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason


@dataclass(frozen=True, kw_only=True)
class UnreadableMark(Model):
    """A command, by its leading words, whose output no reader can read, and why; a lifted mark keeps who lifted it
    and when."""

    model_name = "unreadable_mark"
    cli_name = "unreadable-mark"

    creator_id: int
    terms: str
    reason: UnreadableReason
    note: str = ""
    lifter_id: int | None = None
    lifted_at: Timestamp | None = None
