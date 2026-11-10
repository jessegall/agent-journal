import io
import json
import subprocess
from datetime import timedelta

from server.booting_work import BootingWork
from engine.process.leftover_process import LeftoverProcess
from core.base.cli.caller_stream import CallerStream
from core.base.command.bus import Bus
from engine.container.journal_container import synced_container
from core.base.model.event_form import EventForm
from engine.query.queries import Queries
from engine.process.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from tests.stories.core.modules.plugins.support.event_modules import NOTE_CREATED, NOTES, EventNote, ManyNotes
from tests.stories.core.modules.plugins.support.event_stories import (
    SECOND_JOB, SECOND_JOB_TITLE, TASK_CREATED, event_page, event_plugin_story, install_event_plugin, plugin_data, plugin_page, plugin_row, script_calls, tasks_titled)

MOST_RUNNING = 8
WAIT_SECONDS = 15
FAILING_COUNT = 5
OPEN_OUTPUT_SCRIPT = """sleep 60 &
echo '{"v": 1, "tell": "answered"}'"""
PRINTS_WITHOUT_END = "yes output"
ERROR_WRITER = """echo "the hidden value is secret-setting-value" >&2
exit 3"""
PLUGIN_UPDATED = "core.plugins.plugin.updated"
RECOVERING = 'if [ ! -e "$JOURNAL_PLUGIN_DATA/recovered" ]; then exit 3; fi'


def test_s73_a_write_from_a_server_round_runs_no_script_and_notes_the_skip(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "refuse.sh", "listen": "pin.sh"}, modules=[NOTES])
    synced_container(story.home).get(Bus).run(ManyNotes(1), story.user)
    story.expect_rows(not script_calls(story, "refuse.sh"), not script_calls(story, "pin.sh"), "were skipped" in story.system_log_text(), story.container.get(Queries).query(EventNote).count() == 1)


def test_s75_a_caller_waiting_on_a_guard_script_is_told_at_once(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    output_stream = io.StringIO()
    story.container.get(CallerStream).stream = output_stream
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(f"waiting on plugin events at {TASK_CREATED}" in output_stream.getvalue())


def test_s75_with_json_the_waits_are_blank_lines_and_the_output_parses(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    output_stream = io.StringIO()
    caller = story.container.get(CallerStream)
    caller.stream, caller.is_json = output_stream, True
    outcome = story.run(f"{SECOND_JOB} --json", actor=story.agent)
    story.expect_rows(output_stream.getvalue().strip() == "", bool(json.loads(output_stream.getvalue() + outcome.output_text)))


def sleeping_scripts(story, count: int) -> list[subprocess.Popen]:
    scripts, processes = story.container.get(PluginScriptProcesses), []
    for _ in range(count):
        process = subprocess.Popen(["sleep", "60"], start_new_session=True)
        scripts.start(process, "events", TASK_CREATED, EventForm.COMMIT, story.clock.timestamp())
        processes.append(process)
    return processes


def test_s77_a_plugin_past_its_running_limit_has_its_guard_skipped(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    processes = sleeping_scripts(story, MOST_RUNNING)
    try:
        story.expect_success(SECOND_JOB, actor=story.agent)
        story.expect_rows(not script_calls(story, "see.sh"), "was skipped" in story.system_log_text(), len(tasks_titled(story, SECOND_JOB_TITLE)) == 1)
    finally:
        for process in processes:
            story.container.get(PluginScriptProcesses).finish(process)
            process.kill()
            process.wait()


def test_s77_a_failing_plugin_has_its_guard_skipped_and_is_tried_again_after_five_minutes(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    plugin_id = plugin_row(story).id
    for _ in range(FAILING_COUNT):
        story.container.get(Bus).run(RecordPluginFault(plugin_id, "it ended with code 3"), story.user)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not script_calls(story, "see.sh"), "was skipped" in story.system_log_text())
    story.advance(timedelta(minutes=6))
    story.expect_success('task make "Third job" --brief "Do it" --environment main', actor=story.agent)
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, plugin_row(story).failing is False)


def test_s78_a_running_script_has_a_pid_file_and_a_finished_one_has_none(new_story):
    story = event_plugin_story(new_story)
    scripts = story.container.get(PluginScriptProcesses)
    folder = story.container.get(PluginSocketPaths).folder
    process = subprocess.Popen([str(story.home.folder / "plugins" / "events" / "see.sh")], stdin=subprocess.PIPE, start_new_session=True)
    try:
        scripts.start(process, "events", TASK_CREATED, EventForm.COMMIT, story.clock.timestamp())
        story.expect_rows(len(list(folder.glob(f"*{process.pid}*"))) == 1)
    finally:
        scripts.finish(process)
        process.kill()
        process.communicate()
    story.expect_rows(not list(folder.glob(f"*{process.pid}*")))


def test_s78_the_next_boot_stops_a_leftover_and_removes_its_pid_file(new_story):
    story = event_plugin_story(new_story, scripts={"see.sh": "sleep 60"})
    folder = story.container.get(PluginSocketPaths).folder
    program = str(story.home.folder / "plugins" / "events" / "see.sh")
    leftover = subprocess.Popen([program], stdin=subprocess.PIPE, start_new_session=True)
    folder.mkdir(parents=True, exist_ok=True)
    pid_file = folder / f"script-events-{leftover.pid}.pid"
    pid_file.write_text(f"{leftover.pid}\n{program}")
    try:
        BootingWork().run(story.container)
        leftover.wait(timeout=WAIT_SECONDS)
        story.expect_rows(not LeftoverProcess.is_running(leftover.pid), not pid_file.exists())
    finally:
        leftover.kill()
        leftover.communicate()


def test_s78_a_pid_taken_by_another_program_is_left_alone(new_story):
    story = event_plugin_story(new_story)
    folder = story.container.get(PluginSocketPaths).folder
    process = subprocess.Popen(["sleep", "60"], start_new_session=True)
    folder.mkdir(parents=True, exist_ok=True)
    pid_file = folder / f"script-events-{process.pid}.pid"
    pid_file.write_text(f"{process.pid}\n/nowhere/see.sh")
    try:
        BootingWork().run(story.container)
        story.expect_rows(process.poll() is None, not pid_file.exists())
    finally:
        process.kill()
        process.wait()


def test_s78_a_removal_stops_a_running_script_at_once(event_page):
    story = event_page.story
    install_event_plugin(story)
    processes = sleeping_scripts(story, 1)
    try:
        event_page.line("plugin", "remove", "events")
        story.expect_rows(processes[0].wait(timeout=WAIT_SECONDS) != 0)
    finally:
        story.container.get(PluginScriptProcesses).finish(processes[0])
        processes[0].kill()
        processes[0].wait()


def test_s78_a_disable_stops_a_running_script_at_once(event_page):
    story = event_page.story
    install_event_plugin(story)
    processes = sleeping_scripts(story, 1)
    try:
        event_page.disable()
        story.expect_rows(processes[0].wait(timeout=WAIT_SECONDS) != 0)
    finally:
        story.container.get(PluginScriptProcesses).finish(processes[0])
        processes[0].kill()
        processes[0].wait()
