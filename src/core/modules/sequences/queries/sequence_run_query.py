from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from engine.query.conditions.is_null import IsNull
from engine.query.query import Query
from core.modules.sequences.models.sequence_run import SequenceRun


class SequenceRunQuery(Query[SequenceRun]):
    """Reads sequence runs, with the one on top of an agent's stack of open runs."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, SequenceRun)
        self.kept = kept

    def has_open_run(self, sequence_id: int) -> bool:
        return self.filter(sequence_id=sequence_id).matching(IsNull("ended_at")).exists()

    def open_runs(self, agent_id: int) -> tuple[SequenceRun, ...]:
        query = self.filter(session_agent_id=agent_id).matching(IsNull("ended_at")).oldest()
        return self.kept.read(self.table.name, lambda: tuple(query.all_rows()), "session_agent_id = ? AND ended_at IS NULL", [agent_id], name="sequences.open_runs")

    def is_running(self, agent_id: int, sequence_id: int) -> bool:
        return any(run.sequence_id == sequence_id for run in self.open_runs(agent_id))

    def current(self, agent_id: int) -> SequenceRun | None:
        return next(iter(reversed(self.open_runs(agent_id))), None)
