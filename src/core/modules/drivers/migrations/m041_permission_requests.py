from core.base.database.migration import Migration


class PermissionRequestsMigration(Migration):
    """Records the requests of agents to do one thing they may not, with the answer to each."""

    number = 41
    statements = [
        "CREATE TABLE permission_requests (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " asker_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, action TEXT NOT NULL, reason TEXT NOT NULL, needs_person INTEGER NOT NULL DEFAULT 0,"
        " answered_by_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, state TEXT NOT NULL DEFAULT 'requested', version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX permission_requests_asker ON permission_requests(asker_id, state)",
    ]
