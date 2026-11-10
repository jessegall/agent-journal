from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_settings import COLD_SESSION_CONTEXT_PERCENT
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from tests.stories.core.modules.helpers.helper_jobs import resumable_session
from tests.stories.core.modules.usage.support.status_files import full_status
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID
from tests.stories.suites.coding.modules.workers.gone_workers import ended_worker, missing_program, replaced_launcher, running_worker, start_launcher, worker_story

__all__ = ["ended_worker", "missing_program", "running_worker", "worker_story"]

JOB = "Add the tax"


@pytest.fixture
def stopped_worker(ended_worker):
    """A worker whose program ended and whose end has been settled, with its worktree still open."""
    stop_launcher = replaced_launcher(ended_worker, b"running\n", b"stopped\n")
    ended_worker.run_listeners()
    stop_launcher.drain_requests()
    stop_launcher.server.close()
    return ended_worker


def with_job(story, minutes, percent):
    worker = story.row(Agent, story.worker.id)
    full_status(story, worker.session, percent, 0.0)
    story.advance(timedelta(minutes=minutes))
    launcher = start_launcher(story, f"started {RESUMED_PID}\n".encode())
    story.expect_success(f'worker send --wait {agent_number(story, worker.id)} "{JOB}"', actor=story.agent)
    story.expect_success(f"agent end {worker.id}", actor=story.user)
    story.container.get(WorkerResume).resume(story.row(Agent, worker.id), story.agent)
    launcher.drain_requests()
    return worker, launcher.requests[0]


def test_a_cold_worker_starts_a_new_session_and_keeps_its_agent_and_worktree(stopped_worker):
    folder = stopped_worker.container.get(WorktreeQuery).worker_worktree(stopped_worker.worker.id).folder
    worker, request = with_job(stopped_worker, 55, 20)
    replaced = stopped_worker.row(Agent, worker.id)
    worktree = stopped_worker.container.get(WorktreeQuery).worker_worktree(worker.id)
    prompt = " ".join(request["command"])
    stopped_worker.expect_rows(replaced.session != worker.session, request["session"] == replaced.session, "--resume" not in request["command"], worktree.folder == folder,
                               f"You are worker {worker.id}." in prompt, JOB in prompt, f"journal task overview {worktree.task_id}" in prompt, detail=prompt)


@pytest.mark.parametrize("minutes, percent", [(49, 100), (50, 19), (0, 0)], ids=["warm", "small and under an hour", "just stopped"])
def test_a_worker_idle_under_an_hour_that_is_warm_or_small_resumes_its_own_session(stopped_worker, monkeypatch, minutes, percent):
    resumable_session(stopped_worker, stopped_worker.row(Agent, stopped_worker.worker.id), monkeypatch)
    worker, request = with_job(stopped_worker, minutes, percent)
    stopped_worker.expect_rows(stopped_worker.row(Agent, worker.id).session == worker.session, "--resume" in request["command"], worker.session in request["command"], detail=str(request))


def test_with_the_check_off_a_worker_idle_over_an_hour_still_gets_a_new_session(stopped_worker):
    stopped_worker.expect_success(f"setting set {COLD_SESSION_CONTEXT_PERCENT} 0 --project", actor=stopped_worker.user)
    worker, request = with_job(stopped_worker, 300, 100)
    stopped_worker.expect_rows(stopped_worker.row(Agent, worker.id).session != worker.session, "--resume" not in request["command"], detail=str(request))
