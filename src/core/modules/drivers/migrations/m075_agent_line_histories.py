from engine.database.migration import Migration

ROW_COLUMNS = ("version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL,"
               " updated_at TEXT NOT NULL")


class AgentLineHistoriesMigration(Migration):
    """Keeps when each line source last told an agent a line in a table of its own, taken from the rule histories
    with no layer, and drops what the agent machine no longer has: the rule histories, the agent subjects, the
    driver comparisons and their stacks, and the stack's pinned parts."""

    number = 75
    statements = [
        "CREATE TABLE agent_line_histories (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        f" source_key TEXT NOT NULL, last_said_at TEXT NOT NULL, {ROW_COLUMNS}) STRICT",
        "CREATE UNIQUE INDEX agent_line_histories_source ON agent_line_histories (session_agent_id, source_key)",
        "INSERT INTO agent_line_histories (session_agent_id, source_key, last_said_at, created_at, updated_at)"
        " SELECT session_agent_id, rule, last_answer_at, created_at, updated_at FROM rule_histories WHERE layer = '' AND last_answer_at IS NOT NULL",
        "DROP TABLE rule_histories",
        "DROP TABLE agent_subjects",
        "DROP TABLE driver_comparisons",
        "DROP TABLE driver_comparison_stacks",
        "ALTER TABLE agent_stacks DROP COLUMN pinned_slices",
    ]
