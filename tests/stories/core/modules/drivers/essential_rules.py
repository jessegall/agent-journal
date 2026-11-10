from tests.stories.core.support.agent_labels import agent_number
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support import story_lines as lines


def test_the_main_agents_stop_is_refused_every_time_however_often_it_was_refused_before(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting set samples.refuse-stops true --project")
    for _ in range(8):
        story.expect_hook_refusal("s-1", HookSamples.stop(), "the sample lead may not stop yet")


def test_a_session_end_ends_its_agent(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.sample("session_end"))
    story.expect_text(f"agent show {agent_number(story, story.agent.id)}", "ended_at: 2026")


def test_a_suite_in_complete_control_still_asks_an_essential_rule_the_user_allowed(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("suite choose control --environment main")
    story.run("driver allow-essential samples.essential-claim", actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_text(lines.SECOND_HOOK_CALL, "samples.essential-claim: lines")
