from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select


@dataclass(frozen=True)
class PlanlessTask:
    """Matches the tasks placed in no phase of a plan."""

    def statement(self) -> Statement:
        return SubqueryMatch("id", Select("phase_tasks").column("task_id"), negated=True).statement()
