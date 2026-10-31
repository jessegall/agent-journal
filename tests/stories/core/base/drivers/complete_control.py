from tests.stories.core.support import story_lines as lines
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_suite_in_complete_control_hears_no_pattern_rule_but_the_essential_ones_and_keeps_the_overlay_it_includes(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("suite choose control --environment main")
    story.run(f"edit-lock make {story.agent.id}")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "edit_lock:1 refuses every edit")
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("hook-call show 3", "samples.failing-rule", "samples.return-line")
