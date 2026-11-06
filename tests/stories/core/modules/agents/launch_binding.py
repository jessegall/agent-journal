import pytest

from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_codex_helpers_first_hook_binds_its_session_to_its_row(started_main_agent):
    story, main = started_main_agent
    helper_id = story.new_row_id(f"agent start worker-7 codex worker --parent {main.id} --environment main")
    helper = hook_agent(story, story.hook("t-1", HookSamples.session_start().with_fields(program="codex", launch="worker-7")))
    story.expect_rows(helper.id == helper_id)
    story.expect_success(f"agent show {helper_id}", "session: t-1")


def test_a_session_under_an_unknown_launch_name_is_let_through_and_logged(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.hook("s-1", HookSamples.session_start())
    story.expect_hook_silent("t-9", HookSamples.session_start().with_fields(program="codex", launch="worker-99"))
    story.expect_absent("agent list --environment 1", "t-9")
    story.expect_rows("launch name worker-99" in story.error_log_text())


def test_a_claude_helper_is_found_by_the_session_it_was_given(started_main_agent):
    story, main = started_main_agent
    helper_id = story.new_row_id(f"agent start s-2 claude worker --parent {main.id} --environment main")
    helper = hook_agent(story, story.hook("s-2", HookSamples.stop().with_fields(launch="worker-8")))
    story.expect_rows(helper.id == helper_id)


@pytest.mark.parametrize("program", ["claude", "codex"])
def test_a_worker_resumed_under_its_own_session_as_launch_name_is_reopened_and_its_hooks_are_kept(started_main_agent, program):
    story, main = started_main_agent
    worker_id = story.new_row_id(f"agent start t-1 {program} worker --parent {main.id} --environment main")
    story.run(f"agent end {worker_id}")
    resumed = hook_agent(story, story.hook("t-1", HookSamples.session_start().with_fields(program=program, launch="t-1")))
    story.expect_rows(resumed.id == worker_id)
    story.expect_absent(f"agent show {worker_id}", "ended_at: 20")
    story.expect_rows("launch name t-1" not in story.error_log_text())


def test_a_launch_that_resumes_an_ended_session_reopens_that_agent_and_ends_the_launch_row(resumed_main):
    story, old, resumed, launch_row_id = resumed_main
    story.expect_rows(resumed.id == old.id)
    story.expect_text(f"agent show {old.id}", "session: s-1")
    story.expect_text(f"agent show {launch_row_id}", "ended_at")


def test_a_resumed_main_is_stopped_through_the_launcher_under_the_row_its_launch_started(resumed_main):
    story, old, _, launch_row_id = resumed_main
    launcher = FakeLauncher(story.home.socket("launcher"), answer=b"stopped\n")
    story.expect_success(f"agent stop {old.id}", f"stopped agent {old.id}")
    story.expect_rows(launcher.requests == [{"agent_id": launch_row_id, "stop": True}])
    story.expect_text(f"agent show {old.id}", "ended_at:")


@pytest.fixture
def resumed_main(started_main_agent):
    story, old = started_main_agent
    story.run(f"agent end {old.id}")
    launch_row_id = story.new_row_id("agent start main-3 claude main --environment main")
    resumed = hook_agent(story, story.hook("s-1", HookSamples.session_start().with_fields(launch="main-3")))
    return story, old, resumed, launch_row_id


@pytest.fixture
def started_main_agent(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    main = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    return story, main
