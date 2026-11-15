import pytest

from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_line, expect_reply_refusal
from suites.coding.modules.workers.agent_messages.phase_test_run_allowed_message import PhaseTestRunAllowedMessage
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_ALIAS, TEST_LINE, start_planned_worker
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

SETTING = f"{WORKER_PHASE_TEST_RUNS}"


@pytest.fixture
def worker(played, monkeypatch):
    return start_planned_worker(played)


def expect_counted(worker, remaining):
    reply = worker.run_test()
    expect_reply_allowed(reply)
    expect_reply_line(reply, PhaseTestRunAllowedMessage.declared().agent_message(remaining=remaining).text)


def test_another_worker_in_the_same_phase_has_its_own_count(played):
    first = start_planned_worker(played, dispatch="worker dispatch --test-command python=pytest --model sonnet 1")
    for remaining in (2, 1, 0):
        expect_counted(first, remaining)
    second_worker = first.added_worker("worker dispatch --test-command python=pytest --model sonnet 2")
    expect_counted(second_worker, 2)




