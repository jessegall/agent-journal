from dataclasses import replace

from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints


def worker_reach(state: CheckpointState, task_ids: tuple[int, ...]) -> CheckpointReach:
    return replace(CheckpointReach.agent_commit_start(1, 2, 3, task_ids), id=4, state=state)


def test_a_window_passed_on_the_workers_commit_with_the_same_tasks_is_passed():
    reach = worker_reach(CheckpointState.PASSED, (7, 8))
    assert PlanCheckpoints.agent_commit_pass(tuple([reach]), 3, (8, 7)) == reach


def test_a_window_whose_worker_run_failed_is_not_passed():
    assert PlanCheckpoints.agent_commit_pass(tuple([worker_reach(CheckpointState.FAILED, tuple([7]))]), 3, tuple([7])) is None


def test_a_window_with_more_tasks_than_the_worker_run_is_not_passed():
    assert PlanCheckpoints.agent_commit_pass(tuple([worker_reach(CheckpointState.PASSED, tuple([7]))]), 3, (7, 9)) is None


def test_a_merged_reach_is_no_agent_commit_pass():
    reach = replace(CheckpointReach.started(1, 2, 3, tuple([7])), id=4, state=CheckpointState.PASSED)
    assert PlanCheckpoints.agent_commit_pass(tuple([reach]), 3, tuple([7])) is None
