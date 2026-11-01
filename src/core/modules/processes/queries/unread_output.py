from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.processes.models.enums.output_state import OutputState


@dataclass(frozen=True)
class UnreadOutput:
    """Matches the runs that have a kept output nobody has read."""

    def statement(self) -> Statement:
        return Statement("id IN (SELECT process_id FROM outputs WHERE state = ? AND read_at IS NULL)", [OutputState.KEPT.value])
