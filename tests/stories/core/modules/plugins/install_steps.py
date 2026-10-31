import json

from tests.stories.core.modules.plugins.plugins import plugin_story


def manifest_with(story, **fields):
    path = story.plugin_folder / "journal-plugin.json"
    path.write_text(json.dumps({**json.loads(path.read_text()), **fields}))


def test_a_program_the_plugin_requires_that_is_missing_refuses_the_install_with_its_hint(new_story):
    story = plugin_story(new_story)
    manifest_with(story, requires={"frobnicate": {"check": "exit 1", "hint": "install frobnicate first"}})
    story.expect_refusal(f"plugin install {story.plugin_folder} --yes", "frobnicate is missing: install frobnicate first", actor=story.user)
    story.expect_text("plugin list", "no plugin is installed", actor=story.user)


def test_the_setup_steps_run_in_the_plugins_folder_at_install(new_story):
    story = plugin_story(new_story)
    manifest_with(story, setup=[{"name": "Make the cache", "run": "touch cache.txt"}])
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_rows((story.home.folder / "plugins" / "sample" / "cache.txt").is_file())


def test_a_failing_setup_step_stops_the_install_and_leaves_nothing_behind(new_story):
    story = plugin_story(new_story)
    manifest_with(story, setup=[{"name": "Fetch the binary", "run": "exit 4"}])
    story.expect_refusal(f"plugin install {story.plugin_folder} --yes", "the setup step Fetch the binary failed", actor=story.user)
    story.expect_text("plugin list", "no plugin is installed", actor=story.user)
    story.expect_rows(not (story.home.folder / "plugins" / "sample").exists())


def test_the_installed_commands_answer_fills_the_plugins_settings(new_story):
    story = plugin_story(new_story)
    manifest_with(story, installed="echo '{\"level\": 3}'")
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_text("plugin settings sample", "level number 3", actor=story.user)
