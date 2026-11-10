from engine.testing.examples.hook_samples import HookSamples
from tests.stories.fixtures.started_sequence import StartedSequence
from tests.stories.core.modules.sequences.support.step_blocks import run_with_hook, expect_tools_allowed, repair_legacy_blocks


def test_each_step_needs_one_follow_and_finishing_releases_commands(new_story):
    story = new_story(fixture=StartedSequence)
    run_with_hook(story, "sequence follow")
    expect_tools_allowed(story)
    run_with_hook(story, "sequence next")
    story.expect_hook_refusal("s-1", HookSamples.edit("cart.py"), "sequence:1 step 2 waits")
    run_with_hook(story, "sequence show 1")
    story.expect_hook_refusal("s-1", HookSamples.edit("cart.py"), "sequence:1 step 2 waits")
    run_with_hook(story, "sequence follow")
    run_with_hook(story, "sequence next")
    expect_tools_allowed(story)


def test_an_upgrade_clears_legacy_sequence_blocks_and_preserves_other_blocks(new_story):
    story = new_story(fixture=StartedSequence)
    repair_legacy_blocks(story)
