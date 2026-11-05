from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.modules.sequences.models.sequence_run import SequenceRun


class SequenceRunQuery(Query[SequenceRun]):
    """Reads sequence runs, with the one an agent is on now."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, SequenceRun)
        self.kept = kept

    def has_open_run(self, sequence_id: int) -> bool:
        return self.filter(sequence_id=sequence_id).matching(IsNull("ended_at")).exists()

    def current(self, agent_id: int) -> SequenceRun | None:
        query = self.filter(agent_id=agent_id).matching(IsNull("ended_at")).newest()
        return self.kept.read(self.table.name, query.first, "agent_id = ? AND ended_at IS NULL", [agent_id], name="sequences.current_run")
