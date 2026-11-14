from dataclasses import dataclass

from engine.model.model import Model
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState


@dataclass(frozen=True, kw_only=True)
class AffectedTest(Model):
    """The picker and selected test run for one worker hand-in."""

    model_name = "affected_test"
    cli_name = "affected-test"
    shared_rows = True

    worktree_id: int
    task_id: int
    picker_command: str
    test_command: str
    state: AffectedTestState = AffectedTestState.QUEUED
    process_id: int | None = None
