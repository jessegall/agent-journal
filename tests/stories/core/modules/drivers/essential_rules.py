from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support import story_lines as lines


def test_a_stop_refused_five_times_in_a_row_goes_through_the_next_time_with_a_line_to_report_it(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.refuse-stops true")
    for _ in range(5):
        story.expect_hook_refusal("s-1", HookSamples.stop(), "the sample lead may not stop yet")
    story.expect_hook_allowed("s-1", HookSamples.stop(), "your stop was refused five times in a row")


def test_a_session_end_ends_its_agent(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.sample("session_end"))
    story.expect_text(f"agent show {story.agent.id}", "ended_at: 2026")


def test_a_suite_in_complete_control_still_asks_an_essential_rule_the_user_allowed(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("suite choose control --environment main")
    story.run("driver allow-essential samples.essential-claim", actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_text(lines.SECOND_HOOK_CALL, "samples.essential-claim: lines")
