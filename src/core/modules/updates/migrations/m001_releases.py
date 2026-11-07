from core.base.database.migration import Migration


class ReleasesTableMigration(Migration):
    """Creates the releases table, one row for each release installed."""

    number = 1
    statements = (
        "CREATE TABLE releases (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, checksum TEXT NOT NULL,"
        " tag TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
