import json

from core.modules.plugins.ticks.plugin_config_reading import PluginConfigReading
from tests.stories.core.modules.plugins.support.event_stories import TASK_CREATED, event_plugin_story, plugin_row, script_calls
from tests.stories.support.story_checks import expect_value

CONFIG = {"file": ".events/config.json", "schema": ".events/config.schema.json"}
SCHEMA = {"type": "object", "properties": {"level": {"type": "integer", "minimum": 1}, "paths": {"type": "array", "items": {"type": "string"}}},
          "required": ["level"], "additionalProperties": False}
DOCUMENT = {"level": 1, "paths": ["src"]}


def configured_story(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"}, config=CONFIG)
    folder = story.home.folder.parent / ".events"
    folder.mkdir(exist_ok=True)
    (folder / "config.schema.json").write_text(json.dumps(SCHEMA))
    (folder / "config.json").write_text(json.dumps(DOCUMENT))
    return story


def config_file(story) -> dict[str, object]:
    return json.loads((story.home.folder.parent / CONFIG["file"]).read_text())


def test_a_change_at_a_pointer_is_written_as_the_next_version_with_the_places_it_changed(new_story):
    story = configured_story(new_story)
    story.expect_text("plugin config events", "version 1", actor=story.user)
    story.expect_text("plugin config events --set /level=3", "version 2", '"level": 3', actor=story.user)
    expect_value(config_file(story), {"level": 3, "paths": ["src"]})
    story.expect_rows(plugin_row(story).config_pointers == '["/level"]')


def test_a_change_the_schema_refuses_names_its_place_and_writes_nothing(new_story):
    story = configured_story(new_story)
    story.expect_refusal("plugin config events --set /level=0", "/level: is below 1", actor=story.user)
    story.expect_refusal('plugin config events --set /colour=\'"red"\'', "/colour: nothing is allowed here", actor=story.user)
    expect_value(config_file(story), DOCUMENT)


def test_a_hand_edit_is_taken_in_and_a_broken_one_keeps_the_last_good_copy(new_story):
    story = configured_story(new_story)
    story.run("plugin config events", actor=story.user)
    (story.home.folder.parent / CONFIG["file"]).write_text(json.dumps({"level": 2, "paths": ["src", "tests"]}))
    PluginConfigReading()(story.container)
    story.expect_rows(plugin_row(story).config_version == 2, plugin_row(story).config_pointers == '["/level", "/paths"]')
    (story.home.folder.parent / CONFIG["file"]).write_text(json.dumps({"level": "high"}))
    PluginConfigReading()(story.container)
    story.expect_rows(plugin_row(story).config_version == 2, "does not fit its schema" in plugin_row(story).last_fault)
    story.expect_text("plugin config events", "version 2", '"level": 2', actor=story.user)


def test_a_line_to_the_plugin_names_its_config_version(new_story):
    story = configured_story(new_story)
    story.run("plugin config events", actor=story.user)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run_listeners()
    expect_value(script_calls(story, "see.sh")[-1]["config"], {"version": 1})


def test_a_config_file_that_does_not_exist_yet_is_served_as_nothing_and_taken_in_once_it_appears(new_story):
    story = configured_story(new_story)
    (story.home.folder.parent / CONFIG["file"]).unlink()
    story.expect_text("plugin config events", "version 0", "null", actor=story.user)
    story.expect_rows(plugin_row(story).last_fault == "")
    (story.home.folder.parent / CONFIG["file"]).write_text(json.dumps(DOCUMENT))
    PluginConfigReading()(story.container)
    story.expect_rows(plugin_row(story).config_version == 1)
