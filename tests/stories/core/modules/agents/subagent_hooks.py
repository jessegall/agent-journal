from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_subagents_start_with_no_main_agent_starts_nothing(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.hook("s-1", HookSamples.session_start().with_fields(subagent="sub-1"))
    story.expect_success("agent list --environment 1", "nothing found")


def test_a_subagents_stop_that_is_let_through_ends_its_row(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    main = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    helper = hook_agent(story, story.hook("s-1", HookSamples.session_start().with_fields(subagent="sub-1")))
    story.hook("s-1", HookSamples.stop().with_fields(subagent="sub-1"))
    story.run_listeners()
    story.expect_text(f"agent show {helper.id}", "ended_at: 2026")
    story.expect_absent(f"agent show {main.id}", "ended_at: 2026-10-31T09:00:00.000000+00:00")
