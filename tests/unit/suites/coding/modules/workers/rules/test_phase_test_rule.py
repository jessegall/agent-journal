from types import SimpleNamespace

import pytest

from core.modules.tasks.models.enums.task_state import TaskState
from engine.request.request_values import RequestValues
from suites.coding.modules.workers.rules.phase_test_rule import PhaseTestRule
from suites.coding.modules.workers.support.phase_test_runs import PhaseTestRuns

WORKTREE = SimpleNamespace(task_id=1)
PART = SimpleNamespace(arguments=())


class Rows:
    def __init__(self, state: TaskState) -> None:
        self.state = state

    def query(self, model):
        return SimpleNamespace(find=lambda row_id: SimpleNamespace(state=self.state))


class Window:
    def __init__(self, runs_remaining: int) -> None:
        self.runs_left = runs_remaining

    def test_runs_available(self, worktree) -> int:
        return self.runs_left

    @staticmethod
    def key(worktree) -> str:
        return "commit:1:1:0"


class Steps:
    def __init__(self, has_failure: bool) -> None:
        self.has_failure = has_failure

    def has_open_failure(self, worktree) -> bool:
        return self.has_failure


def rule(runs_remaining: int, has_failure: bool) -> PhaseTestRule:
    runs = PhaseTestRuns(Rows(TaskState.STARTED), None, SimpleNamespace(worker_worktree=lambda worker_id: WORKTREE), Window(runs_remaining), Steps(has_failure), RequestValues())
    runs.is_test_part = lambda part, shell: True
    return PhaseTestRule(runs)


def hook() -> SimpleNamespace:
    return SimpleNamespace(agent_id=5, event=SimpleNamespace(firing="firing-1", tool=SimpleNamespace(shell=SimpleNamespace(parts=[PART]))))


def test_a_run_with_no_runs_left_is_refused():
    assert rule(0, has_failure=False).answer(hook()).refusal


@pytest.mark.parametrize("remaining_runs", [0, 3])
def test_a_run_while_tests_of_the_work_have_failed_is_allowed_and_not_counted(remaining_runs):
    answer = rule(remaining_runs, has_failure=True).answer(hook())
    assert not answer.refusal and not answer.commands_unrefused


def test_a_run_with_runs_left_is_allowed_and_counted():
    answer = rule(3, has_failure=False).answer(hook())
    assert not answer.refusal and answer.commands_unrefused
