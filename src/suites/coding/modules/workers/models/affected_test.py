from dataclasses import dataclass
from enum import StrEnum

from engine.model.model import Model


class AffectedTestState(StrEnum):
    QUEUED = "queued"
    PICKING = "picking"
    TESTING = "testing"
    PASSED = "passed"
    FAILED = "failed"
    CANCELLED = "cancelled"


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
