from dataclasses import dataclass

from engine.database.statement import Statement

TASK_PLAN_IDS = "SELECT phases.plan_id FROM phase_tasks JOIN phases ON phases.id = phase_tasks.phase_id WHERE phase_tasks.task_id IN ({marks})"
PLAN_TASK_IDS = "id IN (SELECT phase_tasks.task_id FROM phase_tasks JOIN phases ON phases.id = phase_tasks.phase_id WHERE phases.plan_id IN ({plan_ids}))"


@dataclass(frozen=True)
class SharedPlanTasks:
    """Matches the tasks of every plan that holds one of the given tasks."""

    task_ids: tuple[int, ...]

    def statement(self) -> Statement:
        plan_id_select = TASK_PLAN_IDS.format(marks=", ".join("?" for _ in self.task_ids))
        return Statement(PLAN_TASK_IDS.format(plan_ids=plan_id_select), list(self.task_ids))
