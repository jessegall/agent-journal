from collections.abc import Sequence
from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.processes.models.enums.output_state import OutputState


@dataclass(frozen=True)
class PrunableRun:
    """Matches the named runs that ended before the cutoff and keep no output."""

    process_ids: Sequence[int]
    ended_cutoff: str

    def statement(self) -> Statement:
        marks = ", ".join("?" for _ in self.process_ids)
        return Statement(f"(id IN ({marks}) AND ended_at IS NOT NULL AND ended_at < ? AND id NOT IN "
                         "(SELECT process_id FROM outputs WHERE state = ?))",
                         [*self.process_ids, self.ended_cutoff, OutputState.KEPT.value])
