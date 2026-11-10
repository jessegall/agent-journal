from typing import Self

from core.base.database.database import Database
from engine.model.tables import Tables
from engine.query.query import Query
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.conditions.watch_progress_due import WatchProgressDue


class WatchQuery(Query[Watch]):
    """Reads watches, with the filters the processes module and its rules use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Watch)

    def open(self, agent_id: int) -> Self:
        return self.filter(session_agent_id=agent_id, state=WatchState.OPEN)

    def process(self, process_id: int) -> Self:
        return self.filter(process_id=process_id)

    def progress_due(self, agent_id: int, step_percent: int) -> Self:
        return self.open(agent_id).matching(WatchProgressDue(step_percent))
