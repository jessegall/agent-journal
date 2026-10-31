from tests.stories.core.support import story_lines as lines
from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadLocked, LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_tick_on_which_nothing_is_said_is_not_kept_but_its_history_is(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.tick("s-1")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", "tick")
    story.expect_text(f"rule-history list --agent {story.agent.id}", "samples.return-line")


def test_a_prune_keeps_rule_history_and_deletes_only_given_lines_with_their_hook_calls(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run(f'agent-line make {story.agent.id} "an old line"')
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(days=31))
    story.run("hook-call prune")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", "prompt")
    story.expect_absent(f"agent-line list --agent {story.agent.id}", "an old line")
    story.expect_text(f"rule-history list --agent {story.agent.id}", "samples.return-line")
