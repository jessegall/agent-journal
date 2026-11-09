import pytest
from datetime import timedelta

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


@pytest.mark.real_git
def test_a_second_dispatch_shows_only_its_worktree_totals_and_keeps_its_pace_on_resume(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    first = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {first.id}", actor=story.agent)
    story.advance(timedelta(hours=2))
    for title in ("Add tax", "Add receipt"):
        story.run(f'task make "{title}" --environment main', actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch --model sonnet 2 3")
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_browser(server, "workerProgress.browser.mjs", [str(worker.id), story.clock.timestamp().text, "0 of 2 tasks", "", "new"])
        story.advance(timedelta(minutes=30))
        story.expect_success('task close 2 --outcome "Tax added"', actor=worker)
        story.expect_success("worker next --wait --differences none", actor=worker)
        story.expect_success(f"agent end {worker.id}")
        session = worker_session(story, worker)
        story.expect_success(f"agent start {session} claude worker --environment main --process-started-at {story.clock.timestamp().text}")
        expect_browser(server, "workerProgress.browser.mjs", [str(worker.id), story.clock.timestamp().text, "1 of 2 tasks", "2 per hour", "resumed"])
