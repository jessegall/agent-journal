from engine.database.migration import Migration


class ProviderOutagesMigration(Migration):
    """Records temporary program outages and retains their history."""

    number = 4
    statements = [
        "CREATE TABLE provider_outages (id INTEGER PRIMARY KEY, program TEXT NOT NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), reason TEXT NOT NULL, ends_at TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX provider_outages_program_ends_at ON provider_outages (program, ends_at)",
    ]
