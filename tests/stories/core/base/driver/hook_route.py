from core.testing.hook_samples import HookSamples


def test_with_no_drivers_module_every_hook_is_let_through_with_no_lines(new_story):
    story = new_story()
    story.expect_hook_silent("s-1", HookSamples.session_start())
    story.expect_hook_silent("s-1", HookSamples.edit("src/cart.py"))
    story.expect_hook_silent("s-1", HookSamples.stop())
