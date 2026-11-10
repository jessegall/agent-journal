from datetime import timedelta
from pathlib import Path

import pytest

from engine.actor.actor import Actor
from core.base.provider.launch_command import LaunchCommand
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.agents.support.launch_answer import LaunchAnswer
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.environments.models.environment import Environment
from core.testing.fake_launcher import FakeLauncher
from engine.enums.actor_type import ActorType
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.modules.helpers.usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import LIMIT, with_reported_usage
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.test_queue import ended, queued_story

TICKS = 10


def person(story) -> Actor:
    return Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)


def worker_count(story) -> int:
    return story.container.get(Queries).query(Agent).filter(role="worker").count()


def waiting_lines(story, worker) -> int:
    return story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id, state=AgentLineState.WAITING).count()


@pytest.fixture
def launches(monkeypatch):
    requests = []

    def request_launcher(link, request, answer_bytes=0):
        if "command" in request:
            requests.append(request)
        return b"started\n"

    monkeypatch.setattr(LauncherLink, "request_launcher", request_launcher)
    return requests


def test_a_worker_that_ends_with_its_task_unfinished_is_not_restarted_on_any_of_ten_ticks_and_is_resumed_after_the_limit_is_lifted(new_story, launches):
    story = with_reported_usage(new_story(fixture=MergerOffOrchestrator))
    repository_environment(story)
    owner = person(story)
    worker = dispatched_worker(story)
    story.expect_success(LIMIT, actor=owner)
    report(story, 55)
    launches.clear()
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    waiting = waiting_lines(story, worker)
    for _ in range(TICKS):
        WorkerResumeRetry()(story.container)
    story.expect_rows(launches == [], waiting > 0, waiting_lines(story, worker) == waiting, story.row(Agent, worker.id).ended_at is not None, detail=f"{len(launches)} launches, {waiting} waiting lines")
    story.expect_success("usage-limit delete 1", actor=owner)
    WorkerResumeRetry()(story.container)
    story.expect_rows(len(launches) == 1, detail=f"{len(launches)} launches")


def test_the_launcher_answers_locked_down_and_asks_nothing_of_the_launcher_for_a_program_at_its_limit(new_story, launches):
    story = with_reported_usage(new_story(fixture=MergerOffOrchestrator))
    story.expect_success(LIMIT, actor=person(story))
    report(story, 55)
    agent = story.row(Agent, story.agent.id)
    environment = story.row(Environment, agent.environment_id)
    answer = story.container.get(AgentLauncher).hand(agent, environment, LaunchCommand(["claude"], Path(environment.folder), {}))
    story.expect_rows(answer is LaunchAnswer.LOCKED_DOWN, launches == [])


def test_the_merger_is_not_started_by_the_retry_at_the_limit_and_is_started_after_it_is_lifted(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    with_reported_usage(story)
    owner = person(story)
    story.expect_success(LIMIT, actor=owner)
    report(story, 55)
    ended(story, started[0], 0)
    repository.checkout(ENVIRONMENT_BRANCH)
    for _ in range(TICKS):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)
    story.expect_success("usage-limit delete 1", actor=owner)
    FakeLauncher.listening(story.home.socket("launcher"))
    MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is not None)
