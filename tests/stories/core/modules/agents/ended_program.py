from datetime import datetime, timezone

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.caller.process_row import ProcessRow
from core.base.command.bus import Bus
from core.base.leftover_process import LeftoverProcess
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.timestamp import Timestamp
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.fixtures import UserJoined

PROGRAM_PID = 4242
CHILD_PID = 4243
GRANDCHILD_PID = 4244
PROCESS_STARTED_AT = Timestamp(datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc))
ROLES = ("worker", "helper", "reviewer", "verifier")


def running_launcher(story) -> FakeLauncher:
    return FakeLauncher(story.home.socket("launcher"), answer=b"stopped\n", request_count=2)


def stops_of(*agent_ids: int) -> list[dict[str, object]]:
    return [{"agent_id": agent_id, "stop": True} for agent_id in agent_ids]


def started_agent(story, role: str) -> tuple[int, FakeLauncher]:
    agent_id = story.new_row_id(f"agent start s-program claude {role} --parent {story.agent.id} --environment main")
    return agent_id, running_launcher(story)


@pytest.mark.parametrize("role", ROLES)
def test_an_agent_another_agent_ended_gets_one_stop(new_story, role):
    story = new_story(fixture=UserJoined)
    agent_id, launcher = started_agent(story, role)
    story.expect_success(f"agent end {agent_id}", actor=story.agent)
    story.run_listeners()
    story.expect_rows(launcher.requests == stops_of(agent_id))


@pytest.mark.parametrize("role", ROLES)
def test_an_agent_a_person_ended_gets_one_stop(new_story, role):
    story = new_story(fixture=UserJoined)
    agent_id, launcher = started_agent(story, role)
    story.expect_success(f"agent end {agent_id}", actor=story.user)
    story.run_listeners()
    story.expect_rows(launcher.requests == stops_of(agent_id))


@pytest.mark.parametrize("role", ROLES)
def test_an_agent_that_ended_itself_gets_no_stop(new_story, role):
    story = new_story(fixture=UserJoined)
    agent_id, launcher = started_agent(story, role)
    story.expect_success(f"agent end {agent_id}", actor=Actor(agent_id, ActorType.AGENT))
    story.run_listeners()
    story.expect_rows(launcher.requests == [])


def test_a_main_agent_a_person_ended_gets_one_stop(new_story):
    story = new_story(fixture=UserJoined)
    launcher = running_launcher(story)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.run_listeners()
    story.expect_rows(launcher.requests == stops_of(story.agent.id))


def test_a_main_agent_that_ended_itself_gets_no_stop(new_story):
    story = new_story(fixture=UserJoined)
    launcher = running_launcher(story)
    story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    story.run_listeners()
    story.expect_rows(launcher.requests == [])


def test_a_program_stop_waits_for_its_own_round_and_holds_no_ordinary_listener(new_story):
    story = new_story(fixture=UserJoined)
    worker_id, launcher = started_agent(story, "worker")
    story.container.get(Bus).run(EndAgent(worker_id), story.user, environment_id=story.row(Agent, worker_id).environment_id)
    runner = story.container.get(CommitListenerRunner)
    runner.run_ordinary()
    story.expect_rows(launcher.requests == [])
    runner.run_program_stops()
    story.expect_rows(launcher.requests == stops_of(worker_id))


def test_a_stop_command_stops_the_program_itself_and_the_listener_adds_no_second_stop(new_story):
    story = new_story(fixture=UserJoined)
    worker_id, launcher = started_agent(story, "worker")
    story.expect_success(f"agent stop {worker_id}", f"stopped agent {worker_id}", actor=story.user)
    story.expect_rows(launcher.requests == stops_of(worker_id))
    story.run_listeners()
    story.expect_rows(launcher.requests == stops_of(worker_id))


def test_with_no_launcher_the_recorded_process_stops_after_the_processes_under_it(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    stopped_pids: list[int] = []
    monkeypatch.setattr(LeftoverProcess, "stop", lambda pid, program: stopped_pids.append(pid))
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: "" if stopped_pids else f"program {pid}"))
    story.use_processes(ProcessRow(CHILD_PID, PROGRAM_PID, PROCESS_STARTED_AT), ProcessRow(GRANDCHILD_PID, CHILD_PID, PROCESS_STARTED_AT))
    worker_id = story.new_row_id(f"agent start s-program claude worker --parent {story.agent.id} --pid {PROGRAM_PID} --environment main")
    story.expect_success(f"agent end {worker_id}", actor=story.user)
    story.run_listeners()
    story.expect_rows(stopped_pids == [GRANDCHILD_PID, CHILD_PID, PROGRAM_PID])
