from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.moved import Moved
from engine.guard.guard import Guard
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle


class CheckpointRunGuard(Guard[Moved[CheckpointReach]]):
    """Refuses an agent that ends the run of a checkpoint: the journal ends it with the result of the tests, or
    a user does."""

    name = "plans.checkpoint-run"
    moves = (CheckpointLifecycle.passed, CheckpointLifecycle.failed)

    def check(self, event: Moved[CheckpointReach], context: Context) -> None:
        if context.actor.is_agent():
            raise Refusal(f"the run of checkpoint reach {event.row.id} is ended by the journal, with the result of its tests",
                          f"read how it stands with journal plan outline {event.row.plan_id}")
