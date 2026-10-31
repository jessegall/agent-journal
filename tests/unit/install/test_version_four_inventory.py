from core.base.module.module_finder import DEFAULT_MODULE_LISTS
from install.upgrade_text import BOOKKEEPING_TABLES, WAITING_TABLES

VERSION_FOUR_TABLES = ("agents", "aliases", "checks", "collections", "command_outputs", "dashboard_rows", "doc_revisions", "docs", "dumps", "edits", "entries",
                       "environments", "journal_versions", "library_items", "links", "mcp_servers", "memories", "messages", "migrated_rows", "migrations", "notices",
                       "phases", "phone_codes", "phones", "plan_reviews", "plans", "plugins", "proofs", "questions", "reactions", "reader_reports",
                       "reader_suggestions", "release_messages", "reminders", "reports", "rules", "scheduled_jobs", "secrets", "sent_agents", "sequences",
                       "settings", "shares", "state_transitions", "statistics", "subagents", "suggestions", "task_logs", "tasks", "templates", "test_turns",
                       "timings", "triggers", "users", "version3_migrations", "worker_todos")


def claimed_tables() -> set[str]:
    modules = [module for path in DEFAULT_MODULE_LISTS for module in path.value()]
    return {table for module in modules for move in module.moves for table in (*move.reads, *move.drops)}


def test_every_version_4_table_is_moved_waits_for_a_task_or_is_kept_as_version_4s_own_records():
    accounted = claimed_tables() | set(WAITING_TABLES) | set(BOOKKEEPING_TABLES)
    assert [table for table in VERSION_FOUR_TABLES if table not in accounted] == []


def test_no_table_is_both_moved_and_waiting():
    assert claimed_tables() & set(WAITING_TABLES) == set()
