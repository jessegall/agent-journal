import pytest

from engine.testing.examples.hook_samples import HookSamples

from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from tests.stories.suites.coding.modules.workers.ask_ledger import QUESTION, SECOND_QUESTION, questions, waits_of
from tests.stories.suites.coding.modules.workers.support.held_tasks import unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import StoryWorker


@pytest.fixture
def two_started(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1 and 2 started, in no plan; task 1 is the task of its worktree."""
    return unplanned_holding_worker(new_story, monkeypatch)


def test_91a_an_ask_that_names_a_started_task_is_recorded_for_that_task_and_not_for_the_task_of_the_worktree(two_started):
    story = two_started.story
    story.expect_success(f'worker ask "{QUESTION}" --about tool --task 2', actor=two_started.worker)
    line = questions(story)[0]
    story.expect_text("task-log list --task 2", QUESTION, actor=story.agent)
    story.expect_rows(line.task_id == 2, line.wait_id is not None, "task 2" in line.text, detail=line.text)


def test_91b_an_ask_about_a_task_the_worker_has_not_started_is_refused_with_its_started_tasks_and_leaves_nothing(two_started):
    story = two_started.story
    story.expect_success('task make "Receipts" --brief "The receipts"', actor=story.agent)
    refused = story.run(f'worker ask "{QUESTION}" --about tool --task 3', actor=two_started.worker)
    story.expect_rows(refused.code != 0, "you hold tasks 1, 2" in refused.output_text, questions(story) == (), waits_of(story, two_started.worker) == (), detail=refused.output_text)


def test_91c_91d_an_ask_with_no_task_is_about_the_task_of_the_worktree_and_closes_as_moot_with_that_task_while_the_ask_about_the_other_stays(two_started):
    story = two_started.story
    story.expect_success(f'worker ask "{QUESTION}" --about tool', actor=two_started.worker)
    story.expect_success(f'worker ask "{SECOND_QUESTION}" --about tests --task 2', actor=two_started.worker)
    story.expect_success('task cancel 1 --reason "the cart is dropped"', actor=story.user)
    story.run_listeners()
    first, second = questions(story)
    story.expect_rows((first.task_id, first.outcome) == (1, AskOutcome.MOOT), (second.task_id, second.outcome) == (2, None), detail=f"{first} | {second}")


def test_232_a_worker_with_a_started_task_that_has_no_proof_may_not_stop_until_it_has_an_open_ask(two_started):
    story = two_started.story
    story.expect_hook_refusal(two_started.session, HookSamples.stop(), "Task 1 is not finished")
    story.expect_success(f'worker ask "{QUESTION}" --about tool --task 2', actor=two_started.worker)
    story.expect_hook_allowed(two_started.session, HookSamples.stop())
