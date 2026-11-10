from engine.database.migration import Migration


class PrivateDataFlagsMigration(Migration):
    """Creates the record of each place the private data scan found."""

    number = 2
    statements = (
        "CREATE TABLE private_data_marks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " finding_key TEXT NOT NULL, text TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
