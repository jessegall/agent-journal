from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from core.modules.plans.models.enums.checkpoint_state import CheckpointState


class CheckpointLifecycle(Lifecycle):
    """A reached checkpoint runs its tests until they pass or fail; a reach that ended is never changed."""

    states = CheckpointState
    initial = [CheckpointState.RUNNING]
    editable = ()
    deletable = ()

    passed = Move("passed", [CheckpointState.RUNNING], CheckpointState.PASSED)
    failed = Move("failed", [CheckpointState.RUNNING], CheckpointState.FAILED)
