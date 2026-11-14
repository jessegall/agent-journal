from collections.abc import Sequence

from engine.event.logged_event import LoggedEvent
from core.modules.plans.support.task_plans import TaskPlans


class TaskPlanPreparation:
    """Reads the phase and the plan of every task of a batch of events in one read, for a listener on moved
    tasks that asks for the plan of each."""

    plans: TaskPlans

    def prepare(self, events: Sequence[LoggedEvent]) -> None:
        self.plans.prepare([event.row_id for event in events])
