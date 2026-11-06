from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story

BROKEN_SAMPLE = HookSamples.shell("cat broken", ShellPart("cat", CommandCategory.READ, ["broken"]))
FAILING_COUNT = 5
STOPPED_TEXT = "it was stopped when the plugin was switched off at core.tasks.task.created (guard)"


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


def test_the_record_says_what_a_plugin_did_and_its_last_fault(new_story):
    story = installed_story(new_story)
    story.hook("s-1", BROKEN_SAMPLE)
    story.run_listeners()
    story.expect_text("plugin record sample", "last fault: it ended with code 3", actor=story.user)
    story.expect_refusal("plugin record nobody", "no plugin is called nobody", actor=story.user)


def test_a_fault_that_does_not_count_keeps_the_count_and_shows_its_text(new_story):
    story = installed_story(new_story)
    plugin_id = story.container.get(Queries).query(Plugin).first().id
    story.container.get(Bus).run(RecordPluginFault(plugin_id, STOPPED_TEXT, False), story.user)
    plugin = story.container.get(Queries).query(Plugin).first()
    story.expect_rows(plugin.fault_count == 0, plugin.last_fault == STOPPED_TEXT, plugin.failing is False)
