import json

from tests.stories.core.modules.plugins.plugins import plugin_story


def manifest_with(story, **fields):
    path = story.plugin_folder / "journal-plugin.json"
    path.write_text(json.dumps({**json.loads(path.read_text()), **fields}))






def test_a_setup_step_may_write_to_the_journal_since_no_write_is_open_while_it_runs(played):
    story = plugin_story(played)
    lock_check = f"python3 -c \"import sqlite3; c = sqlite3.connect('{story.home.database}', timeout=1); c.execute('BEGIN IMMEDIATE'); c.rollback()\""
    manifest_with(story, setup=[{"name": "Write to the journal", "run": lock_check}])
    story.expect_text(f"plugin install {story.plugin_folder} --yes", "installed sample, on", actor=story.user)
