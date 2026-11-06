import json
import os
from datetime import timedelta

import pytest

from core.base.command.bus import Bus
from core.base.container import Container
from core.base.leftover_process import LeftoverProcess
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from tests.stories.core.modules.plugins.support.event_stories import (
    REFUSAL, SECOND_JOB, SECOND_JOB_TITLE, TASK_CREATED, deliveries, event_data, event_plugin_story, install_event_plugin, logged_events, plugin_data, plugin_page, plugin_row, script_calls, tasks_titled)
from tests.stories.core.modules.plugins.support.event_modules import NOTE_CREATED, NOTES
from tests.stories.server.support.story_line_route import StoryLineRoute

BACKGROUND_KEEPS_OUTPUT = """sleep 60 &
echo '{"v": 1, "tell": "answered"}'"""
BACKGROUND_CLOSES_OUTPUT = """sleep 60 > /dev/null 2>&1 &
echo $! > "$JOURNAL_PLUGIN_DATA/child"
echo '{"v": 1, "tell": "answered"}'"""
PRINTS_WITHOUT_END = "yes output"
WRITES_ERRORS_THEN_FAILS = """echo "the hidden value is secret-setting-value" >&2
exit 3"""
PLUGIN_UPDATED = "core.plugins.plugin.updated"
RECOVERING = 'if [ ! -e "$JOURNAL_PLUGIN_DATA/recovered" ]; then exit 3; fi'


def test_s69_a_child_that_keeps_the_output_open_does_not_hold_the_run(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "bg.sh"}, scripts={"bg.sh": BACKGROUND_KEEPS_OUTPUT})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "bg.sh")) == 1, plugin_row(story).fault_count == 0)


def test_s70_a_script_that_prints_without_end_is_stopped_at_the_cap(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "loud.sh"}, scripts={"loud.sh": PRINTS_WITHOUT_END})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    plugin_page(story).expect_fault("printed more than", f"at {TASK_CREATED} (commit)")


def test_s71_a_fault_holds_the_end_of_the_errors_with_the_settings_hidden(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "err.sh"}, scripts={"err.sh": WRITES_ERRORS_THEN_FAILS})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    plugin_page(story).expect_fault("it ended with code 3", "the hidden value is")


def test_s72_a_failing_commit_script_on_the_plugin_row_runs_once_for_one_real_change(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": PLUGIN_UPDATED, "commit": "fail.sh"})
    event_page.switch_off()
    event_page.switch_on()
    story.run_listeners()
    calls = len(script_calls(story, "fail.sh"))
    story.run_listeners()
    story.expect_rows(calls >= 1, len(script_calls(story, "fail.sh")) == calls, plugin_row(story).fault_count == calls)


def test_s72_a_success_that_clears_faults_gives_no_delivery(new_story):
    story = event_plugin_story(new_story, {"event": PLUGIN_UPDATED, "commit": "recovering.sh"}, {"event": TASK_CREATED, "commit": "fail.sh"}, scripts={"recovering.sh": RECOVERING})
    plugin_data(story, "recovered").touch()
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(not script_calls(story, "recovering.sh"))


def test_s73_a_write_from_a_server_round_runs_no_script_and_notes_the_skip(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "see.sh", "listen": "pin.sh"}, modules=[NOTES])
    story.container.get(Bus).run(ROUND_NOTE, story.user)
    story.expect_rows(not script_calls(story, "see.sh"), not script_calls(story, "pin.sh"), "were skipped" in story.error_log_text())


def test_s74_a_direct_run_runs_no_guard_or_listen_script_and_notes_the_skip(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh", "listen": "pin.sh", "commit": "right.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(not script_calls(story, "see.sh"), not script_calls(story, "pin.sh"), len(script_calls(story, "right.sh")) == 1, "were skipped" in story.error_log_text())


def test_s77_a_plugin_past_its_running_limit_has_its_guard_skipped(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    story.expect_rows(True)
    scripts = STARTED_SCRIPTS(story)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not script_calls(story, "see.sh"), "were skipped" in story.error_log_text(), len(tasks_titled(story, SECOND_JOB_TITLE)) == 1)
    scripts.finish_all()


def test_s77_a_failing_plugin_has_its_guard_skipped_and_is_tried_again_after_five_minutes(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    plugin_id = plugin_row(story).id
    for _ in range(5):
        story.container.get(Bus).run(RecordPluginFault(plugin_id, "it ended with code 3"), story.user)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not script_calls(story, "see.sh"), "were skipped" in story.error_log_text())
    story.advance(timedelta(minutes=6))
    story.expect_success('task make "Third job" --brief "Do it" --environment main', actor=story.agent)
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, plugin_row(story).failing is False)


def test_s78_a_running_script_has_a_pid_file_and_the_next_boot_stops_a_leftover(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    folder = story.home.folder / "runtime" / "plugins"
    folder.mkdir(parents=True, exist_ok=True)
    leftover = LEFTOVER_SCRIPT(folder)
    BOOT(story)
    story.expect_rows(leftover.wait(timeout=5) != 0, not list(folder.glob("events-*.pid")))
