from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.condition import Condition
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.query import Query
from core.base.query.select import Select
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process

OPEN = (ProcessState.RUNNING, ProcessState.BACKGROUND)
PROCESS_PARTS_TABLE = "process_parts"


class ProcessQuery(Query[Process]):
    """Reads processes, with the filters the processes module and its rules use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Process)

    def environment(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def running(self) -> Self:
        return self.matching(Among("state", OPEN))

    def agent(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)

    def ended(self) -> Self:
        return self.matching(Among("state", [state for state in ProcessState if state not in OPEN]))

    def with_part(self, condition: Condition) -> Self:
        return self.matching(SubqueryMatch("id", Select(PROCESS_PARTS_TABLE).matching(condition).column("process_id")))

    def moved(self) -> Self:
        return self.matching(Greater("moved_at", ""))
