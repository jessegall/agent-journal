import pytest

from engine.testing.expectations.expect_reply import expect_absent_reply_refusal, expect_reply_allowed, expect_reply_refusal
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_ALIAS, TEST_LINE, shell_test_part, start_planned_worker, unplanned_worker

FLAG = "No test runs left"
RULE = "workers.phase-tests"


@pytest.fixture
def planned_worker(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_success("setting set journal.suites.coding.workers.worker-phase-test-runs 0 --environment main", actor=worker.story.user)
    return worker


@pytest.fixture
def excludes_plan(new_story, monkeypatch):
    return unplanned_worker(new_story, monkeypatch)


def test_the_worker_hears_the_flag_before_a_reader_request_holds_the_run(planned_worker):
    planned_worker.story.expect_success("setting set journal.core.processes.readers-forced on --environment main")
    expect_reply_refusal(planned_worker.run_test(), FLAG)


def test_a_refusal_skip_does_not_pass_the_refusal(planned_worker):
    planned_worker.run_test()
    planned_worker.story.expect_refusal(f'refusal skip {RULE} --reason "I need it" --environment main', "safety refusal", actor=planned_worker.worker)
    expect_reply_refusal(planned_worker.run_test(), FLAG)


@pytest.fixture
def proved_without_test(excludes_plan):
    excludes_plan.edit_prove()
    return excludes_plan



def test_outside_a_plan_a_proof_with_no_test_waits_on_the_main_agent(proved_without_test):
    excludes_plan = proved_without_test
    excludes_plan.story.run("worker next --wait --differences none", actor=excludes_plan.worker)
    excludes_plan.story.expect_text("proof show 1", "state: shown", actor=excludes_plan.story.agent)
