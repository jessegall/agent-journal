import json
from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.shell_sandbox import ShellSandbox
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.agents.support.launch_answer import LaunchAnswer
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox
from core.testing.story_fixture import StoryFixture
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.modules.workers.merger import merger_of
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, delivered_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.test_queue import PROOF, ended, recording_launch


class OrchestratorWithPerson(StoryFixture):
    parent = OrchestratorWithOpenTask

    def steps(self, story):
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)


@pytest.fixture(params=[True, False], ids=["merger-on", "merger-off"])
def waiting_place(new_story, monkeypatch, request):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_success(f"setting set journal.suites.coding.workers.merger-on {str(request.param).lower()} --project", actor=story.user)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(LauncherLink, "is_running", property(lambda _link: True))
    launches = []

    def launch(_launcher, agent, _environment, _command):
        launches.append(agent.id)
        return LaunchAnswer.STARTED

    monkeypatch.setattr(AgentLauncher, "hand", launch)
    tests = recording_launch(monkeypatch)
    repository = repository_environment(story)
    first = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(first.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=first)
    story.expect_success("worker deliver --wait --differences none", actor=first)
    story.run_listeners()
    task = story.new_row_id('task make "Next job" --brief "Change the next file" --environment main', actor=story.agent)
    second = Actor(story.new_row_id(f"worker dispatch --model sonnet {task}", actor=story.agent), ActorType.AGENT)
    story.expect_success(f"agent end {first.id}", actor=story.agent)
    story.expect_success(f"agent end {second.id}", actor=story.agent)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 1 --environment main", actor=story.user)
    story.advance(timedelta(seconds=1))
    story.expect_success(f'worker send --wait {second.id} "Continue the job"', actor=story.agent)
    story.run_listeners()
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield story, repository, first, second, tests, launches, request.param, server, cookie


def expect_working(server, cookie, worker_id, status):
    code, data = window_data(server, cookie, keys="agents", window="agents.agents", query="environment=main&agents.show=running&agents.roles=worker")
    rows = data["keys"]["agents"]["value"]["rows"]
    matching = [row for row in rows if row["id"] == worker_id]
    assert code == 200 and len(matching) == 1, data
    assert matching[0]["facts"]["work_status"] == status, matching
    code, settings = window_data(server, cookie, keys="limits", window="coding.agent-settings")
    assert code == 200, settings
    limits = settings["keys"]["limits"]["value"]["rows"]
    assert next(row for row in limits if row["key"] == "worker")["running"] == 1, limits
    code, shell = window_data(server, cookie, keys="usage", window="viewer.shell")
    agents = shell["keys"]["usage"]["value"]["agents"]
    assert code == 200 and next(row for row in agents if row["id"] == worker_id)["work_status"] == status, shell


@pytest.fixture
def tested_place(waiting_place):
    story, repository, first, second, tests, launches, merger_on, server, cookie = waiting_place
    expect_working(server, cookie, first.id, "tests running")
    WorkerResumeRetry()(story.container)
    story.expect_rows(launches.count(second.id) == 1)
    ended(story, tests[0], 0)
    story.expect_text("proof show 1", "state: checked", actor=story.agent)
    expect_working(server, cookie, first.id, "waiting for the merge")
    story.expect_rows(launches.count(second.id) == 1)
    return waiting_place


def test_delivery_holds_the_place_while_tests_and_the_merger_run_then_merge_frees_it(tested_place):
    story, repository, first, second, tests, launches, merger_on, server, cookie = tested_place
    merger = merger_of(story)
    if merger_on:
        story.expect_rows(merger is not None, story.row(Agent, merger.id).ended_at is None)
        actor = Actor(merger.id, ActorType.AGENT)
        story.expect_text("merger next", f"worker {first.id}", actor=actor)
        repository.checkout(ENVIRONMENT_BRANCH)
        story.expect_success(f"merger merge {first.id}", actor=actor)
    else:
        story.expect_rows(merger is None)
        repository.checkout(ENVIRONMENT_BRANCH)
        story.expect_success(f"worker logs {first.id}", actor=story.agent)
        story.expect_success(f"worker merge --wait {first.id}", actor=story.agent)
    WorkerResumeRetry()(story.container)
    story.expect_rows(launches.count(second.id) == 2)


def test_unchecked_work_keeps_its_status_and_place_when_sent_back(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 1 --environment main", actor=story.user)
    launches = []
    story.advance(timedelta(seconds=1))
    monkeypatch.setattr(AgentLauncher, "hand", lambda _launcher, agent, _environment, _command: launches.append(agent.id) or LaunchAnswer.STARTED)
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        expect_working(server, cookie, worker.id, "judging")
        story.expect_success(f'worker send --wait {worker.id} "Correct the calculation"', actor=story.agent)
        story.run_listeners()
        expect_working(server, cookie, worker.id, "changes requested")
        story.expect_rows(worker.id in launches)


@pytest.mark.parametrize("waiting_place", [True], indirect=True, ids=["merger-on"])
def test_work_returned_to_the_main_agent_keeps_the_place_until_release(waiting_place):
    story, _, first, second, tests, launches, _, server, cookie = waiting_place
    ended(story, tests[0], 0)
    merger = merger_of(story)
    story.expect_success(f'merger pass {first.id} "Needs a decision"', actor=Actor(merger.id, ActorType.AGENT))
    story.expect_text("merger-line list", "Needs a decision", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "merger-line:", actor=story.agent)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "Needs a decision", actor=story.agent)
    expect_working(server, cookie, first.id, "with the main agent")
    story.expect_rows(launches.count(second.id) == 1)
    story.expect_success(f'worker release {first.id} "Keep the branch for later"', actor=story.agent)
    WorkerResumeRetry()(story.container)
    story.expect_rows(launches.count(second.id) == 2)
