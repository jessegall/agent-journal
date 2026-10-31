from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_sessions_first_hook_starts_its_agent_and_gives_its_drivers_opening_lines(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "You are the sample lead")
    story.expect_text("agent list --role main", "s-1")


def test_a_subagents_first_hook_starts_a_subagent_row_under_its_agent(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    main = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.hook("s-1", HookSamples.stop().with_fields(subagent="sub-1"))
    story.expect_text(f"agent list --parent {main.id} --role subagent", "sub-1")


def test_a_resumed_sessions_first_hook_reopens_its_agent_instead_of_starting_another(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    first = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run(f"agent end {first.id}")
    resumed = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.expect_rows(resumed == first)
    story.expect_text("agent list --role main", "s-1")
