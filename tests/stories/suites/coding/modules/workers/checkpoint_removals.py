import pytest

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.enums.actor_type import ActorType
from engine.repository.repository import Repository
from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_refusal
from suites.coding.modules.workers.commands.make_proof.make_proof import MakeProof
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.ticks.stalled_worker_test_runs import StalledWorkerTestRuns
from tests.stories.suites.coding.modules.workers.checkpoint_runs import CART_COMMAND, commit_tasks, merge, task_proofs, rows, run_lines
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, dispatched_story_worker, planned_story
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import SHOWN_SETTINGS, apply_work_setting
from suites.coding.modules.workers.support.worker_settings import DELIVERY_FAILURE_LIMIT
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_FAILURE_LIMIT
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

PHASE_END_SETTING = "journal.suites.coding.workers.test-at-phase-end"
BATCH_SETTING = "journal.suites.coding.workers.test-batch-size"
RUNS_SETTING = f"{WORKER_PHASE_TEST_RUNS}"
RUNS_TITLE = "A worker's test runs between two commits"
REMAINING_NUMBERS = (RUNS_SETTING, f"{WORKER_TEST_LIMIT}", f"{WORKER_RUN_FAILURE_LIMIT}",
                     f"{DELIVERY_FAILURE_LIMIT}")
PHASE_TEST_POINT = 0
OLD_PHASE_TEST = "python tests/build.py"


def phase_worker(new_story, monkeypatch) -> StoryWorker:
    """A worker of a started plan with no flagged checkpoint, holding the three tasks of phase Build."""
    return dispatched_story_worker(planned_story(new_story), PHASE_DISPATCH, monkeypatch)


@pytest.fixture
def merged_phase(new_story, monkeypatch) -> StoryWorker:
    """The three tasks of phase Build, which is no checkpoint, are committed with a test each and merged; task 4
    of the last phase is open, so no checkpoint is reached."""
    worker = phase_worker(new_story, monkeypatch)
    commit_tasks(worker, TEST_LINE, SECOND_TEST_LINE, TEST_LINE)
    merge(worker)
    return worker


def test_196_201_a_phase_that_is_no_checkpoint_runs_no_test_at_its_end_and_gets_no_proof_of_point_zero(merged_phase):
    points = [row["point"] for row in rows(merged_phase, "proof list --json --oldest --limit 20")]
    merged_phase.story.expect_rows(merged_phase.started == [], PHASE_TEST_POINT not in points, rows(merged_phase, "checkpoint-reach list --json --environment main") == [],
                                   detail=f"{run_lines(merged_phase)}, points {points}")


@pytest.mark.parametrize("setting", [PHASE_END_SETTING, BATCH_SETTING], ids=["test-at-phase-end", "test-batch-size"])
def test_199_200_the_two_settings_of_tests_at_a_phase_end_and_in_batches_exist_no_more(new_story, monkeypatch, setting):
    worker = phase_worker(new_story, monkeypatch)
    shown = worker.story.run(f"setting show {setting} --environment main", actor=worker.story.user)
    changed = worker.story.run(f"setting set {setting} 3 --environment main", actor=worker.story.user)
    worker.story.expect_rows(shown.code != 0, changed.code != 0, detail=f"{shown.output_text} | {changed.output_text}")


def test_200_a_task_in_no_plan_is_tested_at_its_own_commit_whatever_the_batch_size_was(new_story, monkeypatch):
    story = planned_story(new_story, approve=False)
    worker = dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1 2", monkeypatch)
    worker.prove_commit(TEST_LINE)
    story.run_listeners()
    story.expect_rows(run_lines(worker) == [CART_COMMAND], detail=str(run_lines(worker)))


def test_202_a_checked_proof_of_point_zero_from_the_old_rule_holds_no_merge(new_story, monkeypatch):
    worker = phase_worker(new_story, monkeypatch)
    commit_tasks(worker, TEST_LINE, SECOND_TEST_LINE, TEST_LINE)
    old_command = MakeProof(PHASE_TEST_POINT, "the test phase Build names", 3, OLD_PHASE_TEST)
    context = Context(Actor(worker.worker.id, ActorType.AGENT), worker.story.clock.timestamp(), old_command, frozenset(), environment_id=1)
    repository = worker.story.container.get(Repository)
    shown = repository.save(Proof(task_id=3, worktree_id=1, creator_id=worker.worker.id, point=PHASE_TEST_POINT, text="the test phase Build names", test_command=OLD_PHASE_TEST), context)
    repository.save_change(shown, shown.moved(ProofLifecycle.check), context)
    merge(worker)
    worker.story.expect_text("task show 3", "state: completed", actor=worker.story.agent)


def test_206_the_runs_a_worker_may_start_itself_are_counted_between_two_commits(new_story, monkeypatch):
    worker = phase_worker(new_story, monkeypatch)
    apply_work_setting(worker.story, RUNS_SETTING, 1)
    expect_reply_allowed(worker.run_test())
    expect_reply_refusal(worker.run_test(), "No test runs left")
    worker.story.run("task start 2", actor=worker.worker)
    worker.prove_commit(TEST_LINE)
    expect_reply_allowed(worker.run_test())
    worker.story.expect_text("work-settings show --json --environment main", RUNS_TITLE, actor=worker.story.user)


def test_213_a_proof_test_that_runs_when_the_rule_changes_ends_as_it_was_and_the_next_commit_starts_none(new_story, monkeypatch):
    worker = phase_worker(new_story, monkeypatch)
    story = worker.story
    story.run("task start 2", actor=worker.worker)
    worker.prove_commit(TEST_LINE)
    StalledWorkerTestRuns()(story.container)
    story.expect_success("plan check 1", actor=story.agent)
    story.run_listeners()
    running_previous = list(worker.started)
    story.run("task start 3", actor=worker.worker)
    worker.prove_commit(SECOND_TEST_LINE)
    worker.prove(TEST_LINE)
    story.expect_success(COMMIT, actor=worker.worker)
    story.run_listeners()
    started_by_the_commit = [process_id for process_id in worker.started if process_id not in running_previous]
    worker.end_all_tests()
    states = {task_id: proof["state"] for task_id, proof in task_proofs(worker).items()}
    story.expect_rows(len(running_previous) == 1, started_by_the_commit == [], states == {1: "checked", 2: "committed", 3: "committed"}, detail=f"{run_lines(worker)}, {states}")


def test_the_workers_screen_shows_neither_removed_setting_and_each_number_of_its_tests_tab_still_changes(new_story, monkeypatch):
    worker = phase_worker(new_story, monkeypatch)
    for value, key in enumerate(REMAINING_NUMBERS, 2):
        apply_work_setting(worker.story, key, value)
    shown = worker.story.run(SHOWN_SETTINGS, actor=worker.story.user).output_text
    worker.story.expect_rows(PHASE_END_SETTING not in shown, BATCH_SETTING not in shown, all(key in shown for key in REMAINING_NUMBERS), detail=shown)
