from collections.abc import Sequence
from typing import Self
from datetime import timedelta

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
from core.base.query.conditions.maximum import Maximum
from engine.time.timestamp import Timestamp
from core.modules.processes.queries.conditions.long_run_candidate import LongRunCandidate
from core.modules.processes.queries.conditions.part_run_seconds import PartRunSeconds

OPEN = (ProcessState.RUNNING, ProcessState.BACKGROUND)
PROCESS_PARTS_TABLE = "process_parts"


class ProcessQuery(Query[Process]):
    """Reads processes, with the filters the processes module and its rules use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Process)

    def running(self) -> Self:
        return self.matching(Among("state", OPEN))

    def agent(self, agent_id: int) -> Self:
        return self.filter(session_agent_id=agent_id)

    def agent_started(self, agent_id: int) -> Self:
        return self.filter(session_agent_id=agent_id, creator_id=agent_id)

    def ended(self) -> Self:
        return self.matching(Among("state", [state for state in ProcessState if state not in OPEN]))

    def with_part(self, *conditions: Condition) -> Self:
        select = Select(PROCESS_PARTS_TABLE)
        for condition in conditions:
            select = select.matching(condition)
        return self.matching(SubqueryMatch("id", select.column("process_id")))

    def moved(self) -> Self:
        return self.matching(Greater("moved_at", ""))

    def minimum_age(self, present: Timestamp, seconds: int) -> Self:
        cutoff = Timestamp(present.value - timedelta(seconds=seconds))
        return self.matching(Maximum("created_at", cutoff.text))

    def long_run_candidates(self, present: Timestamp, seconds: int) -> Self:
        cutoff = Timestamp(present.value - timedelta(seconds=seconds))
        return self.matching(LongRunCandidate(cutoff.text))

    def has_moved_run(self, texts: Sequence[str], seconds: int = 0) -> bool:
        conditions: list[Condition] = [Among("text", tuple(texts))]
        if seconds > 0:
            conditions.append(PartRunSeconds(seconds))
        return self.with_part(*conditions).moved().exists()
