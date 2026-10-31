from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.modules.sequences.models.sequence_run import SequenceRun


class SequenceRunQuery(Query[SequenceRun]):
    """Reads sequence runs, with the one an agent is on now."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, SequenceRun)

    def current(self, agent_id: int) -> SequenceRun | None:
        return next(iter(self.filter(agent_id=agent_id).matching(IsNull("ended_at")).newest().page(1, 1).rows), None)
