from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.event.updated import Updated
from engine.guard.guard import Guard
from core.modules.plans.models.phase import Phase


class PhaseTestGuard(Guard[Created[Phase] | Updated[Phase]]):
    """Refuses a test command on a phase that is not a checkpoint: tests run at checkpoints, so the command
    of another phase would never run."""

    name = "plans.phase-test-on-checkpoint"

    def check(self, event: Created[Phase] | Updated[Phase], context: Context) -> None:
        if event.row.is_test_refused(event.old_row):
            raise Refusal("only a checkpoint phase has a test of its own", "add --checkpoint")
