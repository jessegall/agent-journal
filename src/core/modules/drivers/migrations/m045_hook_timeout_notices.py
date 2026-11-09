from core.base.database.migration import Migration


class HookTimeoutNoticesMigration(Migration):
    """Creates the record of each notice that an agent's hooks kept timing out."""

    number = 45
    statements = (
        "CREATE TABLE hook_timeout_notices (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " receiver_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, timeout_count INTEGER NOT NULL, slowest_rule TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
