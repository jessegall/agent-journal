from datetime import timedelta

from engine.actor.actor import CORE_ACTOR_ID
from engine.cli.console import Console
from engine.database.database import Database
from engine.database.statement import Statement
from engine.registry.registry import Registry
from tests.stories.core.modules.chat.support.mark_samples import EXCEPTION_SAMPLE, marks_text
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_count_marks, expect_system_log_with, expect_value

STAMP = "2026-01-01T00:00:00+00:00"
OLD_TABLE_STATEMENTS = (
    "ALTER TABLE journal_exceptions RENAME TO journal_faults",
    "DROP TRIGGER IF EXISTS chat_marks_rule_type_insert",
    "DROP TRIGGER IF EXISTS chat_marks_rule_type_update",
    "DELETE FROM migrations WHERE module = 'journal.core.chat' AND number = 4",
    f"INSERT INTO journal_faults (environment_id, creator_id, source, message, created_at, updated_at) VALUES (1, {CORE_ACTOR_ID}, 'task start 3', 'KeyError: gone', '{STAMP}', '{STAMP}')",
    f"INSERT INTO chat_marks (environment_id, creator_id, type, variant, key, text, target_model, target_id, created_at, updated_at)"
    f" VALUES (1, {CORE_ACTOR_ID}, 'chat.fault', 'command failed', 'command failed:1:1', 'KeyError: gone (task start 3)', 'journal-fault', 1, '{STAMP}', '{STAMP}')",
    f"INSERT INTO events (actor_id, environment_id, row_id, name, row_table, command, created_at)"
    f" VALUES ({CORE_ACTOR_ID}, 1, 1, 'journal_fault.create', 'journal_faults', 'RecordJournalFault', '{STAMP}')",
    "UPDATE listener_cursors SET listener = 'chat.fault-mark' WHERE listener = 'chat.exception-mark'",
)


def test_the_chat_module_declares_the_exception_and_upgrade_marks_under_the_journal_group(new_story):
    story = new_story(fixture=UserJoined)
    marks = [mark for mark in Registry.read(story.container.get(Database)).marks if mark.module == "journal.core.chat"]
    expect_type_mark_family(marks, [("chat.exception", "chat.exceptions", "journal", True), ("chat.upgrade", "chat.upgrade", "journal", True), ("chat.private-data", "chat.private-data", "journal", True)])


def test_a_repeated_exception_shows_once_within_a_minute_and_again_after_it(new_story):
    story = new_story(EXCEPTION_SAMPLE, fixture=UserJoined)
    story.run("chat-mark fail", environment_id=1)
    story.run("chat-mark fail", environment_id=1)
    story.run_listeners()
    expect_count_marks(story, "RuntimeError: the sample command broke", 1)
    story.advance(timedelta(seconds=61))
    story.run("chat-mark fail", environment_id=1)
    story.run_listeners()
    expect_count_marks(story, "RuntimeError: the sample command broke", 2)


def test_an_exception_older_than_a_minute_when_its_listener_reaches_it_shows_no_mark(new_story):
    story = new_story(EXCEPTION_SAMPLE, fixture=UserJoined)
    story.run("chat-mark fail", environment_id=1)
    story.advance(timedelta(seconds=61))
    story.run_listeners()
    expect_count_marks(story, "RuntimeError: the sample command broke", 0)


def test_a_failing_command_shows_one_exception_mark_and_the_file_keeps_the_trace(new_story):
    story = new_story(EXCEPTION_SAMPLE, fixture=UserJoined)
    story.run("chat-mark fail", environment_id=1)
    story.run_listeners()
    expect_count_marks(story, "RuntimeError: the sample command broke", 1)
    expect_system_log_with(story, "the sample command broke")
    expect_system_log_with(story, "Traceback")
    story.expect_text("journal-exception list", "RuntimeError")


def closed_pipe(*_arguments: object) -> None:
    raise BrokenPipeError


def test_a_command_whose_reader_went_away_records_no_exception(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    with monkeypatch.context() as patched:
        patched.setattr(Console, "run_parsed", closed_pipe)
        story.run("task list", environment_id=1)
    story.expect_no_text("journal-exception list", "BrokenPipeError")


def test_a_database_that_holds_faults_upgrades_to_exceptions_with_its_marks_events_and_cursor(new_story):
    story = new_story(fixture=UserJoined)
    database = story.container.get(Database)
    for sql in OLD_TABLE_STATEMENTS:
        database.update(Statement(sql))
    code, output = story.synced()
    expect_value(code, 0)
    database = story.container.get(Database)
    story.expect_text("journal-exception list", "KeyError: gone", "task start 3")
    expect_type_target_model(database, "SELECT type, target_model FROM chat_marks WHERE key = 'command failed:1:1'", [("chat.exception", "journal-exception")])
    expect_table_database(database, "SELECT name, row_table, command FROM events WHERE row_id = 1 AND name LIKE 'journal_%'", [("journal_exception.create", "journal_exceptions", "RecordJournalException")])
    expect_database(database, "SELECT name FROM sqlite_master WHERE name = 'journal_faults'", [])
    expect_listener_database(database, "SELECT listener FROM listener_cursors WHERE listener IN ('chat.exception-mark', 'chat.fault-mark')", ["chat.exception-mark"])


def expect_listener_database(database, text, expected) -> None:
    actual = [row['listener'] for row in database.rows(Statement(text))]
    assert actual == expected, actual


def expect_database(database, text, expected) -> None:
    actual = [row['name'] for row in database.rows(Statement(text))]
    assert actual == expected, actual


def expect_table_database(database, text, expected) -> None:
    actual = [(row['name'], row['row_table'], row['command']) for row in database.rows(Statement(text))]
    assert actual == expected, actual


def expect_type_target_model(database, text, expected) -> None:
    actual = [(row['type'], row['target_model']) for row in database.rows(Statement(text))]
    assert actual == expected, actual


def expect_type_mark_family(marks, expected) -> None:
    actual = [(mark.type, mark.family, mark.group, mark.shipped) for mark in marks]
    assert actual == expected, actual


def test_a_person_marks_a_recorded_error_solved_and_it_leaves_the_list(new_story):
    story = new_story(EXCEPTION_SAMPLE, fixture=UserJoined)
    story.run("chat-mark fail", environment_id=1)
    story.expect_text("journal-exception list", "RuntimeError")
    story.expect_success("journal-exception solve 1", actor=story.user)
    story.expect_no_text("journal-exception list", "RuntimeError")
