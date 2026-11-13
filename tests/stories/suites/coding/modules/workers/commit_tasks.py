from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from datetime import timedelta

import pytest

from suites.coding.modules.workers.models.enums.proof_state import ProofState
from tests.stories.core.modules.plugins.support.worker_step_samples import step_plugin_folder
from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.hand_in_rebase import expect_tip
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT, COMMIT_COMMAND
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.held_tasks import holding_worker, proofs, prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker
from suites.coding.modules.workers.support.worker_settings import PROTECTED_FOLDERS
from tests.stories.suites.coding.modules.workers.support.phase_steps import expect_task_states

LEFT_OUT = "the rounding is left out"
FOUR_POINT_BRIEF = "- the tax is read\n- the tax is added\n- the tax is shown\n- the tax is rounded"
THREE_POINT_BRIEF = "- the totals are added\n- the totals are shown\n- the totals are stored"
WAIT_BEFORE_COMMIT = timedelta(minutes=40)
MERGED_REASON = "merged; its tests run at the checkpoint of phase 2"


def prove_both(worker: StoryWorker) -> StoryWorker:
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    return worker


def states(worker: StoryWorker) -> list[ProofState]:
    return [proof.state for proof in proofs(worker)]


@pytest.fixture
def two_proved_unplanned(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1 and 2 started, in no plan, and proved the one point of each with a test."""
    return prove_both(unplanned_holding_worker(new_story, monkeypatch))


@pytest.fixture
def two_proved(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds tasks 1 and 2 started and proved the one point of each with a test."""
    return prove_both(holding_worker(new_story, monkeypatch, 2))


@pytest.fixture
def two_started(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds tasks 1 and 2 started and proved nothing."""
    return holding_worker(new_story, monkeypatch, 2)


@pytest.fixture
def three_started(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds tasks 1, 2 and 3 started; task 2 has four points and task 3 three."""
    worker = holding_worker(new_story, monkeypatch, 3)
    worker.story.expect_success(f'task edit 2 --brief "{FOUR_POINT_BRIEF}"', actor=worker.story.agent)
    worker.story.expect_success(f'task edit 3 --brief "{THREE_POINT_BRIEF}"', actor=worker.story.agent)
    return worker


def test_24_26_proofs_shown_forty_minutes_before_a_commit_of_two_tasks_start_no_test_until_it_and_both_tasks_go_to_testing(two_proved_unplanned):
    story = two_proved_unplanned.story
    story.advance(WAIT_BEFORE_COMMIT)
    story.run_listeners()
    states_before_commit, started_before_commit = states(two_proved_unplanned), list(two_proved_unplanned.started)
    story.expect_text("proof list", "shown", actor=story.agent)
    outcome = story.run(COMMIT, actor=two_proved_unplanned.worker)
    story.run_listeners()
    expect_task_states(two_proved_unplanned, "testing", 1, 2)
    story.expect_rows(states_before_commit == [ProofState.SHOWN] * 2, started_before_commit == [], outcome.code == 0, "committed tasks 1, 2 as " in outcome.output_text,
                      len(two_proved_unplanned.started) == 2, detail=f"{outcome.output_text} | {states_before_commit} | {two_proved_unplanned.started}")


def test_25_158_163_165_a_commit_of_two_tasks_in_a_started_plan_is_one_git_commit_starts_no_test_and_its_merge_completes_both(two_proved):
    story = two_proved.story
    outcome = story.run(COMMIT, actor=two_proved.worker)
    story.run_listeners()
    asked_for_merge(story, two_proved.worker)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)
    two_proved.repository.expect_commit(two_proved.repository.worker_branch(two_proved.worker.id), "tasks 1, 2: Fix the cart", f"Journal: worker worker-{two_proved.worker.id}")
    merge(two_proved)
    for task_id in (1, 2):
        story.expect_text(f"task show {task_id}", "state: completed", MERGED_REASON, actor=story.agent)
    story.expect_rows(outcome.code == 0, "committed tasks 1, 2 as " in outcome.output_text, two_proved.started == [], states(two_proved) == [ProofState.COMMITTED] * 2,
                      detail=f"{outcome.output_text} | {two_proved.started} | {states(two_proved)}")


def test_29_what_differs_at_a_commit_of_two_tasks_becomes_an_important_log_line_of_each_task(two_proved):
    asked = two_proved.story.run(f"{COMMIT_COMMAND} --wait", actor=two_proved.worker)
    two_proved.story.expect_success(f'{COMMIT_COMMAND} --wait --differences "{LEFT_OUT}"', actor=two_proved.worker)
    two_proved.story.expect_text("task-log list --task 1", LEFT_OUT, actor=two_proved.story.agent)
    two_proved.story.expect_text("task-log list --task 2", LEFT_OUT, actor=two_proved.story.agent)
    two_proved.story.expect_rows(asked.code != 0, "did you do anything other than the task brief asked" in asked.output_text, detail=asked.output_text)


def test_30_a_rule_of_a_plugin_refuses_a_file_of_a_commit_of_two_tasks_and_both_stay_started(two_proved):
    story = two_proved.story
    story.run(f"plugin install {step_plugin_folder(story.home.folder.parent, 'worker_delivering')} --yes", actor=story.user)
    two_proved.repository.changed(two_proved.worker.id, "cart.py", CART_CHANGE)
    expect_refused_with(story, COMMIT, "[plugin steps] cart.py has a sin", "then run journal worker commit again", actor=two_proved.worker)
    expect_task_states(two_proved, "started", 1, 2)


def test_31_a_change_in_a_protected_folder_refuses_a_commit_of_two_tasks(two_proved):
    story = two_proved.story
    story.expect_success(f'setting set {PROTECTED_FOLDERS} \'["task_2.txt"]\' --project', actor=story.user)
    expect_refused_with(story, COMMIT, "task_2.txt is protected", "undo the change in that folder", actor=two_proved.worker)
    story.expect_rows(states(two_proved) == [ProofState.SHOWN] * 2, detail=str(states(two_proved)))


@pytest.mark.real_git
def test_32_a_commit_of_two_tasks_on_a_base_branch_that_moved_is_rebased_and_its_worktree_carries_the_base(two_proved):
    two_proved.repository.checkout(ENVIRONMENT_BRANCH)
    two_proved.repository.committed("rate.py", "RATE = 2\n", "The rate")
    two_proved.story.expect_success(COMMIT, actor=two_proved.worker)
    expect_tip(two_proved.story, two_proved.repository, two_proved.worker)
    expect_task_states(two_proved, "testing", 1, 2)


@pytest.mark.real_git
def test_33_a_clash_stops_a_commit_of_two_tasks_names_the_file_and_the_proofs_of_both_stay_shown(two_proved):
    two_proved.repository.changed(two_proved.worker.id, "cart.py", CART_CHANGE)
    two_proved.repository.checkout(ENVIRONMENT_BRANCH)
    two_proved.repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    expect_refused_with(two_proved.story, COMMIT, f"your work clashes with {ENVIRONMENT_BRANCH} in cart.py", "settle the conflict markers in those files, then commit again", actor=two_proved.worker)
    two_proved.story.expect_text("proof list", "shown", actor=two_proved.story.agent)
    two_proved.story.expect_rows(states(two_proved) == [ProofState.SHOWN] * 2, detail=str(states(two_proved)))
    two_proved.repository.changed(two_proved.worker.id, "cart.py", "TOTAL = 3\n")
    two_proved.story.expect_success(COMMIT, actor=two_proved.worker)
    expect_task_states(two_proved, "testing", 1, 2)


def test_34_35_a_commit_of_two_tasks_is_refused_with_no_proof_and_then_with_no_change_until_the_differences_say_what_was_already_built(two_started):
    story = two_started.story
    expect_refused_with(story, COMMIT, "nothing is staged", "journal proof make", actor=two_started.worker)
    for task_id in (1, 2):
        story.expect_success(f'proof make 1 --task {task_id} "cart.py:1, the cart total"', actor=two_started.worker)
    expect_refused_with(story, COMMIT, "your worktree has no change", "--differences", actor=two_started.worker)
    story.expect_success(f'{COMMIT_COMMAND} --wait --differences "already built: cart.py"', actor=two_started.worker)
    expect_task_states(two_started, "testing", 1, 2)
