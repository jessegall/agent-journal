from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.plans.commands.record_checkpoints.record_checkpoints import RecordCheckpoints
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class CheckpointReachListener(CommitListener[Moved[Task]]):
    """A task of a started plan that is closed or cancelled may complete the window of a checkpoint: the
    checkpoints of its plan are looked at once for the closed tasks of one commit."""

    name = "plans.checkpoint-reach"
    moves = (TaskLifecycle.close, TaskLifecycle.cancel)
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries
        self.places = dict[int, PlanTask]()
        self.recorded_plan_ids = set[int]()

    def prepare(self, events: Sequence[LoggedEvent]) -> None:
        places = tuple(self.queries.query(PlanTask).matching(Among("task_id", [event.row_id for event in events])).all_rows())
        plans = {plan.id: plan for plan in self.queries.query(Plan).find_many(sorted({place.plan_id for place in places}))}
        self.places = {place.task_id: place for place in places if plans[place.plan_id].state is PlanState.STARTED}
        self.recorded_plan_ids = set()

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        place = self.places.get(event.row.id)
        if place is None or place.plan_id in self.recorded_plan_ids:
            return
        self.recorded_plan_ids.add(place.plan_id)
        self.bus.run(RecordCheckpoints(place.plan_id), Actor.core(), cause_id=logged.id)
