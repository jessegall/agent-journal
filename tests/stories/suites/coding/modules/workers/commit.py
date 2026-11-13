import pytest

from core.modules.plugins.support.plugin_step_check import PluginStepCheck
from suites.coding.models.enums.ask_topic import AskTopic
from tests.stories.core.modules.plugins.worker_steps import step_plugin_story
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.hand_in_rebase import MAIN_TAX, MERGED_TAX, WORKER_TAX, moved_base_worker
from tests.stories.suites.coding.modules.workers.refused_steps import REASON
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT, COMMIT_COMMAND
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, StoryWorker, dispatched_story_worker
from suites.coding.modules.workers.support.worker_nudges import WORKER_REFUSED
from engine.testing.expectations.expect_nudge import said

LEFT_OUT = "the rounding is left out"
FIXED_CART = "TOTAL = 3\n"


@pytest.fixture
def proved(new_story, monkeypatch) -> StoryWorker:
    """A worker of one task in no plan that changed the cart and proved the one point of its task with a test;
    nothing is committed."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_story_worker(story, DISPATCH, monkeypatch)
    worker.prove(TEST_LINE)
    return worker


@pytest.fixture
def working(new_story):
    """A worker of one task in no plan that changed and proved nothing."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    return story, repository, dispatched_worker(story)


@pytest.fixture
def moved_base(new_story):
    """A worker that changed the cart and proved its point, on a base branch that got a commit after its
    worktree was cut."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    return story, repository, moved_base_worker(story, repository)


def test_24_a_commit_of_a_proved_task_says_committed_queues_its_tests_and_puts_the_task_in_testing(proved):
    outcome = proved.story.run(COMMIT, actor=proved.worker)
    proved.story.run_listeners()
    proved.story.expect_text("task show 1", "state: testing", actor=proved.story.agent)
    proved.story.expect_text("worker status", "tests of task 1 are queued", actor=proved.worker)
    proved.story.expect_rows(outcome.code == 0, "committed task 1 as " in outcome.output_text, len(proved.started) == 1, detail=outcome.output_text)


def test_29_a_commit_asks_for_the_differences_and_what_differs_becomes_an_important_log_line(proved):
    asked = proved.story.run(f"{COMMIT_COMMAND} --wait", actor=proved.worker)
    proved.story.expect_success(f'{COMMIT_COMMAND} --wait --differences "{LEFT_OUT}"', actor=proved.worker)
    proved.story.expect_text("task-log list --task 1", LEFT_OUT, actor=proved.story.agent)
    proved.story.expect_rows(asked.code != 0, "did you do anything other than the task brief asked" in asked.output_text, detail=asked.output_text)


def test_37_a_commit_of_a_task_in_no_plan_queues_one_selected_run_when_its_two_commands_are_set(proved):
    story = proved.story
    story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main')
    story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 run_tests.py" --environment main')
    story.expect_success(COMMIT, actor=proved.worker)
    story.run_listeners()
    selected = story.run("affected-test list --json", actor=story.agent).output_text
    story.expect_rows(selected.count('"picker_command"') == 1, "pick.py" in selected, detail=selected)


def test_38_a_proof_sent_back_short_and_shown_again_is_tested_again_at_the_next_commit(proved):
    story = proved.story
    story.expect_success(COMMIT, actor=proved.worker)
    story.run_listeners()
    proved.end_tests(1)
    proved.edit_prove(TEST_LINE)
    proved.repository.changed(proved.worker.id, "cart.py", FIXED_CART)
    story.expect_success(COMMIT, actor=proved.worker)
    story.run_listeners()
    story.expect_text("proof show 1", "state: running", actor=story.agent)
    story.expect_rows(len(proved.started) == 2, detail=f"started: {proved.started}")


def test_30_a_commit_a_rule_of_a_plugin_refuses_says_how_to_go_on_and_the_fifth_names_the_worker(new_story, monkeypatch):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    monkeypatch.setattr(PluginStepCheck, "refusal", lambda *_args, **_kwargs: REASON)
    for _ in range(5):
        expect_refused_with(story, COMMIT, REASON, "then run journal worker commit again", actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id} --json", said(WORKER_REFUSED))


@pytest.mark.parametrize("event", ("worker_clocking_out", "worker_delivering"))
def test_210_a_plugin_that_holds_an_event_of_a_delivery_is_asked_at_a_commit(new_story, event):
    story = step_plugin_story(new_story, event)
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, "totals.py", CART_CHANGE)
    story.run(FIRST_PROOF, actor=worker)
    story.expect_success(COMMIT, actor=worker)
    story.expect_text("plugin record steps --inputs", event, actor=story.user)


def test_31_a_change_in_a_protected_folder_refuses_the_commit(working):
    story, repository, worker = working
    story.expect_success('setting set journal.suites.coding.workers.protected-folders \'["cart.py"]\' --project', actor=story.user)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    expect_refused_with(story, COMMIT, "cart.py is protected", "undo the change in that folder", AskTopic.TOOL.question_line(), actor=worker)
    story.expect_text("proof show 1", "state: shown", actor=story.agent)


@pytest.mark.real_git
def test_33_a_clash_with_the_base_branch_stops_the_commit_names_the_files_and_keeps_the_proofs(moved_base):
    story, repository, worker = moved_base
    repository.changed(worker.id, "tax.py", WORKER_TAX)
    repository.committed("tax.py", MAIN_TAX, "Another tax")
    expect_refused_with(story, COMMIT, f"your work clashes with {ENVIRONMENT_BRANCH} in tax.py", "settle the conflict markers in those files, then commit again", actor=worker)
    story.expect_text("proof show 1", "state: shown", actor=story.agent)
    repository.changed(worker.id, "tax.py", MERGED_TAX)
    story.expect_success(COMMIT, actor=worker)


def test_35_a_commit_with_no_proof_at_all_is_refused_as_nothing_staged(working):
    story, repository, worker = working
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    expect_refused_with(story, COMMIT, "nothing is staged", "journal proof make", actor=worker)
    story.expect_text("worker status", "journal proof make", actor=worker)
