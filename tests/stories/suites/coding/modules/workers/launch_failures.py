from datetime import timedelta

import pytest

from core.base.journal_home import LAUNCHER_SOCKET
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, dispatched_worker, repository_environment, worker_session
from core.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.support.story_checks import expect_count_shown, expect_requests_launcher


@pytest.mark.parametrize("answer", [None, b"failed\n"])
def test_a_failed_launch_tells_the_main_agent(new_story, answer):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=answer) if answer is not None else None
    worker = dispatched_worker(story)
    story.run_listeners()
    if launcher is not None:
        launcher.expect_started(worker.id, worker_session(story, worker), repository.worktree_folder(worker.id))
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"agent:{worker.id} could not start")


def test_a_failed_resume_tells_the_main_agent_once_while_the_retries_go_on(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project")
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answers=(b"started\n", b"failed\n"), request_count=5)
    worker = checked_worker(story, repository)
    story.run_listeners()
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "could not start")
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    story.expect_success(f'worker send --wait {worker.id} "Add the tax"', actor=story.agent)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    WorkerResumeRetry()(story.container)
    launcher.expect_started(worker.id, worker_session(story, worker), repository.worktree_folder(worker.id))
    expect_requests_launcher(launcher, 5)
    lines = story.run(f"agent-line list --agent {story.agent.id}").output_text
    expect_count_shown(lines, f"agent:{worker.id} could not start", 1)
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax", "waiting")
