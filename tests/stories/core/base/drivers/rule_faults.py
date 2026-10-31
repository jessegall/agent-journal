from core.base.actor import Actor, ActorType
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_rule_that_raises_is_recorded_written_to_the_error_log_and_the_others_still_answer(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_hook_through("s-1", HookSamples.stop(), "the lead stops here", "the journal's rule samples.failing-rule failed and was passed by")
    story.expect_success("hook-call show 2", "samples.failing-rule: raised")
    story.expect_rows("the sample rule failed" in story.error_log_text())


def test_a_rule_another_module_marks_essential_is_ordinary_until_a_person_allows_it_and_an_agent_cannot(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_success("driver show samples.lead", "samples.essential-claim: essential, waiting for the user")
    story.expect_refusal("driver allow-essential samples.essential-claim", "only a person allows a rule to be essential", actor=Actor(1, ActorType.AGENT))
    story.run("driver allow-essential samples.essential-claim", actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_success("hook-call show 3", "samples.essential-claim: told")
    story.expect_rows(story.hook("s-1", HookSamples.stop()).lines[0] == "the sample rule speaks first")
