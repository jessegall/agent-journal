from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.plans.phase import Phase
from core.modules.plans.phase_task import PhaseTask
from core.modules.tasks.task import Task


class PlanTasks:
    """The tasks of a plan in the order they are done: by their phase's place, then their own place in it."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def ordered(self, plan_id: int) -> list[Task]:
        phases = {phase.id: phase.position for phase in self.queries.query(Phase).filter(plan_id=plan_id).all_rows()}
        places = list(self.queries.query(PhaseTask).matching(Among("phase_id", tuple(phases))).all_rows())
        places.sort(key=lambda place: (phases[place.phase_id], place.position))
        tasks = {task.id: task for task in self.queries.query(Task).matching(Among("id", tuple(place.task_id for place in places))).all_rows()}
        return [tasks[place.task_id] for place in places]

    def plan_id(self, task_id: int) -> int | None:
        places = self.queries.query(PhaseTask).filter(task_id=task_id).page(1, 1).rows
        if not places:
            return None
        return self.queries.query(Phase).find(places[0].phase_id).plan_id
