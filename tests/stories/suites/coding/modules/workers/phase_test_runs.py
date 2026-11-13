import pytest

from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_refusal
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, start_planned_worker, unplanned_worker
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

FLAG = "No test runs left"
RULE = "workers.phase-tests"


@pytest.fixture
def planned_worker(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_success(f"setting set {WORKER_PHASE_TEST_RUNS} 0 --environment main", actor=worker.story.user)
    return worker


def test_the_worker_hears_the_flag_before_a_reader_request_holds_the_run(planned_worker):
    planned_worker.story.expect_success("setting set journal.core.processes.readers-forced on --environment main")
    expect_reply_refusal(planned_worker.run_test(), FLAG)


def test_a_refusal_skip_does_not_pass_the_refusal(planned_worker):
    planned_worker.run_test()
    planned_worker.story.expect_refusal(f'refusal skip {RULE} --reason "I need it" --environment main', "safety refusal", actor=planned_worker.worker)
    expect_reply_refusal(planned_worker.run_test(), FLAG)


def failed_commit(worker) -> None:
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    worker.end_tests(1)


def test_a_worker_of_an_unplanned_task_with_failed_tests_runs_a_test_without_spending_its_count(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    failed_commit(worker)
    worker.story.expect_success(f"setting set {WORKER_PHASE_TEST_RUNS} 0 --environment main", actor=worker.story.user)
    worker.story.expect_rows("Point: fix" in worker.status(), detail=worker.status())
    expect_reply_allowed(worker.run_test())

