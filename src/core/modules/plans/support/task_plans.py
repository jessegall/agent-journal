from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.listener.rows.event_rows import EventRows
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan


class TaskPlans:
    """Shares a task's phase membership and finds its phase and plan."""

    def __init__(self, queries: Queries, rows: EventRows, kept: KeptRows) -> None:
        self.queries, self.rows, self.kept = queries, rows, kept

    def find(self, task_id: int) -> Plan | None:
        phase = self.find_phase(task_id)
        return None if phase is None else self.rows.required(Plan, phase.plan_id)

    def is_started_plan(self, task_id: int) -> bool:
        plan = self.find(task_id)
        return plan is not None and plan.state is PlanState.STARTED

    def find_phase(self, task_id: int) -> Phase | None:
        place = self.kept.read("phase_tasks", self.queries.query(PhaseTask).filter(task_id=task_id).first,
                               "task_id = ?", [task_id], name="plans.task_phase")
        return None if place is None else self.rows.required(Phase, place.phase_id)

    def prepare(self, task_ids: Sequence[int]) -> None:
        distinct_ids = list(dict.fromkeys(task_ids))
        if not distinct_ids:
            return
        rows = self.kept.read("phase_tasks", lambda: tuple(self.queries.query(PhaseTask).matching(Among("task_id", distinct_ids)).all_rows()),
                              f"task_id IN ({', '.join('?' for _ in distinct_ids)})", distinct_ids, name="plans.task_phases")
        places = {place.task_id: place for place in rows}
        for task_id in distinct_ids:
            self.kept.read("phase_tasks", lambda task_id=task_id: places.get(task_id),
                           "task_id = ?", [task_id], name="plans.task_phase")
        phases = self.rows.required_index(Phase, [place.phase_id for place in places.values()])
        self.rows.prepare(Plan, [phase.plan_id for phase in phases.values()])

    def remember(self, place: PhaseTask) -> None:
        self.kept.update("phase_tasks", lambda previous: place, "task_id = ?", [place.task_id], name="plans.task_phase")

    def remove(self, place: PhaseTask) -> None:
        self.kept.update("phase_tasks", lambda previous: None, "task_id = ?", [place.task_id], name="plans.task_phase")
