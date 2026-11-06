import json
from datetime import timedelta
from pathlib import Path

from core.base.change.event_log import HIDDEN
from core.base.command.bus import Bus
from core.base.model.event_form import EventForm
from core.base.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.commands.prune_plugin_deliveries.prune_plugin_deliveries import PrunePluginDeliveries
from core.modules.plugins.support.plugin_folders import PluginFolders
from tests.stories.core.modules.plugins.event_many import WORKTREE_MERGE
from tests.stories.core.modules.plugins.support.checkout_stories import checkout_story
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


def test_s87_the_sample_plugin_of_the_writing_guide_installs_and_shows_its_marker(event_page):
    story = event_page.story
    event_page.install(SAMPLE.resolve())
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows((story.home.folder / "plugin-data" / "tidy-worktrees" / "marker").exists())


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


def test_s89_event_keys_shows_a_plain_line_for_a_key(new_story):
    story = event_plugin_story(new_story)
    story.expect_text("event keys", "a task was created", actor=story.user)


def test_s90_a_listed_extra_file_counts_in_the_digest_and_changing_it_switches_the_plugin_off(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"}, scripts={"hooks/lib.py": ""}, files=["hooks/lib.py"])
    folder = story.container.get(PluginFolders).code("events")
    (folder / "hooks" / "lib.py").write_text("changed = True\n")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(plugin_row(story).enabled is False)


def test_s90_a_file_outside_the_folder_is_a_wrong_entry(event_page):
    install_event_plugin(event_page.story, files=["../outside.py"])
    event_page.story.expect_rows(any(row["state"] == "wrong script" for row in event_page.card()))


def test_s91_a_hand_in_names_odd_file_names_exactly(new_story):
    story = checkout_story(new_story, {"event": "suites.coding.workers.worker_worktree.deliver", "commit": "see.sh"})
    names = ["a space.py", "a'quote.py", "a\ttab.py", "naïve.py"]
    for name in names:
        story.repository.changed(story.worker.id, name, "TOTAL = 1\n")
    outcome = story.run("plugin changes --json", actor=story.worker)
    rows = {row["relative"] for row in json.loads(outcome.output_text)["rows"]}
    story.expect_rows(set(names) <= rows)


def test_s92_old_deliveries_past_the_newest_are_pruned_and_a_recent_one_stays(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    for number in range(KEEP_COUNT + 2):
        story.expect_success(f'task make "Job {number}" --brief "Do it" --environment main', actor=story.agent)
    story.container.get(Bus).run(PrunePluginDeliveries(), story.user)
    story.expect_rows(len(deliveries(story)) == KEEP_COUNT + 2)
    story.advance(timedelta(days=8))
    story.container.get(Bus).run(PrunePluginDeliveries(), story.user)
    story.expect_rows(len(deliveries(story)) == KEEP_COUNT)
    story.expect_text("plugin record events --inputs", "Job", actor=story.user)


def test_s92_a_delivery_keeps_its_data_out_of_the_event_log(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    logged = logged_events(story, "plugin_delivery.create")
    story.expect_rows(HIDDEN in logged[-1].data["data"])
