from dataclasses import replace
from pathlib import Path
from types import SimpleNamespace

from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.support.agent_resume import AgentResume
from engine.provider.launch_command import LaunchCommand
from engine.time.timestamp import Timestamp

NOW = Timestamp.parsed("2026-10-31T09:00:00+00:00")
COMMAND = LaunchCommand(arguments=("claude", "--resume", "s-1"), folder=Path("/work/journal"), variables={"JOURNAL_ENV": "main"})
HELPER = Agent(id=41, environment_id=1, number=2, creator_id=1, session="s-1", program="claude", role="helper", ended_at=NOW)
WORKER = replace(HELPER, id=42, number=3, role="worker")


def recording_dispatcher(started: list) -> SimpleNamespace:
    return SimpleNamespace(start=lambda agent, command: started.append((agent.id, command)) or Dispatch.STARTED)


def test_a_helper_and_a_worker_are_started_again_by_the_same_call_of_the_dispatcher():
    started: list = []
    resume = AgentResume(recording_dispatcher(started))
    assert [resume.resume(HELPER, COMMAND), resume.resume(WORKER, COMMAND)] == [Dispatch.STARTED, Dispatch.STARTED]
    assert started == [(41, COMMAND), (42, COMMAND)]


def test_a_paused_agent_is_not_started_again():
    started: list = []
    assert AgentResume(recording_dispatcher(started)).resume(replace(WORKER, paused_at=NOW), COMMAND) is Dispatch.REFUSED
    assert started == []
