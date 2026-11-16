from tests.stories.suites.coding.modules.workers.phase_test_allowance import expect_counted
import pytest

from tests.stories.suites.coding.modules.workers.support.phase_steps import start_planned_worker
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

SETTING = f"{WORKER_PHASE_TEST_RUNS}"


@pytest.fixture
def worker(played, monkeypatch):
    return start_planned_worker(played)


def test_another_worker_in_the_same_phase_has_its_own_count(played):
    first = start_planned_worker(played, dispatch="worker dispatch --test-command python=pytest --model sonnet 1")
    for remaining in (2, 1, 0):
        expect_counted(first, remaining)
    second_worker = first.added_worker("worker dispatch --test-command python=pytest --model sonnet 2")
    expect_counted(second_worker, 2)


