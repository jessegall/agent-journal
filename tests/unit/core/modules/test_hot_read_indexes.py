import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.module.journal_container import opened_container
from engine.journal.journal_home import JournalHome
from engine.module.module_sync import ModuleSync
from core.modules.tasks.models.support.views import closed_task_counts_select


@pytest.fixture
def database(tmp_path):
    container = opened_container(JournalHome(tmp_path))
    container.get(ModuleSync).run()
    opened = container.get(Database)
    yield opened
    opened.close()


@pytest.mark.parametrize("statement,index", [
    (Statement(closed_task_counts_select(1), ("2026-11-01", 1, "2026-11-01")), "tasks_environment_closed"),
    (Statement("SELECT * FROM plugin_queue_files WHERE plugin_id = ? AND name = ?", (1, "card.json")), "plugin_queue_files_plugin_name"),
    (Statement("SELECT * FROM checks WHERE removed_at IS NULL AND task_wait_id > ?", [0]), "checks_open_task_wait"),
    (Statement("SELECT id FROM agents WHERE role <> ?", ["main"]), "agents_role"),
    (Statement("SELECT * FROM worker_worktrees WHERE environment_id = ? AND removed_at IS NULL ORDER BY id", [1]), "worker_worktrees_open_environment"),
    (Statement("SELECT * FROM watches WHERE process_id = ? AND state = ?", (1, "open")), "watches_process_state"),
    (Statement("SELECT * FROM reader_requests WHERE completed_at IS NULL"), "reader_requests_open_command"),
    (Statement("SELECT * FROM proofs WHERE process_id = ? AND state = ?", (1, "running")), "proofs_process_state"),
    (Statement("SELECT * FROM affected_tests WHERE process_id = ? AND state IN (?, ?)", (1, "picking", "testing")), "affected_tests_process_state"),
    (Statement("SELECT * FROM phones WHERE state = ? AND notice_waiting = ?", ("paired", 0)), "phones_state_notice"),
    (Statement("SELECT * FROM reviewers WHERE environment_id = ? AND state = ?", (1, "idle")), "reviewers_environment_state"),
    (Statement("SELECT count(*) FROM memories"), "memories_environment_agent_weight"),
    (Statement("SELECT * FROM reminders WHERE environment_id = ? AND ended_at IS NULL ORDER BY id", [1]), "reminders_environment"),
    (Statement("SELECT * FROM questions WHERE session_agent_id = ? AND state = ? ORDER BY id", (1, "answered")), "questions_agent_state"),
    (Statement("SELECT * FROM dumps WHERE closed_at IS NULL ORDER BY id LIMIT 1"), "dumps_closed_at"),
    (Statement("SELECT * FROM messages WHERE parent_id = ? AND type = ? LIMIT 1", (1, "agent")), "messages_parent_type"),
    (Statement("SELECT * FROM checks WHERE removed_at IS NULL AND task_wait_id > ? AND last_passed = ? ORDER BY id LIMIT 25", (0, 0)), "checks_open_result"),
    (Statement("SELECT * FROM secrets WHERE deleted_at IS NULL ORDER BY id"), "secrets_active"),
    (Statement("SELECT 1 FROM agent_lines WHERE source = ? AND text = ? LIMIT 1", ("workers.launch-failed", "Could not start")), "agent_lines_source_text"),
    (Statement("SELECT * FROM agent_blocks WHERE session_agent_id = ?", [1]), "agent_blocks_open"),
    (Statement("SELECT * FROM reader_requests WHERE sample_process_id = ?", [1]), "reader_requests_sample_process"),
    (Statement("SELECT * FROM sequence_runs WHERE session_agent_id = ?", [1]), "sequence_runs_agent"),
    (Statement("SELECT * FROM checks WHERE task_wait_id = ?", [1]), "checks_task_wait"),
    (Statement("SELECT * FROM affected_tests WHERE worktree_id = ? ORDER BY id DESC LIMIT 1", [1]), "affected_tests_worktree"),
    (Statement("SELECT * FROM worker_worktrees WHERE environment_id = ?", [1]), "worker_worktrees_environment"),
    (Statement("SELECT * FROM proofs WHERE state IN (?, ?) ORDER BY id LIMIT 25", ("queued", "running")), "proofs_state"),
    (Statement("SELECT * FROM proofs WHERE creator_id = ? ORDER BY id LIMIT 25", [1]), "proofs_creator"),
    (Statement("SELECT * FROM affected_tests WHERE state = ? ORDER BY id LIMIT 25", ["queued"]), "affected_tests_state"),
    (Statement("SELECT * FROM checks WHERE hidden = ? AND removed_at IS NULL ORDER BY id", [0]), "checks_open_hidden"),
    (Statement("SELECT * FROM outputs WHERE reader_id = ?", [1]), "outputs_reader"),
    (Statement("SELECT * FROM outputs WHERE creator_id = ? ORDER BY id DESC LIMIT 15", [1]), "outputs_creator"),
    (Statement("SELECT * FROM reader_requests WHERE reader_id = ?", [1]), "reader_requests_reader"),
    (Statement("SELECT * FROM plugin_outputs WHERE plugin_id = ? ORDER BY id DESC LIMIT 50", [1]), "plugin_outputs_plugin"),
    (Statement("SELECT * FROM share_comments WHERE share_link_id = ? ORDER BY id", [1]), "share_comments_link"),
    (Statement("SELECT * FROM reviews WHERE state = ? ORDER BY id", ["queued"]), "reviews_state"),
    (Statement("SELECT * FROM agents WHERE parent_id = ? ORDER BY id DESC LIMIT 25", [1]), "agents_parent"),
    (Statement("SELECT * FROM hook_calls WHERE session_agent_id = ? AND hook = ? AND tool = ? AND answer = ? ORDER BY id DESC LIMIT 1", [1, "pre_tool_use", "Monitor", "allowed"]),
     "hook_calls_agent_tool_answer"),
    (Statement("SELECT count(*) FROM chat_marks WHERE session_agent_id = ? OR session_agent_id IS NULL", [1]), "chat_marks_agent"),
    (Statement("SELECT * FROM sequence_run_rows ORDER BY id DESC LIMIT 25"), "sequence_runs_open_id"),
    (Statement("SELECT * FROM chat_messages ORDER BY id DESC LIMIT 25"), "messages_chat_visible_id"),
    (Statement("SELECT * FROM nudge_totals LIMIT 25"), "nudge_records_key_delivery"),
    (Statement("SELECT count(*) FROM refusals WHERE reason GLOB ?", ["reader request 1 save failed: *"]), "refusals_reason"),
    (Statement("SELECT * FROM task_edges LIMIT 25 OFFSET 0"), "task_waits_open_edges"),
])
def test_a_hot_read_uses_its_index(database, statement, index):
    plans = [row[3] for row in database.connection.execute(f"EXPLAIN QUERY PLAN {statement.sql}", statement.parameters)]
    assert any(index in plan for plan in plans), plans
