import json

from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_worker  # noqa: F401
from tests.stories.suites.coding.modules.workers.free_commits import commit_tasks_singly
from tests.stories.suites.coding.modules.workers.support.phase_steps import StoryWorker

"""A fresh worker takes over a stopped worker's open worktree, with its commits, its tasks and its plan (task 9025)."""

TAKEOVER = "worker dispatch --take-over {number} --test-command python=pytest --model sonnet"


def open_worktree_owner(worker: StoryWorker) -> int:
    listed = json.loads(worker.story.run("worker-worktree list --json --environment main", actor=worker.story.agent).output_text)
    return next(row["session_agent_id"] for row in listed["rows"] if row["state"] != "removed")


def test_a_new_worker_takes_over_the_open_worktree_the_tasks_and_the_plan_of_a_stopped_worker(planned_worker):
    commit_tasks_singly(planned_worker, (1,))
    planned_worker.story.run("task start 2", actor=planned_worker.worker)
    planned_worker.story.end_session(planned_worker.worker)
    planned_worker.story.expect_success(TAKEOVER.format(number=planned_worker.worker.id), actor=planned_worker.story.agent)
    new_id = open_worktree_owner(planned_worker)
    planned_worker.story.expect_rows(new_id != planned_worker.worker.id, detail=str(new_id))
    planned_worker.story.expect_text("task info 2", f"assigned to: agent {new_id}", actor=planned_worker.story.agent)
    planned_worker.story.expect_text("task show 2", "state: started", f"holder_id: {new_id}", actor=planned_worker.story.agent)
    planned_worker.story.expect_text(f"worker status {new_id}", "Unit: plan 1", actor=planned_worker.story.agent)


def test_a_running_worker_is_not_taken_over(planned_worker):
    planned_worker.story.expect_refusal(TAKEOVER.format(number=planned_worker.worker.id), "is still running", actor=planned_worker.story.agent)
