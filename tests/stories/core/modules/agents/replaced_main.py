from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.process.leftover_process import LeftoverProcess
from core.modules.drivers.support.access_nudges import ENDED_AGENT
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import SampleSuiteChoice
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.engine.driver.support.samples import SAMPLES


@pytest.fixture
def replaced_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    return story, hook_agent(story, story.hook("s-1", HookSamples.session_start()))


def test_a_second_session_stops_a_program_under_its_pid_only_afterwards(new_story, monkeypatch):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    stopped_pids: list[int] = []
    monkeypatch.setattr(LeftoverProcess, "stop", lambda pid, program: stopped_pids.append(pid) or True)
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: "" if pid in stopped_pids or pid != 4242 else "claude"))
    story.run("agent start s-5 claude main --pid 4242 --environment main")
    story.hook("s-6", HookSamples.session_start())
    story.expect_rows(stopped_pids == [])
    story.run_listeners()
    story.expect_rows(stopped_pids == [4242])


def test_the_replaced_sessions_next_tool_is_refused_with_no_record(replaced_story):
    story, old = replaced_story
    story.hook("s-2", HookSamples.session_start())
    recorded_hook_rows = story.run(f"hook-call list --agent {old.id}").output_text
    story.expect_hook_refusal("s-1", HookSamples.edit("a.py"), ENDED_AGENT.nudge().text)
    story.expect_rows(story.run(f"hook-call list --agent {old.id}").output_text == recorded_hook_rows)


def test_two_launches_at_once_are_one_main_agent_on_the_session_of_the_last(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    first_id = story.new_row_id("agent start launch-a claude main --environment main")
    second_id = story.new_row_id("agent start launch-b claude main --environment main")
    story.expect_rows(first_id == second_id)
    story.expect_text(f"agent show {agent_number(story, second_id)}", "session: launch-b")
    story.expect_absent(f"agent show {agent_number(story, second_id)}", "ended_at: 20")


def test_a_worker_that_starts_ends_no_main(replaced_story):
    story, old = replaced_story
    story.run(f"agent start w-1 claude worker --parent {old.id} --environment main")
    story.expect_absent(f"agent show {agent_number(story, old.id)}", "ended_at: 20")


def test_an_agent_cannot_register_a_main_agent_that_would_end_the_running_one(replaced_story):
    story, running = replaced_story
    story.expect_refusal("agent start story-ada-1 claude main --environment main", f"main agent {running.id} runs in this environment, and an agent does not replace it",
                         actor=running)
    story.expect_absent(f"agent show {agent_number(story, running.id)}", "ended_at: 20")
