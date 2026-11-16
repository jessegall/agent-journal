import json

import pytest

from tests.stories.suites.coding.modules.workers.support.phase_steps import group_worker, planned_worker, single_worker  # noqa: F401
from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, StoryWorker

"""Book B of doc 1252: a commit is free and never a merge."""

REQUEST_MERGE = 'worker ask-merge "the cart, all three tasks; nothing left out"'


def worktree_state(worker: StoryWorker) -> str:
    listed = json.loads(worker.story.run("worker-worktree list --json --environment main", actor=worker.story.agent).output_text)
    return str(next(row["state"] for row in listed["rows"] if row["session_agent_id"] == worker.worker.id and row["state"] != "removed"))


def commit_tasks_singly(worker: StoryWorker, task_ids: tuple[int, ...]) -> None:
    """The worker starts, proves and commits each task on its own."""
    for task_id in task_ids:
        worker.story.run(f"task start {task_id}", actor=worker.worker)
        prove_task(worker, task_id, 1, TEST_LINE)
        worker.story.run(COMMIT, actor=worker.worker)
        worker.story.run_listeners()



@pytest.fixture
def three_committed_worker(group_worker: StoryWorker) -> StoryWorker:
    commit_tasks_singly(group_worker, (1, 2, 3))
    return group_worker


@pytest.fixture
def two_committed_worker(group_worker: StoryWorker) -> StoryWorker:
    commit_tasks_singly(group_worker, (1, 2))
    return group_worker


@pytest.fixture
def first_planned_committed_worker(planned_worker: StoryWorker) -> StoryWorker:
    commit_tasks_singly(planned_worker, (1,))
    return planned_worker


@pytest.fixture
def first_committed_worker(group_worker: StoryWorker) -> StoryWorker:
    commit_tasks_singly(group_worker, (1,))
    return group_worker

def test_17_a_commit_takes_the_proved_tasks_and_leaves_the_rest_started(group_worker):
    group_worker.story.run("task start 2", actor=group_worker.worker)
    prove_task(group_worker, 1, 1, TEST_LINE)
    answer = group_worker.story.run(COMMIT, actor=group_worker.worker).output_text
    group_worker.story.expect_text("task show 2", "state: started", actor=group_worker.story.agent)
    group_worker.story.expect_rows("task 2 is not part of this commit" in answer, detail=answer)


def test_18_a_commit_with_nothing_proved_is_refused(group_worker):
    group_worker.story.expect_refusal(COMMIT, "nothing is staged", actor=group_worker.worker)


def test_19_a_short_proof_still_refuses(group_worker):
    prove_task(group_worker, 1, 1, TEST_LINE)
    group_worker.story.expect_success('proof short 1 "the test names no cart"', actor=group_worker.story.agent)
    group_worker.story.expect_refusal(COMMIT, "proof 1 is short", actor=group_worker.worker)


def test_20_commits_are_not_counted(three_committed_worker):
    lines = " | ".join(three_committed_worker.worker_lines())
    three_committed_worker.story.expect_rows("commits left" not in lines, "too many commits" not in lines, detail=lines)


def test_21_a_commit_of_a_unit_of_more_never_delivers(first_planned_committed_worker):
    first_planned_committed_worker.story.expect_rows(worktree_state(first_planned_committed_worker) == "cut", detail=first_planned_committed_worker.status())


def test_22_a_commit_of_the_last_task_of_a_list_never_delivers(three_committed_worker):
    three_committed_worker.end_all_tests()
    three_committed_worker.story.expect_rows(worktree_state(three_committed_worker) == "cut", "Point: merge_due" in three_committed_worker.status(), detail=three_committed_worker.status())


def test_23_a_unit_of_one_concludes_by_its_commit(single_worker):
    single_worker.prove_commit(TEST_LINE)
    single_worker.story.run_listeners()
    single_worker.story.expect_rows(worktree_state(single_worker) == "delivered", detail=single_worker.status())


def test_24_the_merger_is_not_woken_by_a_commit_of_a_unit_of_more(three_committed_worker):
    three_committed_worker.story.expect_absent("agent list --role merger --environment main", "running", actor=three_committed_worker.story.agent)


def test_25_main_hears_nothing_per_commit(group_worker):
    previous = group_worker.main_agent_lines()
    commit_tasks_singly(group_worker, (1, 2))
    group_worker.story.expect_rows(group_worker.main_agent_lines() == previous, detail=str(group_worker.main_agent_lines()))


def test_26_a_list_of_three_tasks_is_merged_once(three_committed_worker):
    three_committed_worker.end_all_tests()
    three_committed_worker.story.expect_success(REQUEST_MERGE, actor=three_committed_worker.worker)
    merge(three_committed_worker)
    merged_lines = [line for line in three_committed_worker.main_agent_lines() if "merge-ask:1" in line]
    three_committed_worker.story.expect_rows(len(merged_lines) == 1, detail=str(three_committed_worker.main_agent_lines()))


def test_27_a_plan_of_three_phases_is_merged_once(first_planned_committed_worker):
    worker = first_planned_committed_worker
    commit_tasks_singly(worker, (2, 3, 4))
    worker.end_all_tests()
    worker.end_all_tests()
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    merge(worker)
    merged_lines = [line for line in worker.main_agent_lines() if "merge-ask:1" in line]
    worker.story.expect_rows(len(merged_lines) == 1, detail=str(worker.main_agent_lines()))


def test_a_worker_waiting_with_its_unit_committed_is_woken_by_the_pass(three_committed_worker):
    three_committed_worker.end_all_tests()
    lines = " | ".join(three_committed_worker.worker_lines())
    three_committed_worker.story.expect_rows("passed on your commit" in lines or "Point: merge_due" in three_committed_worker.status(), detail=lines)


def test_a_stop_of_a_worker_whose_unit_is_committed_is_no_report(three_committed_worker):
    previous = three_committed_worker.main_agent_lines()
    three_committed_worker.stop()
    three_committed_worker.story.expect_rows(three_committed_worker.main_agent_lines() == previous, detail=str(three_committed_worker.main_agent_lines()))
