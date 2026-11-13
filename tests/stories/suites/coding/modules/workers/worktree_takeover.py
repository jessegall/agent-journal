import json

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.free_commits import commit_tasks_singly
from tests.stories.suites.coding.modules.workers.support.phase_steps import StoryWorker, start_planned_worker

"""A fresh worker takes over a stopped worker's open worktree, with its commits, its tasks and its plan (task 9025)."""

TAKE_OVER = "worker dispatch --take-over {number} --test-command python=pytest --model sonnet"


def open_worktree_owner(worker: StoryWorker) -> int:
    listed = json.loads(worker.story.run("worker-worktree list --json --environment main", actor=worker.story.agent).output_text)
    return next(row["session_agent_id"] for row in listed["rows"] if row["state"] != "removed")


def test_a_new_worker_takes_over_the_open_worktree_the_tasks_and_the_plan_of_a_stopped_worker(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, tuple([1]))
    worker.story.run("task start 2", actor=worker.worker)
    worker.story.expect_success(f"agent end {worker.worker.id}", actor=worker.worker)
    worker.story.expect_success(TAKE_OVER.format(number=agent_number(worker.story, worker.worker.id)), actor=worker.story.agent)
    new_id = open_worktree_owner(worker)
    worker.story.expect_rows(new_id != worker.worker.id, detail=str(new_id))
    worker.story.expect_text("task info 2", f"assigned to: agent {new_id}", actor=worker.story.agent)
    worker.story.expect_text("task show 2", "state: started", f"holder_id: {new_id}", actor=worker.story.agent)
    worker.story.expect_text(f"worker status {agent_number(worker.story, new_id)}", "Unit: plan 1", actor=worker.story.agent)


def test_a_running_worker_is_not_taken_over(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_refusal(TAKE_OVER.format(number=agent_number(worker.story, worker.worker.id)), "is still running", actor=worker.story.agent)
