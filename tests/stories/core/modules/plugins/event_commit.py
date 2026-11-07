from datetime import timedelta

from server.booting_work import BootingWork
import json

from core.base.change.event_log import HIDDEN
from core.base.command.bus import Bus
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.base.database.database import Database
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.model.event_form import EventForm
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions
from tests.stories.core.modules.plugins.support.event_modules import FAILS_LATER, LATER_REFUSAL, NOTES, REFUSED_TITLE
from tests.stories.core.modules.plugins.support.event_stories import (
    PIN_CREATED, SECOND_JOB, commands_as_in_a_server, SECOND_JOB_TITLE, TASK_CREATED, data_row, deliveries, event_data, event_plugin_story, plugin_data, plugin_page, plugin_row, script_calls, tasks_titled)

LONG_TEXT = "a long brief " * 10000
FAILING_COUNT = 5
RECOVERING = 'if [ ! -e "$JOURNAL_PLUGIN_DATA/recovered" ]; then exit 3; fi'
NOTE_SECRET = "the secret text"
CARD_LABEL = "Lane closed"
CARD_ANSWER = json.dumps({"v": 1, "cards": [{"kind": "state", "key": "lane", "label": CARD_LABEL, "tone": "good"}]})
CARD_SCRIPT = f"echo '{CARD_ANSWER}'"
MESSAGE_TEXT = "the job is noted"
MESSAGE_SCRIPT = f"""echo '{{"v": 1, "tell": "{MESSAGE_TEXT}"}}'"""


def test_s14_a_commit_script_receives_the_key_the_row_and_final_true_even_for_a_long_row(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    story.expect_success(f'task make "{SECOND_JOB_TITLE}" --brief "{LONG_TEXT}" --environment main', actor=story.agent)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1)
    call = calls[0]
    data = event_data(call)
    story.expect_rows(call["event"] == TASK_CREATED, call["environment"] == "main", call["agent"] == story.agent.id, call["window_ms"] is None, bool(call["role"]))
    story.expect_rows(data["form"] == "commit", data["final"] is True, data["log_name"] == "task.create", int(data["event_id"]) > 0)
    story.expect_rows(data_row(call)["title"] == SECOND_JOB_TITLE, data_row(call)["brief"] == LONG_TEXT, data_row(call, "old_row") == {})


def test_s15_a_later_listener_that_fails_leaves_no_delivery_and_the_script_never_runs(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"}, modules=[FAILS_LATER])
    story.expect_success(SECOND_JOB, actor=story.agent)
    saved = len(deliveries(story))
    story.expect_rows(saved == 1)
    story.expect_refusal(f'task make "{REFUSED_TITLE}" --brief "Do it" --environment main', LATER_REFUSAL, actor=story.agent)
    story.expect_rows(len(deliveries(story)) == saved)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == saved, not tasks_titled(story, REFUSED_TITLE))


def test_s16_a_commit_script_on_a_deleted_row_receives_the_last_row(new_story):
    story = event_plugin_story(new_story, {"event": "acme.events.event_note.deleted", "commit": "see.sh"}, modules=[NOTES])
    story.expect_success('event-note make "A note"', actor=story.user)
    story.expect_success("event-note delete 1", actor=story.user)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1)
    story.expect_rows(data_row(calls[0])["title"] == "A note", event_data(calls[0])["log_name"] == "event_note.delete")


def test_s17_a_commit_script_runs_on_its_own_thread_after_the_command_returns(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    commands_as_in_a_server(story)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not script_calls(story, "see.sh"))
    runner = story.container.get(CommitListenerRunner)
    runner.run_urgent()
    runner.run_ordinary()
    story.expect_rows(not script_calls(story, "see.sh"))
    runner.run_plugin_deliveries()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1)


def test_s18_a_failing_commit_script_keeps_the_change_shows_on_the_card_and_runs_once(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "fail.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.run_listeners()
    story.expect_rows(len(tasks_titled(story, SECOND_JOB_TITLE)) == 1, len(script_calls(story, "fail.sh")) == 1)
    page = plugin_page(story)
    page.expect_fault("it ended with code 3", f"at {TASK_CREATED} (commit)")


def test_s18_the_fifth_fault_shows_the_failing_mark_and_a_success_clears_it(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "recovering.sh"}, scripts={"recovering.sh": RECOVERING})
    for number in range(FAILING_COUNT):
        story.expect_success(f'task make "Job {number}" --brief "Do it" --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", f"Plugin events is failing: it ended with code 3 at {TASK_CREATED} (commit)", actor=story.user)
    plugin_data(story, "recovered").touch()
    story.advance(timedelta(minutes=6))
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "Plugin events answers again", actor=story.user)
    story.expect_rows(plugin_row(story).fault_count == 0)


def test_a_commit_script_that_answers_refuse_is_a_fault_and_the_change_stays(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "refuse.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(tasks_titled(story, SECOND_JOB_TITLE)) == 1, plugin_row(story).last_fault == f"it answered refuse at {TASK_CREATED} (commit): not today")


def test_a_fault_write_starts_no_script_on_the_plugin_row(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "fail.sh"}, {"event": "core.plugins.plugin.updated", "commit": "see.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(plugin_row(story).fault_count == 1, len(script_calls(story, "fail.sh")) == 1, not script_calls(story, "see.sh"))


def test_a_tell_goes_to_the_queue_of_the_agent_that_made_the_change(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "told.sh"}, scripts={"told.sh": MESSAGE_SCRIPT})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    queue_files = list(plugin_data(story, "queue").glob("delivery-*.json"))
    story.expect_rows(len(queue_files) == 1, MESSAGE_TEXT in queue_files[0].read_text())


def test_a_tell_with_no_agent_is_dropped(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "told.sh"}, scripts={"told.sh": MESSAGE_SCRIPT})
    story.expect_success(SECOND_JOB, actor=story.user)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "told.sh")) == 1, not list(plugin_data(story, "queue").glob("delivery-*.json")), plugin_row(story).fault_count == 0)


def test_a_change_with_no_script_on_its_key_writes_no_delivery_and_adds_no_query(new_story):
    story = event_plugin_story(new_story, {"event": PIN_CREATED, "commit": "see.sh"})
    subscriptions = story.container.get(PluginSubscriptions)
    row_total = story.container.get(Database).tally
    subscriptions.scripts("task.create", EventForm.COMMIT)
    initial_total = row_total.points()
    story.expect_rows(subscriptions.scripts("task.create", EventForm.COMMIT) == (), row_total.points().statements == initial_total.statements)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not deliveries(story))


def test_s19_a_system_event_reaches_a_commit_script_with_no_agent_and_no_environment(new_story):
    story = event_plugin_story(new_story, {"event": "core.journal.booting", "commit": "see.sh"})
    BootingWork().run(story.container)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1, plugin_row(story).fault_count == 0)
    story.expect_rows(calls[0]["event"] == "core.journal.booting", calls[0]["agent"] is None, calls[0]["environment"] == "", event_data(calls[0])["final"] is True)


def test_s20_a_hidden_field_reaches_a_script_written_as_hidden(new_story):
    story = event_plugin_story(new_story, {"event": "acme.events.event_note.updated", "commit": "see.sh"}, modules=[NOTES])
    story.expect_success(f'event-note make "A note" --secret "{NOTE_SECRET}"', actor=story.user)
    story.expect_success('event-note edit 1 --secret "another secret"', actor=story.user)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1)
    data = event_data(calls[0])
    story.expect_rows(data_row(calls[0])["secret"] == HIDDEN, data_row(calls[0], "old_row")["secret"] == HIDDEN, data["changed"]["secret"] == [HIDDEN, HIDDEN])
    story.expect_rows(NOTE_SECRET not in str(calls[0]), "another secret" not in str(calls[0]))


def test_a_commit_script_card_on_a_person_change_shows_in_the_environment_and_updates_in_place(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "card.sh"}, scripts={"card.sh": CARD_SCRIPT})
    story.expect_success(SECOND_JOB, actor=story.user)
    story.expect_success('task make "Third job" --brief "Do it" --environment main', actor=story.user)
    story.run_listeners()
    marks = story.run("chat-mark list --environment 1", actor=story.user).output_text
    story.expect_rows(marks.count(CARD_LABEL) == 1)


def test_a_hears_card_for_a_person_still_does_not_show(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"}, program="card.sh", hears=["file_edited"], scripts={"card.sh": CARD_SCRIPT})
    story.container.get(Bus).run(AddPluginOutput(plugin_row(story).id, None, CARD_ANSWER), story.user)
    story.run_listeners()
    story.expect_no_text("chat-mark list --environment 1", CARD_LABEL, actor=story.user)


def test_a_tell_that_could_not_judge_reaches_the_queue_and_counts_no_fault(new_story):
    script = """echo '{"v": 1, "tell": "could not judge this: the parser failed"}'"""
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "told.sh"}, scripts={"told.sh": script})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    queue_files = list(plugin_data(story, "queue").glob("delivery-*.json"))
    story.expect_rows(len(queue_files) == 1, "could not judge this" in queue_files[0].read_text(), plugin_row(story).fault_count == 0, not plugin_row(story).last_fault)
