from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

import pytest

from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID, missing_program, replaced_launcher, running_worker, start_launcher, worker_story

__all__ = ["missing_program", "running_worker", "worker_story"]


@pytest.fixture
def silent_worker(running_worker):
    story = running_worker
    start_launcher(story, b"running\n", request_count=10)
    story.expect_success(f"agent end {story.worker.id}", actor=story.agent)
    story.advance(timedelta(hours=2))
    story.run(f'worker send --wait {agent_number(story, story.worker.id)} "Add the tax"', actor=story.agent)
    story.run_listeners()
    return story


def test_a_worker_silent_for_two_hours_starts_its_new_session_again_when_the_launcher_still_holds_its_program(silent_worker):
    story = silent_worker
    launcher = replaced_launcher(story, b"running\n", b"stopped\n", f"started {RESUMED_PID}\n".encode())
    WorkerResumeRetry()(story.container)
    session = story.row(Agent, story.worker.id).session
    first, second = launcher.requests[0]["command"], launcher.requests[2]["command"]
    story.expect_rows("--session-id" in first, "--session-id" in second, session in second, "--resume" not in first, "--resume" not in second, detail=str(launcher.requests))
