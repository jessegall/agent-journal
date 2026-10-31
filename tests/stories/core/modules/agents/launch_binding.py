from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_codex_helpers_first_hook_binds_its_session_to_its_row(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    main = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
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


def test_a_claude_helper_is_found_by_the_session_it_was_given(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    main = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    helper_id = story.new_row_id(f"agent start s-2 claude worker --parent {main.id} --environment main")
    helper = hook_agent(story, story.hook("s-2", HookSamples.stop().with_fields(launch="worker-8")))
    story.expect_rows(helper.id == helper_id)
