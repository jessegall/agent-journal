import pytest

from core.base.leftover_process import LeftoverProcess
from core.modules.drivers.support.access_nudges import ENDED_AGENT
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


@pytest.fixture
def replaced_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    return story, hook_agent(story, story.hook("s-1", HookSamples.session_start()))


def test_a_second_session_ends_the_old_row_in_its_hook_and_the_launcher_stops_the_program_afterwards(replaced_story):
    story, old = replaced_story
    launcher = FakeLauncher(story.home.socket("launcher"), answer=b"stopped\n")
    story.hook("s-2", HookSamples.session_start())
    story.expect_text(f"agent show {old.id}", "ended_at: 20")
    story.expect_rows(launcher.requests == [])
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(launcher.requests == [{"agent_id": old.id, "stop": True}])


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


def test_a_session_that_ends_by_itself_has_no_program_stopped(replaced_story):
    story, _ = replaced_story
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.hook("s-1", HookSamples.sample("session_end"))
    story.run_listeners()
    story.expect_rows(launcher.requests == [])


def test_two_launches_at_once_end_with_one_main_and_the_first_is_stopped(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    first_id = story.new_row_id("agent start launch-a claude main --environment main")
    launcher = FakeLauncher(story.home.socket("launcher"), answer=b"stopped\n")
    second_id = story.new_row_id("agent start launch-b claude main --environment main")
    story.expect_text(f"agent show {first_id}", "ended_at: 20")
    story.expect_absent(f"agent show {second_id}", "ended_at: 20")
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(launcher.requests == [{"agent_id": first_id, "stop": True}])


def test_a_resumed_main_ends_the_main_that_runs_and_keeps_its_own_program(replaced_story):
    story, old = replaced_story
    launch_row_id = story.new_row_id("agent start launch-a claude main --environment main")
    story.expect_text(f"agent show {old.id}", "ended_at: 20")
    launcher = FakeLauncher(story.home.socket("launcher"), answer=b"stopped\n")
    resumed = hook_agent(story, story.hook("s-1", HookSamples.session_start().with_fields(launch="launch-a")))
    story.run_listeners()
    story.expect_rows(resumed.id == old.id, launch_row_id not in [request["agent_id"] for request in launcher.requests])
    story.expect_absent(f"agent show {old.id}", "ended_at: 20")


def test_a_worker_that_starts_ends_no_main(replaced_story):
    story, old = replaced_story
    story.run(f"agent start w-1 claude worker --parent {old.id} --environment main")
    story.expect_absent(f"agent show {old.id}", "ended_at: 20")


def test_an_agent_cannot_register_a_main_agent_that_would_end_the_running_one(replaced_story):
    story, running = replaced_story
    story.expect_refusal("agent start story-ada-1 claude main --environment main", f"main agent {running.id} runs in this environment, and an agent does not replace it",
                         actor=running)
    story.expect_absent(f"agent show {running.id}", "ended_at: 20")
