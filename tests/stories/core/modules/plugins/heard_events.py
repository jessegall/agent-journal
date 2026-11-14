import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

LISTING_SAMPLE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


def heard_story(new_story, heard: list[object]):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = sample_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "hears": heard}))
    story.run(f"plugin install {folder} --yes", actor=story.user)
    return story


def tool_deliveries(story) -> int:
    return len([row for row in story.story_rows(PluginDelivery) if row.event == "tool_starting"])


def test_a_hears_entry_that_names_its_tools_gets_no_delivery_for_another_tool(new_story):
    story = heard_story(new_story, [{"event": "tool_starting", "tools": ["Edit"]}])
    story.hook("s-1", LISTING_SAMPLE)
    story.expect_rows(tool_deliveries(story) == 0)
    story.hook("s-1", HookSamples.edit("a.py"))
    story.expect_rows(tool_deliveries(story) == 1)


def test_a_hears_entry_with_an_interval_gets_one_delivery_within_it(new_story):
    story = heard_story(new_story, [{"event": "tool_starting", "every_minutes": 5}])
    story.hook("s-1", LISTING_SAMPLE)
    story.hook("s-1", LISTING_SAMPLE)
    story.expect_rows(tool_deliveries(story) == 1)
