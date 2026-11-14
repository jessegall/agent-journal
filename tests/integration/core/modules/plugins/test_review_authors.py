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


def test_s86_a_skipped_guard_on_a_merge_shows_on_the_card_with_its_reason_and_plugin_try_says_so(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": WORKTREE_MERGE, "guard": "see.sh"})
    story.container.get(PluginScriptProcesses).skipped("events", WORKTREE_MERGE, EventForm.GUARD, "this command runs only once", story.clock.timestamp())
    row = next(row for row in event_page.card() if row["form"] == "guard")
    story.expect_rows(row["skip_reason"] == "this command runs only once", bool(row["last_skipped_at"]))
    story.expect_text(f"plugin try events {WORKTREE_MERGE}", "runs only once", actor=story.user)




def test_s88_a_manifest_edited_into_broken_json_faults_one_plugin_and_the_rest_goes_on(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "commit": "see.sh"})
    install_event_plugin(story, {"event": TASK_CREATED, "commit": "see.sh"}, name="second")
    (story.container.get(PluginFolders).code("events") / "journal-plugin.json").write_text("{not json")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh", "second")) == 1)
    event_page.disable("events")
    story.expect_rows(event_page.plugin("events")["enabled"] is False)




def test_s90_a_listed_extra_file_counts_in_the_digest_and_changing_it_switches_the_plugin_off(played):
    story = event_plugin_story(played, {"event": TASK_CREATED, "commit": "see.sh"}, scripts={"hooks/lib.py": ""}, files=["hooks/lib.py"])
    folder = story.container.get(PluginFolders).code("events")
    (folder / "hooks" / "lib.py").write_text("changed = True\n")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(plugin_row(story).enabled is False)


