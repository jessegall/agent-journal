from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


def test_the_main_agent_edits_no_file_in_a_workers_worktree(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    folder = story.container.get(WorktreeQuery).worker_worktree(worker.id).folder
    story.expect_hook_refusal("s-1", HookSamples.edit(f"{folder}/cart.py"), f"that file is in worker {worker.id}'s worktree")
    story.expect_hook_allowed("s-1", HookSamples.edit("/elsewhere/cart.py"))


def test_a_worker_silent_for_thirty_minutes_is_told_to_log(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    finished = HookSamples.edit("cart.py").with_fields(event="post_tool_use")
    story.expect_absent_hook_line(session, finished, "you logged nothing")
    story.advance(timedelta(minutes=31))
    assert any("you logged nothing for 31 min" in line for line in story.hook(session, finished).lines)
