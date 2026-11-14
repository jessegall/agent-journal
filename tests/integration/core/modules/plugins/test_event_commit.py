from datetime import timedelta

from server.work.booting_work import BootingWork
import json

from engine.event.event_log import HIDDEN
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from engine.database.database import Database
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.enums.event_form import EventForm
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions
from tests.stories.core.modules.plugins.support.event_modules import FAILS_LATER, LATER_REFUSAL, NOTES, REFUSED_TITLE
from tests.stories.core.modules.plugins.support.event_stories import (
    PIN_CREATED, SECOND_JOB, server_commands, SECOND_JOB_TITLE, TASK_CREATED, data_row, deliveries, event_data, event_plugin_story, plugin_data, plugin_page, plugin_row, script_calls, tasks_titled)

LONG_TEXT = "a long brief " * 10000
FAILING_COUNT = 5
RECOVERING = 'if [ ! -e "$JOURNAL_PLUGIN_DATA/recovered" ]; then exit 3; fi'
NOTE_SECRET = "the secret text"
CARD_LABEL = "Lane closed"
CARD_ANSWER = json.dumps({"v": 1, "cards": [{"kind": "state", "key": "lane", "label": CARD_LABEL, "tone": "good"}]})
CARD_SCRIPT = f"echo '{CARD_ANSWER}'"
MESSAGE_TEXT = "the job is noted"
MESSAGE_SCRIPT = f"""echo '{{"v": 1, "tell": "{MESSAGE_TEXT}"}}'"""






def test_s17_a_commit_script_runs_on_its_own_thread_after_the_command_returns(played):
    story = event_plugin_story(played, {"event": TASK_CREATED, "commit": "see.sh"})
    server_commands(story)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not script_calls(story, "see.sh"))
    runner = story.container.get(CommitListenerRunner)
    runner.run_urgent()
    runner.run_ordinary()
    story.expect_rows(not script_calls(story, "see.sh"))
    runner.run_plugin_deliveries()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1)




def test_a_change_with_no_script_on_its_key_writes_no_delivery_and_adds_no_query(played):
    story = event_plugin_story(played, {"event": PIN_CREATED, "commit": "see.sh"})
    subscriptions = story.container.get(PluginSubscriptions)
    row_total = story.container.get(Database).repeated_work
    subscriptions.scripts("task.create", EventForm.COMMIT)
    initial_total = row_total.points()
    story.expect_rows(subscriptions.scripts("task.create", EventForm.COMMIT) == (), row_total.points().statements == initial_total.statements)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not deliveries(story))


def test_s19_a_system_event_reaches_a_commit_script_with_no_agent_and_no_environment(played):
    story = event_plugin_story(played, {"event": "core.journal.booting", "commit": "see.sh"})
    BootingWork().run(story.container)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1, plugin_row(story).fault_count == 0)
    story.expect_rows(calls[0]["event"] == "core.journal.booting", calls[0]["agent"] is None, calls[0]["environment"] == "", event_data(calls[0])["final"] is True)






