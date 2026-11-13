from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.condition import Condition
from engine.query.conditions.among import Among
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.join import Join
from engine.query.select import Select


def placed_tasks(condition: Condition) -> Select:
    """The places of tasks in phases, with the phase of each joined, matching the condition."""
    return Select("phase_tasks").joined(Join("phases", False, "phases.id", "=", "phase_tasks.phase_id")).matching(condition)


def plan_task_ids(plan_ids: Sequence[int] | Select) -> SubqueryMatch:
    """Matches the tasks placed in the given plans, named by their ids or by a select of their ids."""
    plans = SubqueryMatch("phases.plan_id", plan_ids) if isinstance(plan_ids, Select) else Among("phases.plan_id", list(plan_ids))
    return SubqueryMatch("id", placed_tasks(plans).column("phase_tasks.task_id"))


@dataclass(frozen=True)
class SharedPlanTasks:
    """Matches the tasks of every plan that holds one of the given tasks."""

    task_ids: tuple[int, ...]

    def statement(self) -> Statement:
        plan_ids = placed_tasks(Among("phase_tasks.task_id", list(self.task_ids))).column("phases.plan_id")
        return plan_task_ids(plan_ids).statement()
