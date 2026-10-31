from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story

BROKEN_SAMPLE = HookSamples.shell("cat broken", ShellPart("cat", CommandCategory.READ, ["broken"]))
FAILING_COUNT = 5


def test_a_plugin_that_fails_lets_the_event_through_and_its_fault_is_recorded(new_story):
    story = installed_story(new_story)
    story.expect_hook_allowed("s-1", BROKEN_SAMPLE)
    story.run_listeners()
    story.expect_text("plugin list", "sample", "last fault: it ended with code 3 at command_starting", actor=story.user)


def test_the_fifth_fault_in_a_row_shows_a_mark_that_the_plugin_is_failing(new_story):
    story = installed_story(new_story)
    for _ in range(FAILING_COUNT):
        story.hook("s-1", BROKEN_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "Plugin sample is failing: it ended with code 3 at command_starting", actor=story.user)


def test_a_failing_plugin_that_answers_again_shows_a_mark_that_it_answers(new_story):
    story = installed_story(new_story)
    for _ in range(FAILING_COUNT):
        story.hook("s-1", BROKEN_SAMPLE)
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "Plugin sample answers again", actor=story.user)
    story.expect_absent("plugin list", "last fault", actor=story.user)
