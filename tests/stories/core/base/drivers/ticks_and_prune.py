from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadLocked, LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_tick_on_which_nothing_is_said_is_not_kept_but_its_history_is(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.tick("s-1")
    story.expect_absent("hook-call list --agent 1", "3  tick")
    story.expect_success("rule-history list --agent 1", "samples.return-line")


def test_a_prune_keeps_rule_history_and_deletes_only_given_lines_with_their_hook_calls(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run('agent-line make 1 "an old line"')
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(days=31))
    story.run("hook-call prune")
    story.expect_absent("hook-call list --agent 1", "2  prompt")
    story.expect_absent("agent-line list --agent 1", "an old line")
    story.expect_success("rule-history list --agent 1", "samples.return-line")
