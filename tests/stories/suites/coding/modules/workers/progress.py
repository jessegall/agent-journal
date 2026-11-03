import json
from datetime import timedelta

from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def test_a_second_dispatch_counts_only_its_tasks_from_its_worktree_start(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    first = checked_worker(story, repository)
    story.advance(timedelta(hours=2))
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {first.id}", actor=story.agent)
    story.run('task make "Add tax" --environment main', actor=story.agent)
    second = dispatched_worker(story, "worker dispatch --model sonnet 2")
    rows = json.loads(story.run("worker progress --environment main --json", actor=story.agent).output_text)["rows"]
    progress = next(row for row in rows if row["agent_id"] == second.id)
    assert (progress["completed_count"], progress["task_count"]) == (0, 1)
    assert progress["started_at"] == story.clock.timestamp().text
    assert progress["finished_at"] is None


def test_a_report_and_a_correction_keep_the_worktree_progress(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    before = story.run("worker progress --environment main --json", actor=story.agent).output_text
    assert json.loads(before)["rows"][0]["task_count"] == 1
    story.advance(timedelta(hours=1))
    story.expect_success('worker report "The proof is ready"', actor=worker)
    story.expect_success(f'worker send {worker.id} "Correct the total"', actor=story.agent)
    after = story.run("worker progress --environment main --json", actor=story.agent).output_text
    assert json.loads(after) == json.loads(before)
