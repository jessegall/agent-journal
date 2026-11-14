from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.plans.commands.record_checkpoints.record_checkpoints import RecordCheckpoints
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan


class StartedPlanCheckpointsListener(CommitListener[Moved[Plan]]):
    """A plan that starts has its checkpoints looked at once: a checkpoint with no task has nothing to wait
    for and passes at the start."""

    name = "plans.started-plan-checkpoints"
    moves = tuple([PlanLifecycle.start])
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[Plan], logged: LoggedEvent) -> None:
        self.bus.run(RecordCheckpoints(event.row.id), Actor.core(), cause_id=logged.id)
