import pytest

from core.testing.fake_launcher import FakeLauncher
from core.modules.drivers.support.access_nudges import ENDED_AGENT, UNKNOWN_AGENT
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES

CLEAR_END = HookSamples.sample("session_end").with_raw({"reason": "clear"})
CLEAR_START = HookSamples.session_start().with_raw({"source": "clear"})


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
    story.expect_rows("launch name worker-99" in story.system_log_text())


def test_a_workers_tool_no_agent_holds_is_refused(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.expect_hook_refusal("t-8", HookSamples.edit("a.py").with_fields(program="codex", launch="worker-98", role="worker"), UNKNOWN_AGENT.nudge().text)


def test_a_session_under_a_claude_workers_launch_name_leaves_the_session_its_row_holds(started_main_agent):
    story, main = started_main_agent
    worker_id = story.new_row_id(f"agent start t-1 claude worker --parent {main.id} --environment main")
    story.expect_hook_silent("t-9", HookSamples.session_start().with_fields(launch="t-1"))
    story.expect_text(f"agent show {worker_id}", "session: t-1")
    story.expect_rows("whose worker" in story.system_log_text())


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
    story.expect_rows("launch name t-1" not in story.system_log_text())


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


def test_a_codex_worker_ended_before_its_first_hook_is_refused_its_tools_and_its_program_stopped(started_main_agent):
    story, main = started_main_agent
    worker_id = story.new_row_id(f"agent start worker-7 codex worker --parent {main.id} --environment main")
    story.run(f"agent end {worker_id}")
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_hook_refusal("t-7", HookSamples.edit("a.py").with_fields(program="codex", launch="worker-7"), ENDED_AGENT.nudge().text)
    launcher.drain_requests()
    story.expect_rows(launcher.requests == [{"agent_id": worker_id, "stop": True}], "launch name worker-7" not in story.system_log_text())
    story.expect_absent("agent list --environment main", "t-7")


def test_a_worker_that_ended_under_its_own_session_is_refused_its_tools(started_main_agent):
    story, main = started_main_agent
    worker_id = story.new_row_id(f"agent start t-2 claude worker --parent {main.id} --environment main")
    story.run(f"agent end {worker_id}")
    story.expect_hook_refusal("t-2", HookSamples.edit("a.py"), ENDED_AGENT.nudge().text)


def test_a_clear_under_a_launch_keeps_the_agent_on_the_new_session_id(launched_main):
    story, launched_id = launched_main
    story.hook("s-3", CLEAR_END.with_fields(launch="main-3"))
    story.expect_absent(f"agent show {launched_id}", "ended_at: 20")
    cleared = hook_agent(story, story.hook("s-2", CLEAR_START.with_fields(launch="main-3")))
    story.expect_rows(cleared.id == launched_id)
    story.expect_text(f"agent show {launched_id}", "session: s-2")


def test_a_clear_after_a_resume_keeps_the_resumed_agent_on_the_new_session_id(resumed_main):
    story, old, _, _ = resumed_main
    story.hook("s-1", CLEAR_END.with_fields(launch="main-3"))
    cleared = hook_agent(story, story.hook("s-2", CLEAR_START.with_fields(launch="main-3")))
    story.expect_rows(cleared.id == old.id)
    story.expect_text(f"agent show {old.id}", "session: s-2")


def test_a_session_end_under_a_launch_that_is_no_clear_ends_the_agent(launched_main):
    story, launched_id = launched_main
    story.hook("s-3", HookSamples.sample("session_end").with_fields(launch="main-3"))
    story.expect_text(f"agent show {launched_id}", "ended_at: 20")


def test_a_new_session_under_a_launch_that_is_no_clear_never_takes_the_agent(launched_main):
    story, launched_id = launched_main
    story.expect_hook_silent("s-9", HookSamples.session_start().with_fields(launch="main-3"))
    story.expect_text(f"agent show {launched_id}", "session: s-3")
    story.expect_rows("launch name main-3" in story.system_log_text())


@pytest.fixture
def launched_main(started_main_agent):
    story, old = started_main_agent
    story.run(f"agent end {old.id}")
    launched_id = story.new_row_id("agent start main-3 claude main --environment main")
    hook_agent(story, story.hook("s-3", HookSamples.session_start().with_fields(launch="main-3")))
    return story, launched_id


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
