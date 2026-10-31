from tests.stories.core.support import story_lines as lines
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadLocked
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_rule_with_history_is_told_once_that_it_has_control_again_after_the_lock_above_it_ends(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.run("edit-lock ended 1")
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "you are back at your own work")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "you are back at your own work")


def test_a_switched_off_rule_is_neither_asked_nor_passed_over_and_never_regains_control(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.run("setting make samples.return-line false")
    story.hook("s-1", HookSamples.prompt("go on"))
    story.expect_absent(lines.SECOND_HOOK_CALL, "samples.return-line")
    story.run("edit-lock ended 1")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "you are back at your own work")
