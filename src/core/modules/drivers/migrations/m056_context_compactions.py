from engine.database.migration import Migration


class ContextCompactionsMigration(Migration):
    """Creates the table of compactions and clears of agents' contexts, one row each."""

    number = 56
    statements = [
        "CREATE TABLE context_compactions (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " change TEXT NOT NULL, reason TEXT NOT NULL, state TEXT NOT NULL, line TEXT NOT NULL DEFAULT '', request_tokens INTEGER, tokens_after INTEGER,"
        " started_at TEXT, ended_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX context_compactions_agent ON context_compactions (session_agent_id, id)",
    ]
