from core.testing.expect_reply import expect_reply_allowed
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, worker_on_plan, worker_outside_plan
from tests.stories.suites.coding.modules.workers.test_batches import BATCH, PHASE, configure


def test_s32_the_phase_setting_off_tests_each_plan_task_whatever_the_outside_batch_size(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch, build_test="pytest tests/phase.py")
    configure(worker, PHASE, "off")
    configure(worker, BATCH, "4")
    for _ in range(4):
        expect_reply_allowed(worker.run_test())
    worker.change_and_prove(TEST_LINE)
    worker.story.expect_text("worker next --wait --differences none", "tests of task 1", actor=worker.worker)
    worker.story.expect_rows(len(worker.started) == 1, worker.current_task() == 1)


def test_s33_a_batch_outside_a_plan_runs_its_proofs_together_when_its_size_is_reached(new_story, monkeypatch):
    worker = worker_outside_plan(new_story, monkeypatch)
    UserJoined().steps(worker.story)
    configure(worker, BATCH, "2")
    worker.prove_and_move_on(TEST_LINE)
    worker.story.expect_rows(worker.current_task() == 2, len(worker.started) == 0)
    worker.prove(TEST_LINE)
    worker.story.expect_text("worker deliver --wait --differences none", "tests of batch", actor=worker.worker)
    worker.end_all_tests()
    worker.story.expect_rows(len(worker.started) == 2)
    worker.story.expect_text("task show 1", "state: completed", actor=worker.story.agent)
    worker.story.expect_text("task show 2", "state: completed", actor=worker.story.agent)
