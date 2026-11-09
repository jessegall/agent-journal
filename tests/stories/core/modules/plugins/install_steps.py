import json

from tests.stories.core.modules.plugins.plugins import plugin_story


def manifest_with(story, **fields):
    path = story.plugin_folder / "journal-plugin.json"
    path.write_text(json.dumps({**json.loads(path.read_text()), **fields}))


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


def test_a_setup_step_may_write_to_the_journal_since_no_write_is_open_while_it_runs(new_story):
    story = plugin_story(new_story)
    lock_check = f"python3 -c \"import sqlite3; c = sqlite3.connect('{story.home.database}', timeout=1); c.execute('BEGIN IMMEDIATE'); c.rollback()\""
    manifest_with(story, setup=[{"name": "Write to the journal", "run": lock_check}])
    story.expect_text(f"plugin install {story.plugin_folder} --yes", "installed sample, on", actor=story.user)
