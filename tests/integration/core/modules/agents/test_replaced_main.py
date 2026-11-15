from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.process.leftover_process import LeftoverProcess
from core.modules.drivers.nudges.replaced_session_nudge import ReplacedSessionNudge
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import SampleSuiteChoice
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.engine.driver.support.samples import SAMPLES


@pytest.fixture
def replaced_story(played):
    story = played(SampleSuiteChoice, SAMPLES)
    return story, hook_agent(story, story.hook("s-1", HookSamples.session_start()))


def test_a_second_session_stops_a_program_under_its_pid_only_afterwards(played, monkeypatch):
    story = played(SampleSuiteChoice, SAMPLES)
    stopped_pids: list[int] = []
    monkeypatch.setattr(LeftoverProcess, "stop", lambda pid, program: stopped_pids.append(pid) or True)
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: "" if pid in stopped_pids or pid != 4242 else "claude"))
    story.run("agent start s-5 claude main --pid 4242 --environment main")
    story.hook("s-6", HookSamples.session_start())
    story.expect_rows(stopped_pids == [])
    story.run_listeners()
    story.expect_rows(stopped_pids == [4242])








