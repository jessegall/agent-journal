import json

from core.modules.plugins.ticks.plugin_config_reading import PluginConfigReading
from tests.stories.core.modules.plugins.support.event_stories import TASK_CREATED, event_plugin_story, plugin_row, script_calls
from tests.stories.support.story_checks import expect_value

CONFIG = {"file": ".events/config.json", "schema": ".events/config.schema.json"}
SCHEMA = {"type": "object", "properties": {"level": {"type": "integer", "minimum": 1}, "paths": {"type": "array", "items": {"type": "string"}}},
          "required": ["level"], "additionalProperties": False}
DOCUMENT = {"level": 1, "paths": ["src"]}


def configured_story(played):
    story = event_plugin_story(played, {"event": TASK_CREATED, "commit": "see.sh"}, config=CONFIG)
    folder = story.home.folder.parent / ".events"
    folder.mkdir(exist_ok=True)
    (folder / "config.schema.json").write_text(json.dumps(SCHEMA))
    (folder / "config.json").write_text(json.dumps(DOCUMENT))
    return story


def config_file(story) -> dict[str, object]:
    return json.loads((story.home.folder.parent / CONFIG["file"]).read_text())






def test_a_hand_edit_is_taken_in_and_a_broken_one_keeps_the_last_good_copy(played):
    story = configured_story(played)
    story.run("plugin config events", actor=story.user)
    (story.home.folder.parent / CONFIG["file"]).write_text(json.dumps({"level": 2, "paths": ["src", "tests"]}))
    PluginConfigReading()(story.container)
    story.expect_rows(plugin_row(story).config_version == 2, plugin_row(story).config_pointers == '["/level", "/paths"]')
    (story.home.folder.parent / CONFIG["file"]).write_text(json.dumps({"level": "high"}))
    PluginConfigReading()(story.container)
    story.expect_rows(plugin_row(story).config_version == 2, "does not fit its schema" in plugin_row(story).last_fault)
    story.expect_text("plugin config events", "version 2", '"level": 2', actor=story.user)




def test_a_config_file_that_does_not_exist_yet_is_served_as_nothing_and_taken_in_once_it_appears(played):
    story = configured_story(played)
    (story.home.folder.parent / CONFIG["file"]).unlink()
    story.expect_text("plugin config events", "version 0", "null", actor=story.user)
    story.expect_rows(plugin_row(story).last_fault == "")
    (story.home.folder.parent / CONFIG["file"]).write_text(json.dumps(DOCUMENT))
    PluginConfigReading()(story.container)
    story.expect_rows(plugin_row(story).config_version == 1)
