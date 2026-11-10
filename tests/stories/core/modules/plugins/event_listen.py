import json
import os
import subprocess

from engine.caller.caller_request import SESSION_VARIABLE, CallerRequest
from engine.caller.caller_resolver import CallerResolver
from engine.caller.process_row import ProcessRow
from core.base.model.event_form import EventForm
from engine.query.queries import Queries
from engine.process.plugin_script_processes import PluginScriptProcesses
from core.modules.drivers.models.agent_line import AgentLine
from engine.time.timestamp import Timestamp
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.core.modules.plugins.support.event_stories import (
    NOTES_PIN_TITLE, PIN_LINE, REFUSAL, SECOND_JOB, SECOND_JOB_TITLE, TASK_CREATED, answer_with_commands, data_row, event_data, event_plugin_story, pins_titled, plugin_page, plugin_row, script_calls, tasks_titled)

MESSAGE_TEXT = "pinned for you"
CARD_LABEL = "Pin made"
ANSWER_SCRIPT = f"""cat <<'ANSWER'
{json.dumps({"v": 1, "commands": [PIN_LINE], "tell": MESSAGE_TEXT, "cards": [{"kind": "state", "key": "pin", "label": CARD_LABEL, "tone": "good"}]})}
ANSWER"""
REFUSED_LINE = 'task close 999 --outcome "no such task"'
READ_LINE = "task list"
PREPARED_LINE = "plugin install /nowhere --yes"
CLAIMED_VARIABLES = ("JOURNAL_PLUGIN", "JOURNAL_PLUGIN_SCRIPT", "JOURNAL_SCRIPT")
CLIENT_PID = 4000
STARTED_TEXT = "2026-11-06T09:00:00+00:00"


def test_s27_a_line_with_its_tell_and_card_runs_once_and_the_card_shows(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "listen": "all.sh"}, scripts={"all.sh": ANSWER_SCRIPT})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", CARD_LABEL, actor=story.user)
    messages = [line for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows() if MESSAGE_TEXT in line.text]
    story.expect_rows(len(pins_titled(story, NOTES_PIN_TITLE)) == 1, len(messages) == 1)


def counted_table_reads(story) -> list[int]:
    reads: list[int] = []
    rows = story.process_table.rows
    story.process_table.rows = lambda: (reads.append(1), rows())[1]
    return reads


def script_chain(story) -> tuple[subprocess.Popen, CallerRequest]:
    process =subprocess.Popen(["cat"], stdin=subprocess.PIPE, text=True)
    story.container.get(PluginScriptProcesses).start(process, "events", TASK_CREATED, EventForm.LISTEN, Timestamp.parsed(STARTED_TEXT))
    story.use_processes(ProcessRow(CLIENT_PID, process.pid, Timestamp.parsed(STARTED_TEXT)), ProcessRow(process.pid, 1, Timestamp.parsed(STARTED_TEXT)))
    return process, CallerRequest(variables={"USER": "Ada"}, folder="/", pid=CLIENT_PID)


def test_s29_a_request_whose_chain_holds_a_script_names_the_plugin_and_keeps_the_person(new_story):
    story = event_plugin_story(new_story)
    process, request = script_chain(story)
    try:
        caller = story.container.get(CallerResolver).caller(request)
    finally:
        story.container.get(PluginScriptProcesses).finish(process)
        process.kill()
        process.communicate()
    story.expect_rows(caller.plugin_script == "events", caller.actor == story.user)


def test_s30_only_a_variable_naming_a_plugin_leaves_the_script_empty_and_reads_the_table_once(new_story):
    story = event_plugin_story(new_story)
    reads = counted_table_reads(story)
    variables = {"USER": "Ada", **{name: "events" for name in CLAIMED_VARIABLES}}
    caller = story.container.get(CallerResolver).caller(CallerRequest(variables=variables, folder="/", pid=CLIENT_PID))
    story.expect_rows(caller.plugin_script == "", caller.actor == story.user, len(reads) == 1)


def test_s30_a_session_reads_no_table_and_names_no_plugin(new_story):
    story = event_plugin_story(new_story)
    reads = counted_table_reads(story)
    caller = story.container.get(CallerResolver).caller(CallerRequest(variables={SESSION_VARIABLE: "s-1"}, folder="/", pid=CLIENT_PID))
    story.expect_rows(caller.plugin_script == "", caller.actor == story.agent, not reads)


def test_s30_running_a_program_never_reads_the_process_table(new_story):
    story = install_runner(event_plugin_story(new_story, program="see.sh", hears=["file_edited"]))
    reads = counted_table_reads(story)
    scanned_edit(story, "s-1", "a.py")
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, not reads)


def test_s30_an_agent_that_names_a_plugin_in_a_variable_is_still_guarded(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    variables = {SESSION_VARIABLE: "s-1", **{name: "events" for name in CLAIMED_VARIABLES}}
    story.expect_requested_exit(SECOND_JOB, CallerRequest(variables=variables, folder=str(story.home.folder.parent), pid=os.getpid()), 1, REFUSAL)
    story.expect_rows(not tasks_titled(story, SECOND_JOB_TITLE))
