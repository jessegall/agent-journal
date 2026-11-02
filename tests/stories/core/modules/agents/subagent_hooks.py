from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_subagents_start_with_no_main_agent_starts_nothing(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.hook("s-1", HookSamples.session_start().with_fields(subagent="sub-1"))
    story.expect_success("agent list --environment 1", "nothing found")


def test_a_stop_from_a_subagent_the_journal_has_not_seen_makes_no_row(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.hook("s-1", HookSamples.session_start())
    story.hook("s-1", HookSamples.stop().with_fields(subagent="sub-1"))
    story.run_listeners()
    story.expect_absent("agent list --environment 1", "sub-1")


def test_a_subagents_stop_that_is_let_through_ends_its_row(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    main = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    helper = hook_agent(story, story.hook("s-1", HookSamples.session_start().with_fields(subagent="sub-1")))
    story.hook("s-1", HookSamples.stop().with_fields(subagent="sub-1"))
    story.run_listeners()
    story.expect_text(f"agent show {helper.id}", "ended_at: 2026")
    story.expect_absent(f"agent show {main.id}", "ended_at: 2026-10-31T09:00:00.000000+00:00")


def test_a_helper_whose_stop_never_came_ends_once_it_has_been_silent_for_half_an_hour(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.hook("s-1", HookSamples.session_start())
    helper = hook_agent(story, story.hook("s-1", HookSamples.session_start().with_fields(subagent="sub-1")))
    story.advance(timedelta(minutes=29))
    story.hook("s-1", HookSamples.tick())
    story.expect_absent(f"agent show {helper.id}", "ended_at: 2026")
    story.advance(timedelta(minutes=2))
    story.hook("s-1", HookSamples.tick())
    story.expect_text(f"agent show {helper.id}", "ended_at: 2026")
