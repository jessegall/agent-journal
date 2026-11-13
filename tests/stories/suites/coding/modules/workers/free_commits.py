import json

from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, StoryWorker, start_planned_worker, unplanned_group_worker, single_task_worker

"""Book B of doc 1252: a commit is free and never a merge."""

ASK_MERGE = 'worker ask-merge "the cart, all three tasks; nothing left out"'


def worktree_state(worker: StoryWorker) -> str:
    listed = json.loads(worker.story.run("worker-worktree list --json --environment main", actor=worker.story.agent).output_text)
    return str(next(row["state"] for row in listed["rows"] if row["session_agent_id"] == worker.worker.id and row["state"] != "removed"))


def commit_each(worker: StoryWorker, task_ids: tuple[int, ...]) -> None:
    """The worker starts, proves and commits each task on its own."""
    for task_id in task_ids:
        worker.story.run(f"task start {task_id}", actor=worker.worker)
        prove_task(worker, task_id, 1, TEST_LINE)
        worker.story.run(COMMIT, actor=worker.worker)
        worker.story.run_listeners()


def test_17_a_commit_takes_the_proved_tasks_and_leaves_the_rest_started(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    worker.story.run("task start 2", actor=worker.worker)
    prove_task(worker, 1, 1, TEST_LINE)
    answer = worker.story.run(COMMIT, actor=worker.worker).output_text
    worker.story.expect_text("task show 2", "state: started", actor=worker.story.agent)
    worker.story.expect_rows("task 2 is not part of this commit" in answer, detail=answer)


def test_18_a_commit_with_nothing_proved_is_refused(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    worker.story.expect_refusal(COMMIT, "nothing is staged", actor=worker.worker)


def test_19_a_short_proof_still_refuses(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    prove_task(worker, 1, 1, TEST_LINE)
    worker.story.expect_success('proof short 1 "the test names no cart"', actor=worker.story.agent)
    worker.story.expect_refusal(COMMIT, "proof 1 is short", actor=worker.worker)


def test_20_commits_are_not_counted(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3))
    lines = " | ".join(worker.worker_lines())
    worker.story.expect_rows("commits left" not in lines, "too many commits" not in lines, detail=lines)


def test_21_a_commit_of_a_unit_of_more_never_delivers(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    commit_each(worker, tuple([1]))
    worker.story.expect_rows(worktree_state(worker) == "cut", detail=worker.status())


def test_22_a_commit_of_the_last_task_of_a_list_never_delivers(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3))
    worker.end_all_tests()
    worker.story.expect_rows(worktree_state(worker) == "cut", "Point: merge_due" in worker.status(), detail=worker.status())


def test_23_a_unit_of_one_concludes_by_its_commit(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    worker.story.expect_rows(worktree_state(worker) == "delivered", detail=worker.status())


def test_24_the_merger_is_not_woken_by_a_commit_of_a_unit_of_more(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3))
    worker.story.expect_absent("agent list --role merger --environment main", "running", actor=worker.story.agent)


def test_25_main_hears_nothing_per_commit(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    previous = worker.main_agent_lines()
    commit_each(worker, (1, 2))
    worker.story.expect_rows(worker.main_agent_lines() == previous, detail=str(worker.main_agent_lines()))


def test_26_a_list_of_three_tasks_is_merged_once(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3))
    worker.end_all_tests()
    worker.story.expect_success(ASK_MERGE, actor=worker.worker)
    merge(worker)
    merged_lines = [line for line in worker.main_agent_lines() if "merge-ask:1" in line]
    worker.story.expect_rows(len(merged_lines) == 1, detail=str(worker.main_agent_lines()))


def test_27_a_plan_of_three_phases_is_merged_once(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3, 4))
    worker.end_all_tests()
    worker.end_all_tests()
    worker.story.expect_success(ASK_MERGE, actor=worker.worker)
    merge(worker)
    merged_lines = [line for line in worker.main_agent_lines() if "merge-ask:1" in line]
    worker.story.expect_rows(len(merged_lines) == 1, detail=str(worker.main_agent_lines()))


def test_a_worker_waiting_with_its_unit_committed_is_woken_by_the_pass(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3))
    worker.end_all_tests()
    lines = " | ".join(worker.worker_lines())
    worker.story.expect_rows("passed on your commit" in lines or "Point: merge_due" in worker.status(), detail=lines)


def test_a_stop_of_a_worker_whose_unit_is_committed_is_no_report(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3))
    previous = worker.main_agent_lines()
    worker.stop()
    worker.story.expect_rows(worker.main_agent_lines() == previous, detail=str(worker.main_agent_lines()))
