from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.processes.models.enums.output_state import OutputState


@dataclass(frozen=True)
class KeptOutputPart:
    """Matches process parts of a run whose output is kept and has lines, in one environment when it names one."""

    environment_id: int | None = None

    def statement(self) -> Statement:
        kept = ("process_id IN (SELECT outputs.process_id FROM outputs JOIN processes ON processes.id = outputs.process_id"
                " WHERE outputs.state = ? AND outputs.line_count > 0")
        if self.environment_id is None:
            return Statement(f"{kept})", [OutputState.KEPT.value])
        return Statement(f"{kept} AND processes.environment_id = ?)", [OutputState.KEPT.value, self.environment_id])
