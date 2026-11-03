from core.base.actor import CORE_ACTOR_ID
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.registry.registry import Registry
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.chat.support.mark_samples import EXCEPTION_SAMPLE, marks_text
from tests.stories.core.support.fixtures import UserJoined

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
    assert [(mark.type, mark.family, mark.group, mark.shipped) for mark in marks] == [("chat.exception", "chat.exceptions", "journal", True), ("chat.upgrade", "chat.upgrade", "journal", True)]


def test_a_failing_command_shows_one_exception_mark_and_the_file_keeps_the_trace(new_story):
    story = new_story(EXCEPTION_SAMPLE, fixture=UserJoined)
    story.run("chat-mark fail", environment_id=1)
    story.run_listeners()
    assert marks_text(story).count("RuntimeError: the sample command broke") == 1, marks_text(story) + story.error_log_text()
    assert "the sample command broke" in story.error_log_text() and "Traceback" in story.error_log_text()
    story.expect_text("journal-exception list", "RuntimeError")


def test_a_failing_hook_rule_shows_one_exception_mark_and_the_file_keeps_the_trace(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    assert marks_text(story).count("samples.failing-rule") == 1, marks_text(story) + story.error_log_text()
    assert "the sample rule failed" in story.error_log_text()


def test_a_database_that_holds_faults_upgrades_to_exceptions_with_its_marks_events_and_cursor(new_story):
    story = new_story(fixture=UserJoined)
    database = story.container.get(Database)
    for sql in OLD_TABLE_STATEMENTS:
        database.update(Statement(sql))
    code, output = story.synced()
    assert code == 0, output
    database = story.container.get(Database)
    story.expect_text("journal-exception list", "KeyError: gone", "task start 3")
    assert [(row["type"], row["target_model"]) for row in database.rows(Statement("SELECT type, target_model FROM chat_marks WHERE key = 'command failed:1:1'"))] == [("chat.exception", "journal-exception")]
    assert [(row["name"], row["row_table"], row["command"]) for row in database.rows(Statement("SELECT name, row_table, command FROM events WHERE row_id = 1 AND name LIKE 'journal_%'"))] == [("journal_exception.create", "journal_exceptions", "RecordJournalException")]
    assert [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE name = 'journal_faults'"))] == []
    assert [row["listener"] for row in database.rows(Statement("SELECT listener FROM listener_cursors WHERE listener IN ('chat.exception-mark', 'chat.fault-mark')"))] == ["chat.exception-mark"]
