from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story

BROKEN_SAMPLE = HookSamples.shell("cat broken", ShellPart("cat", CommandCategory.READ, ["broken"]))
FAILING_COUNT = 5
STOPPED_TEXT = "it was stopped when the plugin was switched off at core.tasks.task.created (guard)"


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
