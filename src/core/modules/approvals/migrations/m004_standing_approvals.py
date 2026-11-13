from engine.database.migration import Migration


class StandingApprovalsMigration(Migration):
    """Adds the standing yeses of a user, and which of them accepted a request."""

    number = 4
    statements = [
        "CREATE TABLE standing_approvals (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, scope TEXT NOT NULL, kind TEXT NOT NULL, target TEXT NOT NULL,"
        " same_key TEXT NOT NULL, text TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX standing_approvals_kind ON standing_approvals(environment_id, kind)",
        "ALTER TABLE approvals ADD COLUMN standing_id INTEGER",
    ]
