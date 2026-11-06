from server.booting_work import BootingWork
from core.base.change.event_log import HIDDEN
from core.base.listener.commit_listener_runner import CommitListenerRunner
from tests.stories.core.modules.plugins.support.event_modules import FAILS_LATER, LATER_REFUSAL, NOTES, REFUSED_TITLE
from tests.stories.core.modules.plugins.support.event_stories import (
    SECOND_JOB, SECOND_JOB_TITLE, TASK_CREATED, data_row, deliveries, event_data, event_plugin_story, plugin_data, plugin_page, plugin_row, script_calls, tasks_titled)

LONG_TEXT = "a long brief " * 10000
FAILING_COUNT = 5
RECOVERING = 'if [ ! -e "$JOURNAL_PLUGIN_DATA/recovered" ]; then exit 3; fi'
NOTE_SECRET = "the secret text"


def test_s14_a_commit_script_receives_the_key_the_row_and_final_true_even_for_a_long_row(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    story.expect_success(f'task make "{SECOND_JOB_TITLE}" --brief "{LONG_TEXT}" --environment main', actor=story.agent)
    story.expect_rows(not script_calls(story, "see.sh"))
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1)
    call = calls[0]
    data = event_data(call)
    story.expect_rows(call["event"] == TASK_CREATED, call["environment"] == "main", call["agent"] == story.agent.id)
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
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "Plugin events answers again", actor=story.user)
    story.expect_rows(plugin_row(story).fault_count == 0)


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
