import json
from datetime import timedelta
from pathlib import Path

from engine.enums.event_form import EventForm
from engine.process.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.commands.prune_plugin_deliveries.prune_plugin_deliveries import PrunePluginDeliveries
from core.modules.plugins.support.plugin_folders import PluginFolders
from tests.stories.core.modules.plugins.event_many import WORKTREE_MERGE
from tests.stories.core.modules.plugins.support.event_stories import (
    SECOND_JOB, TASK_CREATED, deliveries, event_page, event_plugin_story, install_event_plugin, logged_events, plugin_row, script_calls)

SAMPLE = Path("docs/samples/tidy-worktrees")
KEEP_COUNT = 50




def test_s87_the_sample_plugin_of_the_writing_guide_installs_and_shows_its_marker(event_page):
    story = event_page.story
    event_page.install(SAMPLE.resolve())
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows((story.home.folder / "plugin-data" / "tidy-worktrees" / "marker").exists())




def test_s89_event_keys_shows_a_plain_line_for_a_key(new_story):
    story = event_plugin_story(new_story)
    story.expect_text("event keys", "a task was created", actor=story.user)




def test_s92_old_deliveries_past_the_newest_are_pruned_and_a_recent_one_stays(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    for number in range(KEEP_COUNT + 2):
        story.expect_success(f'task make "Job {number}" --brief "Do it" --environment main', actor=story.agent)
    story.run_command(PrunePluginDeliveries(), story.user)
    story.expect_rows(len(deliveries(story)) == KEEP_COUNT + 2)
    story.advance(timedelta(days=8))
    story.run_command(PrunePluginDeliveries(), story.user)
    story.expect_rows(len(deliveries(story)) == KEEP_COUNT)
    story.expect_text("plugin record events --inputs", "Job", actor=story.user)
