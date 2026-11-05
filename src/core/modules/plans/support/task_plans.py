from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.models.plan import Plan


class TaskPlans:
    """Shares a task's phase membership and finds its plan."""

    def __init__(self, queries: Queries, rows: EventRows, kept: KeptRows) -> None:
        self.queries, self.rows, self.kept = queries, rows, kept

    def find(self, task_id: int) -> Plan | None:
        place = self.kept.read("phase_tasks", self.queries.query(PhaseTask).filter(task_id=task_id).first,
                               "task_id = ?", [task_id], name="plans.task_phase")
        if place is None:
            return None
        phase = self.rows.required(Phase, place.phase_id)
        return self.rows.required(Plan, phase.plan_id)

    def remember(self, place: PhaseTask) -> None:
        self.kept.update("phase_tasks", lambda previous: place, "task_id = ?", [place.task_id], name="plans.task_phase")

    def remove(self, place: PhaseTask) -> None:
        self.kept.update("phase_tasks", lambda previous: None, "task_id = ?", [place.task_id], name="plans.task_phase")
