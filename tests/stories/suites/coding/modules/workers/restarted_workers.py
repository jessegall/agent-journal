from datetime import timedelta

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID, missing_program, replaced_launcher, running_worker, start_launcher, worker_story

__all__ = ["missing_program", "running_worker", "worker_story"]

CONTEXT_TOKENS = 400000


@pytest.fixture
def limited_worker(running_worker):
    story = running_worker
    story.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=story.user)
    story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {CONTEXT_TOKENS} --project", actor=story.user)
    save_status_file(story, story.row(Agent, story.worker.id).session, {"context_window": {"total_input_tokens": CONTEXT_TOKENS}})
    start_launcher(story, b"running\n", request_count=10)
    story.expect_success(f"agent end {story.worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.run(f'worker send --wait {story.worker.id} "Add the tax"', actor=story.agent)
    story.run_listeners()
    return story


def test_a_limited_worker_starts_its_new_session_again_when_the_launcher_still_holds_its_program(limited_worker):
    story = limited_worker
    launcher = replaced_launcher(story, b"running\n", b"stopped\n", f"started {RESUMED_PID}\n".encode())
    WorkerResumeRetry()(story.container)
    session = story.row(Agent, story.worker.id).session
    first, second = launcher.requests[0]["command"], launcher.requests[2]["command"]
    story.expect_rows("--session-id" in first, "--session-id" in second, session in second, "--resume" not in first, "--resume" not in second, detail=str(launcher.requests))
