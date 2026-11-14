from engine.database.migration import Migration


class UsageLimitsMigration(Migration):
    """Records the limits a user sets on a program's plan allowance."""

    number = 6
    statements = [
        "CREATE TABLE usage_limits (id INTEGER PRIMARY KEY, program TEXT NOT NULL, creator_id INTEGER NOT NULL REFERENCES actors(id),"
        " window TEXT NOT NULL, mode TEXT NOT NULL, percent REAL NOT NULL, baseline_percent REAL NOT NULL DEFAULT 0, baseline_marker REAL NOT NULL DEFAULT 0,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX usage_limits_program ON usage_limits (program)",
    ]
