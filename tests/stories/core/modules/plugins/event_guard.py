import subprocess
import sys

import pytest

from core.base.model.event_form import EventForm
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.script_stop import ScriptStop
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.support.service_processes import ServiceProcesses
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, REMOVAL_SAMPLE
from tests.stories.core.modules.plugins.support.event_modules import FAILS_LATER, LATER_REFUSAL, NOTE_CREATED, NOTES, REFUSED_TITLE
from tests.stories.core.modules.plugins.support.refusing_modules import LATER_KEY_REFUSAL, REFUSED_NOTE_TITLE, REFUSED_NOTES
from tests.stories.core.modules.plugins.support.event_stories import (
    REFUSAL, SECOND_JOB, SECOND_JOB_TITLE, TASK_CREATED, EventPluginStarted, deliveries, event_plugin_story, install_event_plugin, logged_events, plugin_data, plugin_page, plugin_row, script_calls, tasks_titled)
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip

GUARD_MESSAGE = "noted by the guard"
CARD_LABEL = "Lane open"
MESSAGE_SCRIPT = f"""echo '{{"v": 1, "tell": "{GUARD_MESSAGE}", "cards": [{{"kind": "state", "key": "lane", "label": "{CARD_LABEL}", "tone": "good"}}]}}'"""
COMMAND_STARTING = "core.plugins.command_starting"
GUARD_SKIP = "plugins.event-guard"
SKIP_REASON = '--skip-reason "the plugin is wrong here"'
GUARD_LIMIT_SETTING = "setting set journal.core.plugins.hold_window_ms {} --project"
CEILING_MS = 1000
STOP_LIMIT_SECONDS = 5
BLOCKED_SCRIPT = 'mkfifo "$JOURNAL_PLUGIN_DATA/never-written"\nread answer < "$JOURNAL_PLUGIN_DATA/never-written"'
LOCK_CHECK = """import sqlite3, sys
connection = sqlite3.connect(sys.argv[1], timeout=0, isolation_level=None)
try:
    connection.execute("BEGIN IMMEDIATE")
    connection.execute("ROLLBACK")
    print("free")
except sqlite3.OperationalError as error:
    print(f"locked: {error}")
"""


def test_s21_a_guard_that_refuses_stops_the_change_with_nothing_saved(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh", "commit": "see.sh"})
    story.expect_refusal(SECOND_JOB, REFUSAL, actor=story.agent)
    story.expect_no_text("task list", SECOND_JOB_TITLE, actor=story.agent)
    story.expect_rows(not tasks_titled(story, SECOND_JOB_TITLE), len(logged_events(story, "task.create")) == 1, not deliveries(story))


def test_s21_a_skip_named_for_the_plugin_passes_the_guard_and_the_log_records_it(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    story.expect_refusal(SECOND_JOB, REFUSAL, actor=story.agent)
    confirmed_skip(story, f"{GUARD_SKIP}:events", story.agent)
    story.expect_success(f"{SECOND_JOB} --skip-guard {GUARD_SKIP}:events {SKIP_REASON}", actor=story.agent)
    story.expect_rows(len(tasks_titled(story, SECOND_JOB_TITLE)) == 1)
    story.expect_rows(f"{GUARD_SKIP}:events" in logged_events(story, "task.create")[-1].skipped_guards)


def test_s21_a_skip_with_the_bare_guard_name_passes_nothing(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    story.expect_refusal(f"{SECOND_JOB} --skip-guard {GUARD_SKIP} {SKIP_REASON}", "has no skip", actor=story.agent)
    story.expect_rows(not tasks_titled(story, SECOND_JOB_TITLE))


def test_s22_a_guard_that_prints_nothing_saves_the_row_once_with_one_event(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, len(tasks_titled(story, SECOND_JOB_TITLE)) == 1, len(logged_events(story, "task.create")) == 2)


def agent_lines_containing(story, text: str) -> list[AgentLine]:
    return [line for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows() if text in line.text]


def test_s22_an_allowing_guard_tells_the_agent_and_shows_its_card_once(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "words.sh"}, scripts={"words.sh": MESSAGE_SCRIPT})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", CARD_LABEL, actor=story.user)
    story.expect_rows(len(agent_lines_containing(story, GUARD_MESSAGE)) == 1, len(script_calls(story, "words.sh")) == 1)


def test_s22_what_an_allowing_guard_tells_rolls_back_when_a_later_listener_refuses(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "words.sh"}, scripts={"words.sh": MESSAGE_SCRIPT}, modules=[FAILS_LATER])
    story.expect_refusal(f'task make "{REFUSED_TITLE}" --brief "Do it" --environment main', LATER_REFUSAL, actor=story.agent)
    story.run_listeners()
    story.expect_no_text("chat-mark list --environment 1", CARD_LABEL, actor=story.user)
    story.expect_rows(not agent_lines_containing(story, GUARD_MESSAGE), not tasks_titled(story, REFUSED_TITLE))


def test_s22_another_guard_that_refuses_keeps_the_guard_script_from_running(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "see.sh"}, modules=[NOTES, REFUSED_NOTES])
    story.expect_refusal(f'event-note make "{REFUSED_NOTE_TITLE}"', LATER_KEY_REFUSAL, actor=story.user)
    story.expect_rows(not script_calls(story, "see.sh"))
    story.expect_success('event-note make "A note"', actor=story.user)
    story.expect_rows(len(script_calls(story, "see.sh")) == 1)


@pytest.mark.parametrize(("script", "fault"), [("fail.sh", "it ended with code 3"), ("broken.sh", "its answer is not JSON"), ("gone.sh", "gone.sh")])
def test_s23_a_guard_that_fails_lets_the_change_through_and_shows_on_the_card(new_story, script, fault):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": script})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(len(tasks_titled(story, SECOND_JOB_TITLE)) == 1)
    page = plugin_page(story)
    page.expect_fault(fault, f"at {TASK_CREATED} (guard)")


def test_s24_a_guard_script_runs_with_no_lock_held_and_the_command_then_finishes(new_story):
    story = new_story(fixture=EventPluginStarted)
    check = f"""'{sys.executable}' -c '{LOCK_CHECK}' '{story.home.database}' >> "$JOURNAL_PLUGIN_DATA/lock" """
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "lock.sh"}, scripts={"lock.sh": check})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(plugin_data(story, "lock").read_text() == "free\n", len(tasks_titled(story, SECOND_JOB_TITLE)) == 1)


def test_s25_switching_a_plugin_off_goes_through_and_the_round_stops_its_running_script(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    scripts = story.container.get(PluginScriptProcesses)
    process = subprocess.Popen(["sleep", "60"], stdin=subprocess.PIPE, text=True, start_new_session=True)
    try:
        story.expect_success("plugin disable events", actor=story.user)
        story.expect_rows(plugin_row(story).enabled is False)
        scripts.start(process, "events", TASK_CREATED, EventForm.GUARD, story.clock.timestamp())
        story.container.get(PluginServiceRound).run(ServiceProcesses())
        story.expect_rows(process.wait(timeout=STOP_LIMIT_SECONDS) != 0, scripts.stop_reason(process) is ScriptStop.PLUGIN_DISABLED)
    finally:
        scripts.finish(process)
        process.kill()
        process.communicate()


def test_s25_a_plugin_row_offers_only_commit_so_no_script_can_hold_the_switch(new_story):
    story = new_story(fixture=EventPluginStarted)
    story.expect_rows(tuple(story.container.get(Registry).event_keys["plugin.update"].forms) == tuple([EventForm.COMMIT]))


def test_s26_explain_shows_what_would_happen_and_runs_no_script(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh", "listen": "pin.sh", "commit": "see.sh"})
    story.expect_success(f"{SECOND_JOB} --explain", actor=story.agent)
    story.run_listeners()
    story.expect_rows(not script_calls(story, "refuse.sh"), not script_calls(story, "pin.sh"), not script_calls(story, "see.sh"), not tasks_titled(story, SECOND_JOB_TITLE))


def test_s40_a_hook_guard_can_refuse(new_story):
    story = install_runner(event_plugin_story(new_story, {"event": COMMAND_STARTING, "guard": "refuse.sh"}))
    story.run(GUARD_LIMIT_SETTING.format(5000), actor=story.user)
    story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "plugin:1 refused")
    story.expect_text(f"agent-line list --agent {story.agent.id}", REFUSAL, actor=story.agent)
    story.expect_rows(len(script_calls(story, "refuse.sh")) == 1)


def test_s40_a_hook_guard_obeys_the_limit(new_story):
    story = install_runner(event_plugin_story(new_story, {"event": COMMAND_STARTING, "guard": "blocked.sh"}, scripts={"blocked.sh": BLOCKED_SCRIPT}))
    story.run(GUARD_LIMIT_SETTING.format(CEILING_MS), actor=story.user)
    story.expect_hook_allowed("s-1", LISTING_SAMPLE)
    story.expect_rows(len(script_calls(story, "blocked.sh")) == 1)
