import pytest

from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_line, expect_reply_refusal
from suites.coding.modules.workers.agent_messages.phase_test_run_allowed_message import PhaseTestRunAllowedMessage
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_ALIAS, TEST_LINE, start_planned_worker
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

SETTING = f"{WORKER_PHASE_TEST_RUNS}"


@pytest.fixture
def worker(new_story, monkeypatch):
    return start_planned_worker(new_story)


def expect_counted(worker, remaining):
    reply = worker.run_test()
    expect_reply_allowed(reply)
    expect_reply_line(reply, PhaseTestRunAllowedMessage.declared().agent_message(remaining=remaining).text)




def test_only_a_person_can_change_the_allowance(worker):
    worker.story.expect_refusal(f"setting set {SETTING} 1 --environment main", "may not run setting set", actor=worker.worker)
    worker.story.expect_success(f"setting set {SETTING} 1 --environment main", actor=worker.story.user)
    expect_counted(worker, 0)
    expect_reply_refusal(worker.run_test(), "No test runs left")


def test_test_parts_in_one_shell_line_each_use_a_run_and_a_refused_line_spends_none(worker):
    reply = worker.run_test(" && ".join([TEST_LINE] * 4))
    expect_reply_refusal(reply, "No test runs left")
    expect_counted(worker, 2)
    expect_reply_allowed(worker.run_test(f"{TEST_LINE} && {TEST_LINE}"))
    expect_reply_refusal(worker.run_test(), "No test runs left")
