from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.select import Select


@dataclass(frozen=True)
class PlanlessTask:
    """Matches the tasks placed in no phase of a plan."""

    def statement(self) -> Statement:
        return SubqueryMatch("id", Select("phase_tasks").column("task_id"), negated=True).statement()
