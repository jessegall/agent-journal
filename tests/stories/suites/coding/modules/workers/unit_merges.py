from tests.integration.suites.coding.modules.workers.test_work_units import worker_unit
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE, commit_tasks_singly, worktree_state
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, StoryWorker, start_planned_worker, unplanned_group_worker, single_task_worker
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED

"""Book E of doc 1252: the merge of an asked unit, and every way it comes back."""

MERGE_REQUEST = "merge-ask show 1 --environment main"


def requested_list(new_story) -> StoryWorker:
    """A worker of three tasks sent together committed all three, its runs passed, and it asked for the merge."""
    worker = unplanned_group_worker(new_story)
    commit_tasks_singly(worker, (1, 2, 3))
    worker.end_all_tests()
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    worker.story.run_listeners()
    return worker


def requested_plan(new_story) -> StoryWorker:
    """The worker of plan 1 committed its four tasks, every run passed, and it asked for the merge."""
    worker = start_planned_worker(new_story)
    commit_tasks_singly(worker, (1, 2, 3, 4))
    worker.end_all_tests()
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    worker.story.run_listeners()
    return worker


def test_65_the_merger_reads_the_ask(new_story):
    worker = requested_list(new_story)
    worker.story.expect_text(MERGE_REQUEST, "the cart, all three tasks", "state: waiting", "unit_name: tasks 1, 2, 3", actor=worker.story.agent)


def test_66_one_merge_closes_every_asked_task_with_its_log_line(new_story):
    worker = requested_list(new_story)
    merge(worker)
    for task_id in (1, 2, 3):
        worker.story.expect_text(f"task show {task_id}", "state: completed", actor=worker.story.agent)


def test_67_the_plan_ends_with_its_merge(new_story):
    worker = requested_plan(new_story)
    merge(worker)
    worker.story.expect_text("plan show 1", "state: completed", actor=worker.story.agent)


def test_68_main_hears_one_line_naming_the_ask(new_story):
    worker = requested_list(new_story)
    merge(worker)
    number = agent_number(worker.story, worker.worker.id)
    lines = [line for line in worker.main_agent_lines() if "merge-ask:1" in line]
    worker.story.expect_rows(len(lines) == 1, detail=str(worker.main_agent_lines()))


def test_72_in_a_unit_of_one_the_commit_asks_again(new_story):
    worker = single_task_worker(new_story)
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    worker.story.expect_refusal(REQUEST_MERGE, "your task asks for its merge by its commit", actor=worker.worker)


def test_73_important_log_lines_still_need_the_answer_of_the_main_agent(new_story):
    worker = unplanned_group_worker(new_story)
    worker.story.run('task log 1 "the brief named the wrong file" --important', actor=worker.worker)
    commit_tasks_singly(worker, (1, 2, 3))
    worker.end_all_tests()
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    number = agent_number(worker.story, worker.worker.id)
    worker.repository.checkout(ENVIRONMENT_BRANCH)
    worker.story.run(f"worker logs {number}", actor=worker.story.agent)
    worker.story.expect_refusal(f"worker merge --wait {number}", "important", actor=worker.story.agent)


def test_an_ask_is_heard_by_the_main_agent_with_the_merger_off(new_story):
    worker = unplanned_group_worker(new_story)
    worker.story.run(f"setting set {MERGER_ENABLED} false --project", actor=worker.story.user)
    commit_tasks_singly(worker, (1, 2, 3))
    worker.end_all_tests()
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    worker.story.expect_rows(any("merge-ask:1" in line for line in worker.main_agent_lines()), detail=str(worker.main_agent_lines()))


def test_a_send_onto_a_waiting_ask_keeps_the_ask_and_queues_the_task(new_story):
    worker = requested_list(new_story)
    task_id = worker.story.new_row_id('task make "Receipts" --brief "Print them" --environment main', actor=worker.story.agent)
    worker.story.run(f"worker send {agent_number(worker.story, worker.worker.id)} --task {task_id}", actor=worker.story.agent)
    worker.story.expect_text(MERGE_REQUEST, "state: waiting", actor=worker.story.agent)


@pytest.mark.real_git
def test_a_part_asked_before_a_rebase_is_merged_by_its_tasks(new_story):
    worker = unplanned_group_worker(new_story)
    commit_tasks_singly(worker, tuple([1]))
    worker.end_all_tests()
    worker.story.expect_success('worker ask-merge "the first task" --up-to 1', actor=worker.worker)
    worker.repository.committed("readme.md", "moved\n", "The branch moves")
    commit_tasks_singly(worker, tuple([2]))
    merge_request = worker.story.run(MERGE_REQUEST, actor=worker.story.agent).output_text
    worker.story.expect_rows("task_ids: 1" in merge_request, "is_full: false" in merge_request.lower(), detail=merge_request)


def test_the_merge_commit_of_a_unit_names_every_task_it_brings_in(new_story):
    worker = requested_list(new_story)
    worker.story.expect_success("worker-worktree list --json", actor=worker.story.agent)
    merge(worker)
    title = worker.repository.history.tip(ENVIRONMENT_BRANCH).message.splitlines()[0]
    worker.story.expect_rows(title.startswith("tasks 1, 2, 3: "), detail=title)


def test_a_task_released_from_the_unit_stays_open_when_the_unit_merges(new_story):
    worker = unplanned_group_worker(new_story)
    commit_tasks_singly(worker, (1, 2))
    worker.story.run("task start 3", actor=worker.worker)
    worker.story.expect_success('task release 3 --reason "another worker takes the receipts"', actor=worker.worker)
    merge(worker)
    worker.story.expect_text("task show 1", "state: completed", actor=worker.story.agent)
    worker.story.expect_no_text("task show 3", "state: completed", actor=worker.story.agent)


def test_a_task_in_testing_with_no_proof_of_its_own_is_left_open_and_named_by_the_merge(new_story):
    worker = unplanned_group_worker(new_story)
    commit_tasks_singly(worker, (1, 2))
    worker.story.run("task start 3", actor=worker.worker)
    worker.story.run("task test 3", actor=worker.worker)
    number = agent_number(worker.story, worker.worker.id)
    worker.repository.checkout(ENVIRONMENT_BRANCH)
    for _ in range(3):
        worker.end_all_tests()
        worker.story.run_listeners()
    worker.story.run('worker ask-merge "the committed work of the unit"', actor=worker.worker)
    worker.story.run(f"worker logs {number}", actor=worker.story.agent)
    worker.story.expect_text(f"worker merge --wait {number}", "left open, with no proof of their own in the worktree: tasks 3", actor=worker.story.agent)
    worker.story.expect_text("task show 3", "state: testing", actor=worker.story.agent)
