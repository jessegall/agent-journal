from dataclasses import dataclass

from engine.model.model import Model
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState


RUNNING_STATES = (AffectedTestState.PICKING, AffectedTestState.TESTING)


@dataclass(frozen=True, kw_only=True)
class CheckpointTest(Model):
    """A test the run of a reached checkpoint makes beside the proofs of its window: the checkpoint's own
    test, which has no picker, or the selected run over the files the window changed, whose picker runs
    first. Its process is owned by the agent named here."""

    model_name = "checkpoint_test"
    cli_name = "checkpoint-test"
    shared_rows = True

    reach_id: int
    owner_agent_id: int
    picker_command: str = ""
    test_command: str
    state: AffectedTestState
    process_id: int
