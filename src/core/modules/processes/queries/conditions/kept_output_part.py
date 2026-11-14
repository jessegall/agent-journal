from dataclasses import dataclass

from engine.database.statement import Statement
from core.modules.processes.models.enums.output_state import OutputState
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.conditions.greater import Greater
from engine.query.conditions.equal import Equal
from engine.query.join import Join
from engine.query.select import Select


@dataclass(frozen=True)
class KeptOutputPart:
    """Matches process parts of a run whose output is kept and has lines, in one environment when it names one."""

    environment_id: int | None = None

    def statement(self) -> Statement:
        kept = Select("outputs").joined(Join("processes", False, "processes.id", "=", "outputs.process_id")).matching(Equal("outputs.state", OutputState.KEPT.value)).matching(Greater("outputs.line_count", 0))
        if self.environment_id is not None:
            kept = kept.matching(Equal("processes.environment_id", self.environment_id))
        return SubqueryMatch("process_id", kept.column("outputs.process_id")).statement()
