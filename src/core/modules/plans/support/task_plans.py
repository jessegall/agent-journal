from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.listener.rows.event_rows import EventRows
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan

TASK_PLACES_REASON = "the phase of every task asked about is kept for the request"



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
        places = self.task_places(task_id)
        place = self.kept.read(places, places.first, name="plans.task_phase")
        return None if place is None else self.rows.required(Phase, place.phase_id)

    def prepare(self, task_ids: Sequence[int]) -> None:
        distinct_ids = list(dict.fromkeys(task_ids))
        if not distinct_ids:
            return
        among = self.queries.query(PhaseTask).matching(Among("task_id", distinct_ids))
        rows = self.kept.read(among, lambda: tuple(among.every_row(TASK_PLACES_REASON)), name="plans.task_phases")
        places = {place.task_id: place for place in rows}
        for task_id in distinct_ids:
            self.kept.read(self.task_places(task_id), lambda task_id=task_id: places.get(task_id), name="plans.task_phase")
        phases = self.rows.required_index(Phase, [place.phase_id for place in places.values()])
        self.rows.prepare(Plan, [phase.plan_id for phase in phases.values()])

    def remember(self, place: PhaseTask) -> None:
        self.kept.update(self.task_places(place.task_id), lambda previous: place, name="plans.task_phase")

    def remove(self, place: PhaseTask) -> None:
        self.kept.update(self.task_places(place.task_id), lambda previous: None, name="plans.task_phase")

    def task_places(self, task_id: int) -> Query[PhaseTask]:
        return self.queries.query(PhaseTask).filter(task_id=task_id)
