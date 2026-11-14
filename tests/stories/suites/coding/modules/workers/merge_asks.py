import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.checkpoint_runs import BUILD_TEST
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE, commit_tasks_singly
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, TEST_LINE, StoryWorker, dispatched_story_worker, planned_story, unplanned_group_worker, single_task_worker

"""Book D of doc 1252: the worker asks for the merge itself."""

STOP_REFUSED = "Not finished"


def committed_list(new_story, monkeypatch) -> StoryWorker:
    """A worker of three tasks sent together committed all three and every run of them passed."""
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, (1, 2, 3))
    worker.end_all_tests()
    return worker


def running_plan(new_story, monkeypatch) -> StoryWorker:
    """The worker of plan 1, whose phase Build is a checkpoint, committed the three tasks of Build; their run goes."""
    worker = dispatched_story_worker(planned_story(new_story, build_test=BUILD_TEST), PLAN_DISPATCH, monkeypatch)
    commit_tasks_singly(worker, (1, 2, 3))
    return worker


def test_45_the_journal_says_when_the_unit_is_done(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    worker.story.expect_rows("Your unit is done: tasks 1, 2, 3, 3 tasks committed" in worker.status(), detail=worker.status())


def test_46_a_stop_at_merge_due_is_refused_with_its_line(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    reply = worker.stop()
    worker.story.expect_rows("Your unit is done" in str(reply), detail=str(reply))


def test_47_a_stop_while_the_last_run_is_open_is_allowed_and_no_report(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, (1, 2, 3))
    previous = worker.main_agent_lines()
    reply = worker.stop()
    worker.story.expect_rows(STOP_REFUSED not in str(reply), worker.main_agent_lines() == previous, detail=str(reply))


def test_48_the_whole_ask(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    worker.story.expect_text(REQUEST_MERGE, "Asked for the merge of tasks 1, 2, 3: 3 tasks in 3 commits", actor=worker.worker)


def test_49_refused_a_started_task(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, tuple([1]))
    worker.story.run("task start 2", actor=worker.worker)
    worker.story.expect_refusal(REQUEST_MERGE, "task 2 is started", actor=worker.worker)


def test_50_refused_a_run_of_the_asked_work_is_open(new_story, monkeypatch):
    worker = running_plan(new_story, monkeypatch)
    worker.story.expect_refusal(REQUEST_MERGE, "the tests of checkpoint phase 1 run on your commit", actor=worker.worker)


def test_51_refused_a_run_of_the_asked_work_failed(new_story, monkeypatch):
    worker = running_plan(new_story, monkeypatch)
    worker.end_tests(1, 0, 0, 0)
    worker.end_all_tests()
    worker.story.expect_refusal(REQUEST_MERGE, "is started", actor=worker.worker)


def test_53_refused_nothing_committed_since_the_last_merge(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    worker.story.expect_refusal(REQUEST_MERGE, "nothing is committed since your last merge", actor=worker.worker)


@pytest.mark.real_git
def test_54_refused_an_ask_already_waits(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, tuple([1]))
    worker.end_all_tests()
    worker.story.expect_success('worker ask-merge "the first task" --up-to 1', actor=worker.worker)
    worker.story.expect_refusal('worker ask-merge "again" --up-to 1', "your ask 1 waits for the merge", actor=worker.worker)


def test_55_refused_no_note_and_any_length_is_accepted(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    worker.story.expect_refusal('worker ask-merge " "', "write what the merge contains", actor=worker.worker)
    worker.story.expect_success(f'worker ask-merge "{"the cart " * 300}"', actor=worker.worker)


def test_56_refused_in_a_unit_of_one(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    worker.story.expect_refusal(REQUEST_MERGE, "your task asks for its merge by its commit", actor=worker.worker)


@pytest.mark.real_git
def test_57_an_early_ask_up_to_a_task(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, (1, 2))
    worker.end_all_tests()
    worker.story.expect_text('worker ask-merge "the first part" --up-to 1', "Asked for the merge up to commit", "Your later commits stay in your worktree", actor=worker.worker)


@pytest.mark.real_git
def test_58_an_early_ask_carries_every_earlier_commit(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, (1, 2, 3))
    worker.end_all_tests()
    worker.story.expect_text('worker ask-merge "the first two" --up-to 2', "2 tasks, with every commit before it", actor=worker.worker)


@pytest.mark.real_git
def test_59_an_early_ask_over_a_part_whose_run_has_not_passed_is_refused(new_story, monkeypatch):
    worker = running_plan(new_story, monkeypatch)
    worker.story.expect_refusal('worker ask-merge "the build" --up-to 3', "run on your commit", actor=worker.worker)


@pytest.mark.real_git
def test_60_refused_up_to_a_task_not_committed_or_a_commit_not_on_the_branch(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, tuple([1]))
    worker.end_all_tests()
    worker.story.expect_refusal('worker ask-merge "the rest" --up-to 3', "task 3 is not committed in your worktree", actor=worker.worker)
    worker.story.expect_refusal('worker ask-merge "the rest" --up-to abcdef1', "commit abcdef1 is not on your branch", actor=worker.worker)


@pytest.mark.real_git
def test_61_the_judgment_of_the_worker_is_not_second_guessed(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, tuple([1]))
    worker.end_all_tests()
    worker.story.expect_success('worker ask-merge "the first task is needed now" --up-to 1', actor=worker.worker)


@pytest.mark.real_git
def test_62_main_may_still_take_a_part_early(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, (1, 2))
    worker.end_all_tests()
    worker.story.expect_success(f"worker merge --wait {agent_number(worker.story, worker.worker.id)} --up-to 1", actor=worker.story.agent)


def test_63_main_cannot_merge_a_unit_of_more_that_did_not_ask(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    worker.story.expect_refusal(f"worker merge --wait {agent_number(worker.story, worker.worker.id)}", "has not asked for its merge", actor=worker.story.agent)


def test_64_a_worker_cannot_merge(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    prove_task(worker, 1, 1, TEST_LINE)
    outcome = worker.story.run(f"worker merge --wait {agent_number(worker.story, worker.worker.id)}", actor=worker.worker)
    worker.story.expect_rows(outcome.code != 0, detail=outcome.output_text)
